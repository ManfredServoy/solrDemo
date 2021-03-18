/**
 * @private
 * @typedef {{errormessage: String, summary: String, extension: String, creator: String, originalname: String, totalprocesstime: String, filesize: String, newname: String, title: String, newpath: String, url: String, content: String, contenttype: String, path: String, lastmodified: String, producer: String, id: String, errorcode: String}}
 * @SuppressWarnings(unused)
 * @properties={typeid:35,uuid:"52BA7887-E33C-4CD3-B9AE-EEE7659CD192",variableType:-4}
 */
var submitResult;


/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"44D7AF0C-6C2C-4FFA-8C16-5B7406C89D93",variableType:4}
 */
var left = 0



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
 * @param {plugins.SmartDoc.SubmitResult} result
 * 
 * @properties={typeid:24,uuid:"8BAD11A4-664B-419E-9810-FC5F064CB2CC"}
 * @AllowToRunInFind
 */
function processCallback(result) {
	var resultID = result.getValue("id");
	updateRecord(result)
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
	var filepath = result.getValue("newname")
	plugins.file.deleteFile(solrfolder + "/" + filepath)
}


/**
 * @param {plugins.SmartDoc.SubmitResult} solrResult
 * @return {JSRecord}
 * @properties={typeid:24,uuid:"B7A2A072-1F7E-42B8-8BBE-E07E0E6634E6"}
 */
function updateRecord(solrResult){
	var resultID = solrResult.getValue("id");
	// show which one is in process:
	// is it a new record or an existing record?
	var fs = datasources.db.smart_doc.results.getFoundSet()
	fs.loadAllRecords()
	var qry = fs.getQuery()
	qry.where.add(qry.columns.real_id.eq(resultID))
	fs.loadRecords(qry)
	
	if (fs.getSize() == 0) {
		// not found, we create it:
		fs.newRecord(1,true);
		var record = fs.getRecord(fs.newRecord())
		
	} else {
		// found, we select it:
		record = fs.getRecord(1)
	}
	
	
	//database columns to be reviewed
	
	record.author = solrResult.getValue("author")
	record.charset = solrResult.getValue("charset")
	record.contenttype = solrResult.getValue("contenttype")
	record.creator = solrResult.getValue("creator")
	record.errorcode = solrResult.getValue("errorcode")
	record.errormessage = solrResult.getValue("errormessage")
	record.extension = solrResult.getValue("extension")
	record.filesize = solrResult.getValue("filesize")
	record.parentfolder = scopes.file.parent(path)
	
	record.keywords = solrResult.getValue("keywords")
	record.lastmodified = solrResult.getValue("lastmodified")
	record.newname = solrResult.getValue("newname")
	record.newpath = solrResult.getValue("newpath")
	record.originalname = solrResult.getValue("originalname")
	record.filename = record.originalname
	record.path = solrResult.getValue("path")
	record.producer = solrResult.getValue("producer")
	record.subject = solrResult.getValue("subject")
	record.title = solrResult.getValue("title")
	record.url = solrResult.getValue("url")
	record.real_id = solrResult.getValue("id")
	record.indexed = new Date()
	
	// we also add the error code and message into the database to keep track of errors (if any):
	record.errorcode = solrResult.getErrorCode();
	record.errormessage = solrResult.getErrorMessage();
	
	application.output("Processed " + record.filename);
	databaseManager.saveData(record);
	return record
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
