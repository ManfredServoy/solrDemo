/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"99B32E98-46CB-45DC-BFB1-80EDE854E3DD",variableType:4}
 */
var shouldMonitor = 0;

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
	scopes.file.createIndex(indexPath)

}

/**
 * @properties={typeid:24,uuid:"DF74AD72-4268-4120-9D5F-8B1B74B7FB6E"}
 * @AllowToRunInFind
 */
function onActionFind() {
	if (queryString.length > 0) {
		query = "summary:*" + queryString + "*\ncontent:*" + queryString + "*";
		var results = search()
		var qb = datasources.db.smart_doc.results.createSelect();
		qb.where.add(qb.columns.real_id.isin(results))
		foundset.loadRecords(qb)
	} else {
		var snippets = datasources.mem.highlights.getFoundSet()
		snippets.loadAllRecords()
		snippets.deleteAllRecords()
		foundset.loadAllRecords()
	}
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
	filter = scopes.svyToolbarFilter.createFilterToolbar(elements.customlist, elements.groupingtable_1);
	scopes.svyToolbarFilter.setPopupDefaultOperator(scopes.svyToolbarFilter.FILTER_TYPES.TOKEN, scopes.svyPopupFilter.OPERATOR.LIKE);

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
 * @param {JSRecord<db:/smart_doc/results>} [record]
 * @param {JSEvent} [event]
 * @param {string} [columnid]
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"B5C4F0A2-236B-4020-9F14-BF8CAB44FC2B"}
 */
function onCellClick(foundsetindex, columnindex, record, event, columnid) {
	var maxColumns = elements[event.getElementName()].columns.length
	if (columnindex == maxColumns -1) {
		download(record)
	}
}

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {boolean}
 *
 * @properties={typeid:24,uuid:"7F966D4E-E97E-45A8-910F-566DF5F8AA0B"}
 */
function onDataChangeSwitch(oldValue, newValue, event) {
	if (newValue == 1) {
		startWatcher()
	} else {
		stopWatcher()
	}
	return false;
}


/**
 * TODO generated, please specify type and doc for the params
 * @param {JSRecord<db:/smart_doc/results>} file
 *
 * @properties={typeid:24,uuid:"B5042A5A-E4F1-4275-937B-74C96D52E9D1"}
 */
function download(file) {
	var f = plugins.file.convertToJSFile(file.path)
	//send the result back to the browser where the standard Save Download dialog will be displayed
	plugins.file.writeFile(file.originalname, f.getBytes())

}

//////•••••••••••••••••••••FOLDER WATCHER••••NEEDS TO MOVE TO SCOPE•••••••••••••••///////////////////////////////

/**
 * @type {scopes.watcher.FolderWatcher}
 *
 * @properties={typeid:35,uuid:"A7C9B739-1C28-443C-8290-67FF494641F8",variableType:-4}
 */
var watcher;

/**
 * @properties={typeid:24,uuid:"0A35AC63-3DF7-4E50-943E-50024C26D583"}
 */
function stopWatcher() {
	plugins.webnotificationsToastr.error("Stopped watching files")
	watcher.stopWatching();
}

/**
 * @properties={typeid:24,uuid:"830328A8-15F1-4216-9800-C9A4ABC82D16"}
 */
function startWatcher() {
	watcher = new scopes.watcher.FolderWatcher(indexPath, null, true);
	plugins.webnotificationsToastr.success("Started watching files")
	watcher.startWatching();
}

/**
 * @properties={typeid:24,uuid:"1EEF0474-606E-47A3-9051-C0F7D1CE7697"}
 * @param {String} filePath
 * @param {String} eventType
 */
function handleWatcherCallback(filePath, eventType) {
	switch (eventType.toString()) {
	case "ENTRY_CREATE":
		application.output("Created: " + filePath)
		scopes.file.createIndex(filePath)
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

