/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F9E95D0F-07EE-4D06-8FC1-B421E47740F5",variableType:4}
 */
var onlyNew = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E3954C09-5B57-4797-8D0E-BEE256A0DBCC"}
 */
var subPath = "";

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"1B3A47F6-151A-4DE2-A2D7-9930547F2467"}
 * @AllowToRunInFind
 */
function onAction(event) {
	
	application.output("SmartDoc plugin v"+plugins.SmartDoc.getVersion());
	
	// reset feedback window previous results:
	forms.results.feedback = '';
	
	// construct our parameter object:
	var params = {
	    defaultLogin: 'myLogin',
	    defaultPassword: 'myPassword',
	    // the callback method that will save the results in the database
	    callback: forms.results.processCallback,
	    // the accepted extensions (if not provided, everything goes!)
	    // accepted: ["html", "txt", "pdf"],
	    // if true, will trim all double spacing/CR/LF/Tabs (can be overriden at the document level):
	    trimUnwantedSpaces: true,
	    // a rule or an array of rules to be used globally, 
	    // each one being an object with a Regexp pattern (java style) 
	    // and a replacement string 
	    // applied in sequence in the order provided
	    // (rules can also be added at the document level):
	    replaceRules: {pattern: "^\\d+ *|\\n\\d+ *", replacement: ""},
	    // set the newPath to be used (can be overriden per document):
	    newPath: getSubPath(),
	    // creates a blank array (to be filled by later loops:
	    documents: []
	}
	
	
	var count;
	// get a foundset from the 'urls' table:
	var db = databaseManager.getDataSourceServerName(controller.getDataSource());
	var fs = databaseManager.getFoundSet(db,'urls');
	fs.loadAllRecords();
	
	// iterate on the urls to add to the params object
	for (var index = 1; index <= databaseManager.getFoundSetCount(fs); index++) {
		fs.setSelectedIndex(index);
		var isNew = true;
		// we use a find to determine if we need to insert or update in the database:
		if (foundset.find()) {
			foundset.id = fs.id;
			count = foundset.search();
			if (count == 0) {
				// there's no record with that id, so we create one
				foundset.newRecord(1,true);
				// and save it to get its id:
				databaseManager.saveData(foundset.getSelectedRecord());
			} else {
				isNew = false;
				foundset.setSelectedIndex(1);
			}
		}
		if (onlyNew == 0 || isNew) {
			// we feed the documents array with a new object to be processed:
			var obj = {id: foundset.id, url: fs.url};
			// if a new path is set at the document level pass it into the object:
			if (fs.new_path) {
				obj.newPath = fs.new_path;
			}
			// if a new name is set at the document level it will override the renaming scheme:
			if (fs.new_name) {
				obj.newName = fs.new_name;
			}
			// if a login/password is provided for that url, add it to the document object:
			if (fs.url_login && fs.url_pass) {
				obj.login = fs.url_login;
				obj.password = fs.url_pass;
			}
			// the 'extras' object can hold any property/value pair.
			// useful to add some custom values to the Solr index along with the document
			obj.extras = {};
			// push extras parameters if needed
			if (fs.extra_i) {
				obj.extras.extra_i = fs.extra_i;
			}
			if (fs.extra_t) {
				obj.extras.extra_t = fs.extra_t;
			}
			params.documents.push(obj);
		}
	}
	
		// the DnDFile bean is not web compatible, so we do the following only if we are not in the web client:
		if (application.getApplicationType() != APPLICATION_TYPES.WEB_CLIENT) {
			// now let's see if we have some files that were dropped:
			var files = elements.bean_dnd.getFiles();
			if (files.length > 0) {
				// we iterate on all the files:
				for (var i = 0; i < files.length; i++) {
					var file = files[i];
					// escape '\' chars on windows paths:
				
					var fileName = utils.stringReplace(file.getAbsolutePath(),'\\', '\\\\');
					// search if this file was not already processed:
					if (foundset.find()) {
						foundset.path = fileName;
						count = foundset.search();
						if (count == 0) {
							// that's a new one, let's create a record to hold the result:
							foundset.newRecord(1,true);
							databaseManager.saveData(foundset.getSelectedRecord());
						} else {
							// there was one already
							foundset.setSelectedIndex(1);
						}
					}
					// split the fileName to get the extension:
					var nameAndExtension = file.getName().split("\.");
					// compute a new name:
					var setName = "uploadedFile_" + (i+1) + "."+ nameAndExtension[1];
					// feed the documents array with a new object to be processed:
					params.documents.push({id: foundset.id, file: file, newName: setName});
				}
			}
		
		// also treat URLs that might have been dropped:
		var urls = elements.bean_dnd.getURLs();
		if (urls.length > 0) {
			// we iterate on all the urls:
			for (var i = 0; i < urls.length; i++) {
				var url = urls[i].toString();
				// search if this file was not already processed:
				if (foundset.find()) {
					foundset.url = url;
					count = foundset.search();
					if (count == 0) {
						// that's a new one, let's create a record to hold the result:
						foundset.newRecord(1,true);
						databaseManager.saveData(foundset.getSelectedRecord());
					} else {
						// there was one already
						foundset.setSelectedIndex(1);
					}
				}
				// we cannot simply determine the real type extension of the content of the URL
				// (a url ending with html can point to a pdf file for example, and URL frequently have parameters)
				
				// anyway, we feed the documents array with a new object to be processed:
				params.documents.push({id: foundset.id, url: url});
			}
		}
	}
	
	// show our feedback window:
	application.showFormInDialog(forms.results,10,10,-1,-1,"Results",true,false,"resultWindow",false);
	
	// Submit document(s) to the indexing process, contained in JS Object with the parameters:
	plugins.SmartDoc.submit(params);
}

/**
 * @properties={typeid:24,uuid:"8F756A2D-DACE-47B2-8260-254080B3F3FE"}
 */
function getSubPath() {
	if (subPath) {
		// check that subPath starts with '/' (relative to smartDocPlugin.saveToFolder property)
		if (subPath.substr(0,1) == '/') {
			return subPath;
		} else {
			return '/' + subPath;
		}
	}
	return '/';
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"BFC6DC20-595A-49C9-8150-04D38B48CD35"}
 */
function onActionClear(event) {
	// dnd bean is not web compatible, so
	if (application.getApplicationType() != APPLICATION_TYPES.WEB_CLIENT) {
		// reset the list of files:
		elements.bean_dnd.reset();
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"3AA4CE5E-4B9B-445C-827D-8EB36B991C6B"}
 */
function onActionAddUrl(event) {
	forms.urls.controller.newRecord();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"4FA2DB12-2AA3-40A8-830F-FE7D2F638E9C"}
 * @AllowToRunInFind
 */
function onActionShowSavedFile(event) {
	// get the id of the url selected in the tabPanel:
	var id = forms.urls.id;
	// retrieve a foundset of results:
	var fs = forms.results.foundset;
	if (fs.find()) {
		// search for the related id:
		fs.id = id;
		var count = fs.search();
		// if we've found one match:
		if (count > 0) {
			// and the file was saved on the server side:
			if (fs.newname) {
				// show it in the user's default browser:
				application.showURL(plugins.SmartDoc.getFileURL(fs.newpath, fs.newname), '_blank');
			}
		}
	}
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"B72176A1-659E-4ECE-A274-7E89111C4F09"}
 */
function onActionGoSearch(event) {
	forms.query.controller.show();
}
