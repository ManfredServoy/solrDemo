/**
 * @private
 * @typedef {{errormessage: String, summary: String, extension: String, creator: String, originalname: String, totalprocesstime: String, filesize: String, newname: String, title: String, newpath: String, url: String, content: String, contenttype: String, path: String, lastmodified: String, producer: String, id: String, errorcode: String}}
 * @SuppressWarnings(unused)
 * @properties={typeid:35,uuid:"52BA7887-E33C-4CD3-B9AE-EEE7659CD192",variableType:-4}
 */
var submitResult;





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
 * @params {plugins.SmartDoc.SubmitResult}
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
		real_id = resultID;
		count = foundset.search();
	}
	if (count == 0) {
		// not found, we create it:
		foundset.newRecord(1,true);
		var record = foundset.getRecord(foundset.newRecord())
		
	} else {
		// found, we select it:
		record = foundset.getRecord(1)
	}
	
	record.author = result.getValue("author")
	record.charset = result.getValue("charset")
	record.contenttype = result.getValue("contenttype")
	record.creator = result.getValue("creator")
	record.errorcode = result.getValue("errorcode")
	record.errormessage = result.getValue("errormessage")
	record.extension = result.getValue("extension")
	record.filesize = result.getValue("filesize")
	record.keywords = result.getValue("keywords")
	record.lastmodified = result.getValue("lastmodified")
	record.newname = result.getValue("newname")
	record.newpath = result.getValue("newpath")
	record.originalname = result.getValue("originalname")
	record.path = result.getValue("path")
	record.producer = result.getValue("producer")
	record.subject = result.getValue("subject")
	record.title = result.getValue("title")
	record.url = result.getValue("url")
	record.real_id = result.getValue("id")
	
	// we also add the error code and message into the database to keep track of errors (if any):
	foundset.errorcode = result.getErrorCode();
	foundset.errormessage = result.getErrorMessage();
	databaseManager.saveData(record);
	
	// the totalprocesstime property simply measures the time it took for the whole process (it is never null):
	var time = result.getValue("totalprocesstime");
	total += time;
	// update the feedback field:
	if (result.getErrorCode() != result.ERROR_NONE) {
		feedback += resultID + ": Exception: " + result.getErrorMessage() + "\n";
	} else {
		feedback += resultID + ": Done in "+time+"ms!\n";
	}
	if (result.isLastDocument()) {
		var finished = "Finished!\nTotal process time: "+total+"ms\n";
		feedback += finished;
		foundset.loadAllRecords()
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
