/**
 * @private
 * @typedef {{errormessage: String, summary: String, extension: String, creator: String, originalname: String, totalprocesstime: String, filesize: String, newname: String, title: String, newpath: String, url: String, content: String, contenttype: String, path: String, lastmodified: String, producer: String, id: String, errorcode: String}}
 * @SuppressWarnings(unused)
 * @properties={typeid:35,uuid:"008D6BB6-5013-4C34-ADAA-3C62A6A9A57E",variableType:-4}
 */
var submitResult;


/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"E6666E84-2051-4E08-A9E0-5F2EAFB5DEFF",variableType:4}
 */
var left = 0



/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"35E6DD2F-6D7B-427E-84F2-BEF9EF34EE87"}
 */
var feedback = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"807513FE-4C7F-4C38-BB80-D44EBC3691AF",variableType:4}
 */
var total = 0;

/**
 * ////Solr callback
 * @param {plugins.SmartDoc.SubmitResult} result
 * 
 * @properties={typeid:24,uuid:"94BC7888-0E76-4D77-B131-0D71219162AB"}
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
	}
	
	var solrfolder = plugins.SmartDoc.serverFolder
	var filepath = result.getValue("newname")
	plugins.file.deleteFile(solrfolder + "/" + filepath)
}


/**
 
 * @param {plugins.SmartDoc.SubmitResult} solrResult
 * @return {JSRecord}
 * @properties={typeid:24,uuid:"4C3D0F19-D04C-4412-BD02-E2ED25BEEA9D"}
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


