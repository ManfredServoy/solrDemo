/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"CB38C584-C49F-4861-89C9-CB0C3A13D332",variableType:4}
 */
var onlyNew = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B24CDB65-4AE3-4A16-8C5A-A3ED6A6D83C9"}
 */
var subPath = "";

/**
 * @param{JSUpload} upload
 *
 * @properties={typeid:24,uuid:"C3A09830-7104-4302-AD22-71B051D47E7E"}
 */
function storefile(upload) {
	//var location = plugins.SmartDoc.serverFolder
	var location = plugins.file.getDefaultUploadLocation()
	application.output(location)
	var serverfile = plugins.file.createFile(location + "/" + upload.name);
	plugins.file.writeFile(serverfile, upload.getBytes())

}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3C2E3076-3C06-49F7-BAF5-408C4603C408"}
 * @AllowToRunInFind
 */
function onAction(event) {
	foundset.loadAllRecords()
	//	application.output("SmartDoc plugin v"+plugins.SmartDoc.getVersion());

	// reset feedback window previous results:
	forms.results.feedback = '';

	// construct our parameter object:
	var params = {
		defaultLogin: 'myLogin',
		defaultPassword: 'myPassword',
		// the callback method that will save the results in the database
		callback: forms.results.processCallback,
		// the accepted extensions (if not provided, everything goes!)
		// accepted: ["html", "txt", "pdf"],
		// if true, will trim all double spacing/CR/LF/Tabs (can be overriden at the document level):
		trimUnwantedSpaces: true,
		// a rule or an array of rules to be used globally,
		// each one being an object with a Regexp pattern (java style)
		// and a replacement string
		// applied in sequence in the order provided
		// (rules can also be added at the document level):
		replaceRules: { pattern: "^\\d+ *|\\n\\d+ *", replacement: "" },
		// set the newPath to be used (can be overriden per document):
		newPath: getSubPath(),
		// creates a blank array (to be filled by later loops:
		documents: []
	}
	var count;
	// get a foundset from the 'urls' table:
//	var db = databaseManager.getDataSourceServerName(controller.getDataSource());
//	var fs = databaseManager.getFoundSet(db, 'urls');
//	fs.loadAllRecords();
//
//	// iterate on the urls to add to the params object
//	for (var index = 1; index <= databaseManager.getFoundSetCount(fs); index++) {
//		fs.setSelectedIndex(index);
//		var isNew = true;
//		// we use a find to determine if we need to insert or update in the database:
//		if (foundset.find()) {
//			foundset.id = fs.id;
//			count = foundset.search();
//			if (count == 0) {
//				// there's no record with that id, so we create one
//				foundset.newRecord(1, true);
//				// and save it to get its id:
//				databaseManager.saveData(foundset.getSelectedRecord());
//			} else {
//				isNew = false;
//				foundset.setSelectedIndex(1);
//			}
//		}
//		if (onlyNew == 0 || isNew) {
//			// we feed the documents array with a new object to be processed:
//			var obj = { id: foundset.id, url: fs.url };
//			// if a new path is set at the document level pass it into the object:
//			if (fs.new_path) {
//				obj.newPath = fs.new_path;
//			}
//			// if a new name is set at the document level it will override the renaming scheme:
//			if (fs.new_name) {
//				obj.newName = fs.new_name;
//			}
//			// if a login/password is provided for that url, add it to the document object:
//			if (fs.url_login && fs.url_pass) {
//				obj.login = fs.url_login;
//				obj.password = fs.url_pass;
//			}
//			// the 'extras' object can hold any property/value pair.
//			// useful to add some custom values to the Solr index along with the document
//			obj.extras = { };
//			// push extras parameters if needed
//			if (fs.extra_i) {
//				obj.extras.extra_i = fs.extra_i;
//			}
//			if (fs.extra_t) {
//				obj.extras.extra_t = fs.extra_t;
//			}
//			params.documents.push(obj);
//		}
//	}

	var uploads = plugins.file.getFolderContents("G://Dossiers//2018//2018061201")
	
	
	//var uploads = elements.multifileupload_1.getFiles()
	if (uploads.length > 0) {
		// we iterate on all the files:
		for (var i = 0; i < uploads.length; i++) {
			var upload = uploads[i];
			//var uploadName = upload.name
			
			//var file = plugins.file.convertToJSFile(plugins.file.getDefaultUploadLocation() + '/' + uploadName);
			// search if this file was not already processed:
			if (foundset.find()) {
				foundset.path = upload
				count = foundset.search()
				if (count == 0) {
					// that's a new one, let's create a record to hold the result:
					var fileRecord = foundset.getRecord(foundset.newRecord())
					databaseManager.saveData(fileRecord);
				} else {
					// there was one already
					fileRecord = foundset.getRecord(1)
				}
			}

			// split the fileName to get the extension:
//			var nameAndExtension = file.getName().split("\.");
//			// compute a new name:
//			var setName = "uploadedFile_" + (i + 1) + "." + nameAndExtension[1];
//			// feed the documents array with a new object to be processed:
//			
//			var filepath = plugins.file.getDefaultUploadLocation() + "/" + file.getName()
			params.documents.push({ id: fileRecord.id, file: upload, newName: upload });
		}
	}

	// show our feedback window:
	application.showFormInDialog(forms.results, 10, 10, -1, -1, "Results", true, false, "resultWindow", false);

	// Submit document(s) to the indexing process, contained in JS Object with the parameters:
	plugins.SmartDoc.submit(params);

}

/**
 * @properties={typeid:24,uuid:"49AF4173-BCA5-4E8D-B55B-9A99C05D5CC3"}
 */
function getSubPath() {
	if (subPath) {
		// check that subPath starts with '/' (relative to smartDocPlugin.saveToFolder property)
		if (subPath.substr(0, 1) == '/') {
			return subPath;
		} else {
			return '/' + subPath;
		}
	}
	return '/';
}

/**
 * @param {JSUpload} upload
 *
 * @properties={typeid:24,uuid:"1E58E111-EDCE-4BE5-BB05-628506C4F784"}
 */
function onFileUploaded(upload) {
	application.output('onfileuploaded')
	var location = plugins.file.getDefaultUploadLocation()
	var bool = upload.write(location + "/" + upload.getName())
	application.output(bool)
}

/**
 * @properties={typeid:24,uuid:"0FD02563-0189-44A6-BF77-61C323F677D2"}
 */
function resetUploader(){
	elements.multifileupload_1.reset()
}

/**
 * @param {JSEvent} event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"376C2823-C60F-4115-9FF6-22FB3949489B"}
 */
function onAction1(event) {
	forms.query.controller.show();
}
