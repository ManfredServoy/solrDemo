/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"003C0D01-A944-4D3C-A7FC-CAE4A583E501"}
 */
var feedback = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"7A4CEB9E-866A-451C-B32A-4DC97AFFA052",variableType:4}
 */
var total = 0;

/**
 * @params {SubmitResult} result
 * 
 * @properties={typeid:24,uuid:"8BAD11A4-664B-419E-9810-FC5F064CB2CC"}
 * @AllowToRunInFind
 */
function processCallback(result) {
	var resultID = result.getValue("id");
	// show which one is in process:
	application.output(resultID  + "callback");
		
	// is it a new record or an existing record?
	var count = 0;
	if (foundset.find()) {
		id = resultID;
		count = foundset.search();
	}
	if (count == 0) {
		// not found, we create it:
		foundset.newRecord(1,true);
	} else {
		// found, we select it:
		foundset.setSelectedIndex(1);
	}
	
	// get all the values returned:
	var keys = result.getKeys();
	for (var i = 0; i < keys.length; i++) {
		if (keys[i] != "summary" && keys[i] != "content") {
			application.output(keys[i] + ": "+result.getValue(keys[i]));
		}
		// iterate to feed the record (all keys have one corresponding field in the database):
		foundset.setDataProviderValue(keys[i],result.getValue(keys[i]));
	}
	
	// we also add the error code and message into the database to keep track of errors (if any):
	foundset.errorcode = result.getErrorCode();
	foundset.errormessage = result.getErrorMessage();
	keys.sort();
	foundset.fields = keys.join('\n');
	databaseManager.saveData(foundset.getSelectedRecord());
	
	// the totalprocesstime property simply measures the time it took for the whole process (it is never null):
	var time = result.getValue("totalprocesstime");
	total += time;
	// update the feedback field:
	if (result.getErrorCode() != SubmitResult.ERROR_NONE) {
		feedback += resultID + ": Exception: " + result.getErrorMessage() + "\n";
	} else {
		feedback += resultID + ": Done in "+time+"ms!\n";
	}
	if (result.isLastDocument()) {
		var finished = "Finished!\nTotal process time: "+total+"ms\n";
		feedback += finished;
		application.output(finished);
		//application.closeForm();
		//forms.query.controller.show();
		foundset.loadAllRecords()
		forms.maing.resetUploader()
	}
	
	var solrfolder = plugins.SmartDoc.serverFolder
	var filepath = foundset.getSelectedRecord().newname
	plugins.file.deleteFile(solrfolder + "/" + filepath)
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"DCF66AF2-45CE-417B-8CAF-F0D835255E86"}
 */
function onActionStopProcess(event) {
	plugins.SmartDoc.stopProcess();
	application.closeForm();
}
