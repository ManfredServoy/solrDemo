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
var hiliteFields = "summary";

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
	search()

}

/**
 * @properties={typeid:24,uuid:"0F503E84-6BAD-43F3-81AE-38C7A60F190B"}
 * @return {Array<String>}
 */
function search() {

	var docIDs = []
	// reset search result variables:
	found = 0;
	returned = 0;
	result = "";
	hiliteResult = "";

	// setup the parameters object
	var params = {
		query: query,
		filters: filters,
		start: start,
		rows: rows,
		fields: fields,
		debug: (debug == 1),
		hiliting: (hilite == 1),
		includeScore: (includeScore == 1),
		hiliteFields: hiliteFields,
		hiliteFragSize: hiliteFragSize,
		hiliteSimplePre: '<h7 class="highlight">',
		hiliteSimplePost: '</h7>',
		sortBy: sortBy
	};

	//application.output(params)
	// launch
	
	var res = plugins.SmartDoc.query(params);
	if (res == null) {
		// maybe the Solr server is unreachable?
		plugins.dialogs.showErrorDialog("Error", "Your query returned a null result, check servoy_log.txt for errors", "OK");
		return null;
	}

	// res is a JavaScript Object with a few properties, the main one being 'response', which is itself an Object:
	found = res.response.numFound;
	result += '<html><head></head><body>';
	// inside the response property Object, we have some property, the main one being 'docs' which is an Array of result Objects
	returned = res.response.docs.length;
	// we iterate on the docs Array:
	for (var i in res.response.docs) {
//		result += '<table>';
		var doc = res.response.docs[i];
		docIDs.push(doc.id)

//		// this little trick is to make sure the id is the first one to appear
//		// (the properties are not guaranteed to be in a consistent order):
		result += '<tr><td>id</td><td>' + doc.id + '</td></tr>';

		// we iterate on the properties of the document result:
		for (var d in doc) {
			if (d != "id") {
				result += '<tr><td>' + d + '</td><td>' + doc[d] + '</td></tr>';
			}
		}
		result += '</table><hr>';
	}
	if (hilite == 1) {
		setSnippets(res.highlighting)
		hiliteResult = '<html><head><style type="text/css">em { font-weight: bold; font-style: plain; color: #FF3333; }</style></head><body>';

		// we iterate on that highlighting property which contains one property key (the id) for each document
		// the value of that property will be an object with one property for each of the hiliteFields properties
		
		var higlighting = JSON.parse(JSON.stringify(res.highlighting)) 
		
		for (var id in higlighting) {
			hiliteResult += '<table><tr><td colspan="2">' + id + '</td></tr>';
			var obj = higlighting[id];
			if (obj) {
				for (var field in obj) {
					hiliteResult += '<tr><td>' + field + '</td><td>' + obj[field][0] + '</td></tr>';
				}
			}
			hiliteResult += '</table><hr>';
		}
		hiliteResult += "</body></html>";
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
	for (var key in snippets) {
		if (!snippets.hasOwnProperty(key)) continue;
		var summaryObj = snippets[key]['summary']
		if (summaryObj) {
			var snippet = hfs.getRecord(hfs.newRecord())
			snippet.real_id = key
			snippet.snippet =  summaryObj[0]
		}
	}
	databaseManager.saveData(hfs)
}
