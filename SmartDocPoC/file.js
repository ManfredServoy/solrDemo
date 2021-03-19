/**
 * @properties={typeid:35,uuid:"28246891-9F5C-46B0-9755-AC2A5D469789",variableType:-4}
 */
var _oKnownFiles = {
	WORD: ['doc', 'docx', 'docm', 'dotm', 'rtf'],
	EXCEL: ['xls', 'xlsx', 'xlsm'],
	MAIL: ['eml', 'msg'],
	PDF: ['pdf'],
	WEB: ['html', 'htm'],
	TEXT: ['txt']
};


/**
 * @properties={typeid:35,uuid:"4CA2DB6F-E218-4323-B156-B59C0F259424",variableType:-4}
 */
var fs = datasources.db.smart_doc.results.getFoundSet()


/**
 * @param {String} fromPath
 * @param {Boolean} [allNew]
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"B0CEAE62-519D-403E-A1A3-5F79D4D85AC3"}
 */
function addFiles(fromPath, allNew) {
	var file = plugins.file.convertToJSFile(fromPath)
	if (file.isDirectory()) {
		var files = scopes.file.getContent(fromPath)
	} else {
		files = [file]
	}

	for (var f = 0; f < files.length; f++) {
		
		
		file = files[f]
		
		if (allNew){ //initial index
			scopes.file.newFile(file)
			continue
		}
		
		//FileWatcher;
		
		var knownPath = pathExists(file)
		var duplicateFiles = getMatchingHashes(file)
		var hasDuplicates = !!duplicateFiles.getMaxRowIndex()

		if (!knownPath && !hasDuplicates) {
			//this must be a new file
			scopes.file.newFile(file)
		}

		if (knownPath && !hasDuplicates) {
			// files content was updated => update record with path & reindex
			scopes.file.updateFile(file)

		}

		if (!knownPath && hasDuplicates) {
			whatHappened(file, duplicateFiles)
		}

		if (knownPath && hasDuplicates) {
			//ignore: nothing changed

		}
		
	}
	databaseManager.saveData(fs)
	sendToSolr()
}


/**
 * @properties={typeid:24,uuid:"83BFAF4A-E4BF-4093-B315-58B8CA1ED47E"}
 */
function sendToSolr(){
	fs.loadAllRecords()
	for (var i = 1; i <= fs.getSize(); i++) {
		var record = fs.getRecord(i);
		var file = plugins.file.convertToJSFile(record.path)
		params.documents.push({ id: record.real_id, file: file, newName: file.getName() });
	}
	params.documents = params.documents.filter(onlyUnique);
	plugins.SmartDoc.submit(params)
}




/**
 * @param {plugins.file.JSFile} file
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"74AB518C-EEEF-4AD9-8B40-D650F5282DDB"}
 */
function pathExists(file){
	var q = fs.getQuery()
	q.where.add(q.columns.path.eq(file.getAbsolutePath()))
	var maxReturnedRows = 1;
	var ds = databaseManager.getDataSetByQuery(q, true, maxReturnedRows);
	return !!ds.getMaxRowIndex()
}


/**
 * @properties={typeid:24,uuid:"1352FBB5-790C-4949-84D5-C4C36BDF94D6"}
 * @param {plugins.file.JSFile} file
 * @return {JSDataSet}
 */
function getMatchingHashes(file){
	var fileHash = plugins.FileWatcher.getMD5Checksum(file)
	var q = fs.getQuery()
	q.where.add(q.columns.hash.eq(fileHash))
	q.result.add(q.columns.path)
	q.result.add(q.columns.hash)
	q.result.add(q.columns.parentfolder)
	q.result.add(q.columns.filename)
	q.result.add(q.columns.real_id)

	return databaseManager.getDataSetByQuery(q, true, 1000);
}

/**
 * @param {plugins.file.JSFile}  file
 * @param {JSDataSet}  hashes
 * @properties={typeid:24,uuid:"0A06B344-33CA-430A-93FC-0773CB0F327E"}
 */
function whatHappened(file, hashes) {
	//hashes == all records with the same hash as this file

	for (var index = 1; index <= hashes.getMaxRowIndex(); index++) {
		var row = hashes.getRowAsArray(index);

		//////**********CONDITIONS**********////
		//var hasSamePath = row[1] == file.getPath() //there is already a record with that path
		//var isStillThere = file.exists() //there is an actual file on that path
		var hasSameParent = row[3] == file.getParent()
		var hasSameName = row[4] == file.getName()
		//\\\\**********CONDITIONS**********\\\\\\

		if (hasSameName && !hasSameParent) {
			application.output("Likely moved")
			scopes.file.updateFileById(row[5], file)
			return
		}

		if (!hasSameName && hasSameParent) {
			application.output("Likely renamed")
			scopes.file.updateFileById(row[5], file)
			return
		}
	}
	//fallback
	application.output("Likely new")
	scopes.file.newFile(file)
	return 
}

// Return known file extensions
/**
 * @properties={typeid:35,uuid:"087434CB-69D5-445B-8621-0357A5659B79",variableType:-4}
 */
var accepted = returnAcceptedFiles();

/**
 * @properties={typeid:35,uuid:"4870CE2E-40A4-4509-9B49-7334BAF52C12",variableType:-4}
 */
var params = {
	defaultLogin: 'myLogin',
	defaultPassword: 'myPassword',
	// the callback method that will save the results in the database
	callback: scopes.solrHandler.processCallback,
	// the accepted extensions (if not provided, everything goes!)
	accepted: accepted,
	// if true, will trim all double spacing/CR/LF/Tabs (can be overridden at the document level):
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

/**
 * @properties={typeid:24,uuid:"F8AAC66B-742C-4535-8D44-3D10A39DF211"}
 * @return {String}
 */
function getSubPath() {
	return '/';
}

/**
 * @properties={typeid:24,uuid:"A5DC5444-ED91-4A59-963E-614F20CB117C"}
 * @return {Array<String>}
 */
function returnAcceptedFiles() {
	var _aAccepted = _oKnownFiles.WORD;
	_aAccepted = _aAccepted.concat(_oKnownFiles.EXCEL);
	_aAccepted = _aAccepted.concat(_oKnownFiles.MAIL);
	_aAccepted = _aAccepted.concat(_oKnownFiles.PDF);
	_aAccepted = _aAccepted.concat(_oKnownFiles.WEB);
	_aAccepted = _aAccepted.concat(_oKnownFiles.TEXT);
	return _aAccepted;
}

/**
 * @return {Array<plugins.file.JSFile>}
 * @param {String} _sIndexPath
 * @properties={typeid:24,uuid:"7C67FC03-061A-49FA-AE43-98524A2BE928"}
 */

function getContent(_sIndexPath) {
	var _aDocs = [];
	var _jsMain = plugins.file.convertToJSFile(_sIndexPath);
	if (!_jsMain.exists()) {
		return _aDocs;
	}
	loopContents(_jsMain);
	return _aDocs;

	/**@param {plugins.file.JSFile} _jsFolder*/
	function loopContents(_jsFolder) {
		// Get all visible objects
		var _aContents = plugins.file.getFolderContents(_jsFolder, null, null, 1)
		_aContents.forEach(function(_jsSubFile) {
			if (_jsSubFile.isDirectory()) {
				loopContents(_jsSubFile);
			} else {
				_aDocs.push(_jsSubFile)
			}
		})
	}
}

/**
 * @properties={typeid:24,uuid:"1B1136BB-A953-4DAA-876A-2E769D84B0F0"}
 * @return {String}
 */
function getFileIcon(_sExtension) {

	if (!_sExtension) {
		return 'DEFAULT'
	}

	if (_oKnownFiles.WORD.indexOf(_sExtension)) {
		return 'WORD';
	}
	if (_oKnownFiles.EXCEL.indexOf(_sExtension)) {
		return 'EXCEL';
	}
	if (_oKnownFiles.MAIL.indexOf(_sExtension)) {
		return 'MAIL';
	}
	if (_oKnownFiles.PDF.indexOf(_sExtension)) {
		return 'PDF';
	}

	return 'DEFAULT';

}



/**
 * @param {plugins.file.JSFile} file
 *
 * @properties={typeid:24,uuid:"6C56C349-E4A6-4BA8-8AF2-FC8923B45E9D"}
 */
function newFile(file) {
	var record = fs.getRecord(fs.newRecord())
	record.path = file.getAbsolutePath()
	record.hash = plugins.FileWatcher.getMD5Checksum(file)
	record.parentfolder = parent(file.getAbsolutePath())
	record.filename = file.getName()
	record.extension = file.getName().split('.').pop()
	//delete index
	plugins.SmartDoc.remove(record.real_id)
}

/**
 * @param fileid
 * @param {plugins.file.JSFile} file
 *
 * @properties={typeid:24,uuid:"1700A4C9-49F2-43C9-8968-AEB5CDADCE50"}
 */
function updateFileById(fileid, file) {
	//update file path in existing record;
	var q = fs.getQuery()
	q.where.add(q.columns.real_id.eq(fileid))
	fs.loadRecords(q)
	var record = fs.getRecord(1)
	record.path = file.getAbsolutePath()
	record.parentfolder = parent(file.getAbsolutePath())
	record.filename = file.getName()

	//delete index
	plugins.SmartDoc.remove(record.real_id)
}

/**
 * @param {plugins.file.JSFile} file
 *
 * @properties={typeid:24,uuid:"BD59E0BB-C639-4EA5-9BCC-EE6A94C342BB"}
 */
function updateFile(file) {
	var q = fs.getQuery()
	q.where.add(q.columns.path.eq(file.getAbsolutePath()))
	fs.loadRecords(q)
	var record = fs.getRecord(1)
	record.path = file.getAbsolutePath()
	record.parentfolder = parent(file.getAbsolutePath())
	record.filename = file.getName()

	//delete index
	plugins.SmartDoc.remove(record.real_id)
}





/**
 * @param {String} filePath
 * @return {String}
 * @properties={typeid:24,uuid:"26839C6E-159A-4851-9798-E7EC2F721B60"}
 */
function parent(filePath) {
	var comps = filePath.split('/')
	comps.pop()
	return comps.join('/')

}



/**
 * @param value
 * @param index
 * @param self
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"35C0CC2A-EE50-4852-98EB-2EAEE7ABD441"}
 */
function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

