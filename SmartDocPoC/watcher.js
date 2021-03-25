/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"BCB7241B-F33B-4E73-B1BA-BCB0A7ED3E6E"}
 */
var indexPath


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
   
   if (!(this instanceof FolderWatcher)) {
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
   
   var methodToCall = scopes.svySystem.convertServoyMethodToQualifiedName(handleWatcherCallback);
   
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
       
       var watchKey = dirPath.register(
           watchService, 
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
   
   function executeCallback(file, eventType, count) {
       var callbackRunnable = new java.lang.Runnable({
           run: function() {
               scopes.svySystem.callMethod(methodToCall, [file, eventType, count]);
           }
       })
       Packages.com.servoy.j2db.J2DBGlobals.getServiceProvider().invokeLater(callbackRunnable);
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
                       
                       /** @type {java.nio.file.Path} */
                       var parentPath = watchKeys.get(queuedKey);
                       /** @type {java.nio.file.Path} */
                       var currPath = watchEvents[i].context();
                       var fullCurrPath = parentPath.resolve(currPath);

                       //when recursive is true and a directory has been added, that needs to be watched for as well
                       if (recursive && watchEvents[i].kind() == java.nio.file.StandardWatchEventKinds.ENTRY_CREATE) {
                           registerDir(fullCurrPath);
                       }
                       
                       executeCallback(plugins.file.convertToJSFile(fullCurrPath), watchEvents[i].kind(), watchEvents[i].count())
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
        	   application.output('FolderWatcher stopped');
        	   application.output(e);
        	   application.output(e.stack);
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
       } catch(e) {
           
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




//////•••••••••••••••••••••FOLDER WATCHER HANDLERS••••NEEDS TO MOVE TO SEPARATE SCOPE?•••••••••••••••///////////////////////////////

/**
 * @type {scopes.watcher.FolderWatcher}
 *
 * @properties={typeid:35,uuid:"BA446970-192D-4B6C-893E-ED7694D73A25",variableType:-4}
 */
var watcher;

/**
 * @properties={typeid:24,uuid:"E93396B9-B87E-4DFE-871B-5E7D5BFD70F6"}
 */
function stopWatcher() {
	plugins.webnotificationsToastr.error("Stopped watching files")
	watcher.stopWatching();
}

/**
 * @properties={typeid:24,uuid:"D8B8AA4E-E14F-4A14-91D0-0E5CE4E63872"}
 */
function startWatcher() {
	watcher = new scopes.watcher.FolderWatcher(indexPath, null, true);
	plugins.webnotificationsToastr.success("Started watching files")
	watcher.startWatching();
}

/**
 * @properties={typeid:24,uuid:"3DD2C287-2C1D-402D-A178-1B95FA06927A"}
 * @param {String} filePath
 * @param {String} eventType
 */
function handleWatcherCallback(filePath, eventType) {
	switch (eventType.toString()) {
	case "ENTRY_CREATE":
		application.output("Created: " + filePath)
		scopes.file.addFiles(filePath)
		break;

	case "ENTRY_MODIFY":
		application.output("Modified: " + filePath)
		break;

	case "ENTRY_DELETE":
		application.output("Deleted: " + filePath)
		break;

	default:
		break;
	}
}

