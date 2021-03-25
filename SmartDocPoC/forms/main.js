/** 
 * @type {scopes.svyToolbarFilter.ListComponentFilterRenderer}
 *
 * @properties={typeid:35,uuid:"19C9F804-E19D-45A9-9ADA-591E8EC4D00F",variableType:-4}
 */
var toolbarFilter;


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
 * TODO generated, please specify type and doc for the params
 * @param firstShow
 * @param event
 *
 * @properties={typeid:24,uuid:"45ADF17C-57FE-4501-B839-8629D344DD1E"}
 * @override
 */
function onShow(firstShow, event) {
	//plugins.keyListener.addKeyListener('search', onKey)
}

/**
 * @param value
 * @param event
 * @param keyCode
 * @param altKey
 * @param ctrlKey
 * @param shiftKey
 * @param capsLock
 *
 * @properties={typeid:24,uuid:"D0B5F29D-69E0-45B3-8972-24B831716908"}
 */
function onKey(value, event, keyCode, altKey, ctrlKey, shiftKey, capsLock){
        application.output("The new value is "+value);
}




/**
 * @param event
 *
 * @properties={typeid:24,uuid:"2780C685-9F25-4FED-AD68-E5CEBC3C6278"}
 */
function onActionReset(event) {
	application.output('resetting...')
	scopes.solr.isStopped = true
	plugins.SmartDoc.stopProcess()
	foundset.loadAllRecords()
	foundset.deleteAllRecords()
	plugins.SmartDoc.removeAll()
	var files = plugins.file.getFolderContents(plugins.SmartDoc.serverFolder)
	for (var f = 0; f < files.length; f++) {
		var file = files[f]
		plugins.file.deleteFile(file)
	}
}


//action to show a specific filter popup. The onClick event of the ListComponent
/**
 * @param entry
 * @param index
 * @param dataTarget
 * @param event
 *
 * @properties={typeid:24,uuid:"68C4040F-BB58-4BC3-B93E-E5DE78399A04"}
 */
function onListComponentClick(entry, index, dataTarget, event) {
        // propagate the onClick event into the toolbarFilter object to show the filter popup
	toolbarFilter.onClick(entry, index, dataTarget, event);
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"4B37D35E-82D5-4F2C-86AD-D5768C2E7F8D"}
 */
function onActionCreateIndex(event) {
	scopes.solr.isStopped = false
	scopes.file.addFiles(scopes.watcher.indexPath, true)

}

/**
 * @properties={typeid:24,uuid:"DF74AD72-4268-4120-9D5F-8B1B74B7FB6E"}
 * @AllowToRunInFind
 */
function onActionFind() {
	if (queryString.length > 0) {
		var q = scopes.solr.query(queryString)
		var results = search(q)
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
	toolbarFilter = scopes.svyToolbarFilter.createFilterToolbar(elements.customlist, elements.groupingtable_1);
	scopes.svyToolbarFilter.setPopupDefaultOperator(scopes.svyToolbarFilter.FILTER_TYPES.TOKEN, scopes.svyPopupFilter.OPERATOR.LIKE);

	scopes.watcher.indexPath = "G://Dossiers//2018//2018061201"

	if (application.getOSName().indexOf('Windows') == -1) {
		scopes.watcher.indexPath = "/Users/manfredwitteman/Downloads/testFiles";
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
//	var maxColumns = elements[event.getElementName()].columns.length
//	if (columnindex == maxColumns -1) {
//		download(record)
//	}
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
		scopes.watcher.startWatcher()
	} else {
		scopes.watcher.stopWatcher()
	}
	return false;
}





/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"80555ADB-7C9A-4EB1-B8AE-66F3798E4C45"}
 */
function onFocusGainedSearch(event) {
	// TODO Auto-generated method stub
	//plugins.keyListener.addKeyListener(callbackKey,callback)

}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3D82C3B0-3C59-4BF4-9F8E-148CAF2922C7"}
 */
function onActionAdvanced(event) {
	forms.query.controller.show();

}


//action to show the filter picker; trigger it from any UI element of your choice (.e.g filter icon)
/**
 * @param event
 *
 * @properties={typeid:24,uuid:"D84026E2-0742-4A26-81C5-E254D0DA95B4"}
 */
function onActionPickFilter(event) {
	// make sure the element's name property is set; unnamed elements cannot be target
	toolbarFilter.showPopupFilterPicker(elements[event.getElementName()])
	toolbarFilter.setOnFilterApplyQueryCondition(callback)
}

