/**
 * @typedef {{
 * debug: Boolean,
 * extras: Object,
 * fields: String,
 * filters: String,
 * hiliteFields: String,
 * hiliteFragSize: Number,
 * hiliteMaxAnalyzedChars: Number,
 * hiliteSimplePost: String,
 * hiliteSimplePre: String,
 * hiliting: Boolean,
 * includeScore: Boolean,
 * rows: Number,
 * sortBy: String,
 * start: Number,
* query:String
 * }}
 * 
 * @private 
 * @SuppressWarnings(unused)
 *
 * @properties={typeid:35,uuid:"3DCD335E-CFCC-403E-9949-36CFD4E85035",variableType:-4}
 */
var queryObject;


/**
 * @properties={typeid:35,uuid:"47E438BA-F9C1-4FA0-9D58-B69ED514A2E7",variableType:-4}
 * @type {plugins.SmartDoc.SubmitResult}
 */
var previous = null

/**
 * @properties={typeid:35,uuid:"86100DC6-20D0-418D-B353-0E16D7185EB7",variableType:-4}
 */
var isStopped = false

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
 * @param {plugins.SmartDoc.SubmitResult} solrResult
 *
 * @properties={typeid:24,uuid:"94BC7888-0E76-4D77-B131-0D71219162AB"}
 * @AllowToRunInFind
 */
function processCallback(solrResult) {
	updateRecord(solrResult)
}

/**

 * @param {plugins.SmartDoc.SubmitResult} solrResult
 * @return {JSRecord}
 * @properties={typeid:24,uuid:"4C3D0F19-D04C-4412-BD02-E2ED25BEEA9D"}
 */
function updateRecord(solrResult) {

	if (solrResult === previous || isStopped) {
		return null
	}

	previous = solrResult

	var resultID = solrResult.getValue("id")
	// show which one is in process:
	// is it a new record or an existing record?
	var fs = datasources.db.smart_doc.results.getFoundSet()
	fs.loadAllRecords()
	var qry = fs.getQuery()
	qry.where.add(qry.columns.real_id.eq(resultID))
	fs.loadRecords(qry)

	if (fs.getSize() == 0) {
		// not found, we create it:
		fs.newRecord(1, true);
		var record = fs.getRecord(fs.newRecord())

	} else {
		// found, we select it:
		record = fs.getRecord(1)
	}

	application.output('Updating ' + solrResult.getValue("originalname"))

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

	//cleaning up
	plugins.file.deleteFile(plugins.SmartDoc.serverFolder + "/" + record.filename)
	

	var time = solrResult.getValue("totalprocesstime");
	total += time;

	if (solrResult.isLastDocument()) {
		fs.loadAllRecords()
		application.output("Finished!\nTotal process time: " + total + "ms for " + fs.getSize() + " documents")
		//somehow, not all documents are removed from the Solr index folder.
		//Cleaning up here
		var files = plugins.file.getFolderContents(plugins.SmartDoc.serverFolder)
		for (var f = 0; f < files.length; f++) {
			var file = files[f]
			plugins.file.deleteFile(file)
		}
	}

	//application.output("Processed " + record.filename);
	databaseManager.saveData(record);
	return record
}



/**
 * @param {String} searchString
 * @return {queryObject}
 *
 * @properties={typeid:24,uuid:"3B2727A9-F4E1-44B1-8A7C-56E5E29916D6"}
 */
function query(searchString){
	//init with convenient defaults
	/**@type {queryObject}*/
	var qObject = {}
	qObject.query = "content:*" + searchString + "*"
	qObject.filters = "extension:*"
	qObject.start = 0, 
	qObject.rows = 10
	qObject.fields = "id,title,contenttype,extension,author,originalname"
	qObject.debug = false
	qObject.hiliting = true
	qObject.includeScore = true
	qObject.hiliteFields = '*'
	qObject.hiliteFragSize = 250
	qObject.hiliteMaxAnalyzedChars = 500000 //default value  = 51200. Higher values might impact performance
	qObject.hiliteSimplePre = '<h7 class="highlight">'
	qObject.hiliteSimplePost =  '</h7>'
	qObject.sortBy = "score, id desc",
	qObject.extras = {}
	return qObject
}
