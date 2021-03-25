/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"8C336C69-F32A-462A-8C1D-262A3C43B9AD",variableType:4}
 */
var debug = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"791C91BE-2DA6-4293-8A77-5B3422DDB54D"}
 */
var queryString = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6D9FE1DF-9083-42AC-8863-3CC508C5C499"}
 */
var fields = "id,title,contenttype,extension,author,originalname";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"7F03962C-A367-4E9B-BB26-CC03A8926949"}
 */
var filters = "extension:*";

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"EFBBA9FD-DECE-4C43-BCD3-33AE2D623034",variableType:4}
 */
var found = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"E9037D79-CACE-473A-A394-3A17A90DA46E",variableType:4}
 */
var hilite = 1;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"00F17458-BFA1-442E-9B6D-316D9D340511"}
 */
var hiliteFields = "*";

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"83C9C546-AFC4-4F0F-9EDB-97DDD5C970E2",variableType:4}
 */
var hiliteFragSize = 250;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"058626FD-5C2C-4BC5-B28A-677C5B65A9F2"}
 */
var hiliteResult = "";

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"58BA8399-CA16-442D-867D-DA874E3B1C40",variableType:4}
 */
var includeScore = 1;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"CF84EA69-FDCB-4329-BF0D-FCB058B49A7D"}
 */
var query = "summary:java\ncontent:serv*";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D351154B-CAAE-4668-B026-7F1EEC2421FE"}
 */
var result = "";

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"91A78A18-AA8E-4583-834B-4C6A5B0ED96D",variableType:4}
 */
var returned = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2DE4F653-58E2-4BA8-BFFB-FAB2427EBB7C",variableType:4}
 */
var rows = 10;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"360D2669-A20C-4B09-AFBF-38739331FCA8"}
 */
var sortBy = "score, id desc";

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"AA60DB77-52EE-4E2E-9C25-3AC61A1E496B",variableType:4}
 */
var start = 0;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"32367673-B17A-470C-A060-B6E746B24DBC"}
 */
function onActionSearch(event) {
	var qObject = scopes.solr.query(query)
	qObject.query = query
	qObject.filters = filters
	qObject.start = start
	qObject.rows = rows
	qObject.fields = fields 
	qObject.debug = debug
	qObject.hiliting = hilite 
	qObject.includeScore = includeScore
	qObject.hiliteFields = hiliteFields
	qObject.hiliteFragSize = hiliteFragSize
	qObject.sortBy = sortBy
	search(qObject)

}

/**
 * @properties={typeid:24,uuid:"0F503E84-6BAD-43F3-81AE-38C7A60F190B"}
 * @return {Array<String>}
 */
function search(q) {
	var docIDs = []
	// setup the parameters object
	

	var res = plugins.SmartDoc.query(q);
	if (res == null) {
		// maybe the Solr server is unreachable?
		plugins.webnotificationsToastr.error("Your query returned a null result, check servoy_log.txt for errors", "Search Error");
		return null;
	}
	for (var i in res.response.docs) {
		var doc = res.response.docs[i];
		docIDs.push(doc.id)
	}
	if (hilite == 1) {
		setSnippets(res.highlighting)
	}

	return docIDs
}

/**
 * @param snippets
 *
 * @properties={typeid:24,uuid:"67F0EBF6-0E60-4E9F-8E30-EAC4F98AEB75"}
 */
function setSnippets(snippets) {
	var hfs = datasources.mem.highlights.getFoundSet()
	hfs.loadAllRecords()
	hfs.deleteAllRecords()
	for (var id in snippets) {
		var match = snippets[id];
		if (match) {
			for (var field in match) {
				var snippet = hfs.getRecord(hfs.newRecord())
				snippet.real_id = id
				snippet.snippet = match[field][0]
			}
		}
	}
	databaseManager.saveData(hfs)
}
