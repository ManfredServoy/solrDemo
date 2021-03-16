/**
 * @public
 * @enum
 * @properties={typeid:35,uuid:"8A02ECA6-B306-4785-B189-0ED6781E7D91",variableType:-4}
 */
var WATCHER_EVENTS = {
	ENTRY_CREATE: 'ENTRY_CREATE',
	ENTRY_DELETE: '	ENTRY_DELETE',
	ENTRY_MODIFY: 'ENTRY_MODIFY'
}


/**
 * Folder watcher that can be used to watch a folder for changes.<br><br>
 *
 * Whenever a file or folder inside the folder being watched is added, modified or deleted,
 * the callback method is fired with a JSFile and any of the WATCHER_EVENT constants to
 * indicate the kind of event
 *
 * @param {String|plugins.file.JSFile} fileOrFilePath the file or path to the folder to watch
 * @param {Function} callback callback method to fire when a file is added, changed or removed
 * @param {Boolean} [recursive] when true, all folders inside the given folder are watched as well; folders added are then automatically watched as well
 *
 * @constructor
 *
 * @properties={typeid:24,uuid:"DFDBE4E1-6CA9-4880-9203-540B28D2DAE2"}
 */
function FolderWatcher(fileOrFilePath, callback, recursive) {

	if (! (this instanceof FolderWatcher)) {
		return new FolderWatcher(fileOrFilePath, callback, recursive);
	}

	try {
		var watchService = java.nio.file.FileSystems.getDefault().newWatchService();
	} catch (e) {
		application.output('Error acquiring a WatchService');
	}

	/**
	 * HashMap with watchKey -> path
	 */
	var watchKeys = new java.util.HashMap();

	var fileToWatch = getPathFromArgs(fileOrFilePath);

	/**
	 * @param {String|plugins.file.JSFile} fileArgs
	 * @return {java.nio.file.Path}
	 */
	function getPathFromArgs(fileArgs) {
		var path = null;
		if (fileArgs instanceof String) {
			path = java.nio.file.Paths.get(fileArgs.toString());
		} else if (fileArgs instanceof plugins.file.JSFile) {
			path = java.nio.file.Paths.get(fileArgs.getAbsolutePath());
		} else {
			application.output('Wrong arguments provided for FileWatcher');
		}
		return path;
	}

	/**
	 * @param {java.nio.file.Path} dirPath
	 */
	function registerDir(dirPath) {
		if (!java.nio.file.Files.isDirectory(dirPath, java.nio.file.LinkOption.NOFOLLOW_LINKS)) {
			return;
		}

		application.output('Found directory to watch: ' + dirPath);

		var watchKey = dirPath.register(watchService,
			java.nio.file.StandardWatchEventKinds.ENTRY_CREATE,
			java.nio.file.StandardWatchEventKinds.ENTRY_DELETE,
			java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY
		);

		watchKeys.put(watchKey, dirPath);

		if (recursive === true) {
			var dirContent = dirPath.toFile().listFiles();
			for (var f = 0; f < dirContent.length; f++) {
				registerDir(dirContent[f].toPath());
			}
		}
	}

	var r = new java.lang.Runnable({
			run: function() {
				try {
					application.output('FolderWatcher started for ' + fileToWatch.toString() + (recursive ? ' recursively' : ''));
					while (true) {
						var queuedKey = watchService.take();
						/** @type {Array<java.nio.file.WatchEvent>} */
						var watchEvents = queuedKey.pollEvents().toArray();
						for (var i = 0; i < watchEvents.length; i++) {
							application.output('FolderWatcherEvent: ' + watchEvents[i].kind() + ' : ' + watchEvents[i].context());

							//when recursive is true and a directory has been added, that needs to be watched for as well
							if (recursive && watchEvents[i].kind() == java.nio.file.StandardWatchEventKinds.ENTRY_CREATE) {
								/** @type {java.nio.file.Path} */
								var parentPath = watchKeys.get(queuedKey);
								/** @type {java.nio.file.Path} */
								var currPath = watchEvents[i].context();
								var fullCurrPath = parentPath.resolve(currPath);
								registerDir(fullCurrPath);
							}

							callback.call(null, plugins.file.convertToJSFile(watchEvents[i].context()), watchEvents[i].kind(), watchEvents[i].count());
						}
						if (!queuedKey.reset()) {
							application.output('Removing watch key');
							watchKeys.remove(queuedKey);
						}
						if (watchKeys.isEmpty()) {
							application.output('No more keys');
							break;
						}
					}
				} catch (e) {
					application.output('FolderWatcher stopped ' + e);
				}
			}
		});

	/**
	 * Starts watching the folder(s)
	 */
	this.startWatching = function() {
		try {
			registerDir(fileToWatch);
			Packages.com.servoy.j2db.J2DBGlobals.getServiceProvider().getScheduledExecutor().execute(r);
			return true;
		} catch (e) {
			application.output(e);
		}
		return false;
	}

	/**
	 * Stops the watcher
	 */
	this.stopWatching = function() {
		try {
			watchService.close();
			watchKeys.clear();
			watchService = null;
		} catch (e) {

		}
	}

	/**
	 * Adds a folder to watch
	 * @param {String|plugins.file.JSFile} folderToWatch
	 */
	this.addFolderToWatch = function(folderToWatch) {
		var folder = getPathFromArgs(folderToWatch);
		if (folder) {
			registerDir(folder);
		}
	}
}
