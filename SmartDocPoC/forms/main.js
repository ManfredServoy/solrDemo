/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E1635861-2CA9-4D18-B841-0DE72F51ED24"}
 */
var nullstring = "";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B1CB40F7-A39A-4386-B828-8014E8884433"}
 */
var dowloadClass = "fa fa-download";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F1A7BB59-CDE0-495F-BC09-71396A96AF38"}
 */
var queryString = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E509CB13-AA89-40F5-BCA3-8121298B6D56"}
 */
var indexPath = ""

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
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"2F89EB29-D231-4353-BA04-EFF6612B5E12"}
 */
function createIndex() {
	var accepted = ["htm", "html", "txt", "pdf", "docx", "doc", "docm", "msg", "eml"]

	foundset.loadAllRecords()
	// reset feedback window previous results:
	forms.results.feedback = '';

	// construct our parameter object:
	var params = {
		defaultLogin: 'myLogin',
		defaultPassword: 'myPassword',
		// the callback method that will save the results in the database
		callback: forms.results.processCallback,
		// the accepted extensions (if not provided, everything goes!)
		accepted: accepted,
		// if true, will trim all double spacing/CR/LF/Tabs (can be overriden at the document level):
		trimUnwantedSpaces: true,
		// a rule or an array of rules to be used globally,
		// each one being an object with a Regexp pattern (java style)
		// and a replacement string
		// applied in sequence in the order provided
		// (rules can also be added at the document level):
		replaceRules: { pattern: "^\\d+ *|\\n\\d+ *", replacement: "" },
		// set the newPath to be used (can be overridden per document):
		newPath: getSubPath(),
		// creates a blank array (to be filled by later loops:
		documents: []
	}
	
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

	// Get all the folder content recursively 
	var uploads = scopes.file.getContent(indexPath)
	
	// Query all the records
	/** @type {JSDataSet<path:String>} */
	var _dsExistingRec = databaseManager.getDataSetByQuery("smart_doc","SELECT path FROM results",null,-1)
	
	var _oExists = {};
	
	for (var r = 1; r <= _dsExistingRec.getMaxRowIndex(); r++) {
		_dsExistingRec.rowIndex = r;
		_oExists[_dsExistingRec.path] = true;
	}
	
	
	var _bSubmitted = false;
	// Loop through the missing objects
	if (uploads.length > 0) {
		for (var i = 0; i < uploads.length; i++) {
			var upload = uploads[i];
			if(!_oExists[upload.getPath()]){
				application.output('Eigen path: '+ upload.getPath())
				var ext = upload.getName().split('.').pop()
				if (accepted.indexOf(ext) > -1) {
					// that's a new one, let's create a record to hold the result:
					var fileRecord = foundset.getRecord(foundset.newRecord())
					databaseManager.saveData(fileRecord);
					params.documents.push({ id: fileRecord.id, file: upload, newName: upload });
					_bSubmitted = true;
				} 
			}
		}
	}

	// show our feedback window:
	application.showFormInDialog(forms.results, 10, 10, -1, -1, "Results", true, false, "resultWindow", false);
	if(!_bSubmitted){
		forms.results.feedback = 'Finished!'
	}
	// Submit document(s) to the indexing process, contained in JS Object with the parameters:
	plugins.SmartDoc.submit(params);

}

/**
 * @properties={typeid:24,uuid:"49AF4173-BCA5-4E8D-B55B-9A99C05D5CC3"}
 * @return {String}
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
 * @param {JSEvent} event
 * @private
 *
 * @properties={typeid:24,uuid:"376C2823-C60F-4115-9FF6-22FB3949489B"}
 */
function onActionShowAdvancedSearch(event) {
	forms.query.controller.show();
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"2780C685-9F25-4FED-AD68-E5CEBC3C6278"}
 */
function onActionReset(event) {
	foundset.loadAllRecords()
	foundset.deleteAllRecords()
	plugins.SmartDoc.removeAll()
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"4B37D35E-82D5-4F2C-86AD-D5768C2E7F8D"}
 */
function onActionCreateIndex(event) {
	createIndex()

}

/**
 * @properties={typeid:24,uuid:"DF74AD72-4268-4120-9D5F-8B1B74B7FB6E"}
 */
function onActionFind() {
	query = "summary:java\ncontent:*" + queryString + "*";
	var results = search()
	var qb = datasources.db.smart_doc.results.createSelect();
	qb.where.add(qb.columns.id.isin(results))
	foundset.loadRecords(qb)
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"3AAE8E63-3B61-496B-AF6E-CCDD16785884"}
 */
function onLoad(event) {
	indexPath = "G://Dossiers//2018//2018061201"

	if (application.getOSName().indexOf('Windows') == -1) {
		indexPath = "/Users/manfredwitteman/Downloads/testFiles";
	}
}

/**
 * Called when the mouse is clicked on a row/cell (foundset and column indexes are given) or.
 * when the ENTER key is used then only the selected foundset index is given
 * Use the record to exactly match where the user clicked on
 *
 * @param {number} foundsetindex
 * @param {number} [columnindex]
 * @param {JSRecord} [record]
 * @param {JSEvent} [event]
 * @param {string} [columnid]
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"B5C4F0A2-236B-4020-9F14-BF8CAB44FC2B"}
 */
function onCellClick(foundsetindex, columnindex, record, event, columnid) {
	if (columnindex == 3){
		download(record)
	}
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {JSRecord<db:/smart_doc/results>} file
 *
 * @properties={typeid:24,uuid:"B5042A5A-E4F1-4275-937B-74C96D52E9D1"}
 */
function download(file){
	var f  = plugins.file.convertToJSFile(file.path)
	//send the result back to the browser where the standard Save Download dialog will be displayed
	plugins.file.writeFile(file.originalname,f.getBytes())
	
}
