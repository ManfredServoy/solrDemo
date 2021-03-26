/**
 * Record pre-insert trigger.
 * Validate the record to be inserted.
 * When false is returned or a validaton error is added to the recordMarkers the record will not be inserted in the database.
 * When an exception is thrown the record will also not be inserted in the database but it will be added to databaseManager.getFailedRecords(),
 * the thrown exception can be retrieved via record.exception.getValue().
 *
 * @param {JSRecord<db:/smart_doc/results>} record record that will be inserted
 * @param {JSRecordMarkers} recordMarkers the object where all the problems can be reported against
 * @param stateObject an object that a user can give to validateRecord for extra state (optional, can be null).
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"3D98D65D-DBCE-47E6-84A9-D5C1233E2A5C"}
 */
function onRecordInsert(record, recordMarkers, stateObject) {

	//kickOffSolr()
	
	
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {JSRecord<db:/smart_doc/results>} file
 *
 * @properties={typeid:24,uuid:"58CB32C3-133F-469F-B226-5E62AEC6DD02"}
 */
function kickOffSolr(file){
	// split the fileName to get the extension:
	var nameAndExtension = file.getName().split("\.");
	// compute a new name:
	var setName = "uploadedFile_" + (i + 1) + "." + nameAndExtension[1];
	// feed the documents array with a new object to be processed:
	var extras = {}
	params.documents.push({ id: fileRecord.id, file: file, newName: file.getName() });
}
