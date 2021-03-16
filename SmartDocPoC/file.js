/**
 * @properties={typeid:35,uuid:"28246891-9F5C-46B0-9755-AC2A5D469789",variableType:-4}
 */
var _oKnownFiles = {
	WORD: 	['doc', 'docx', 'docm', 'dotm', 'rtf'],
	EXCEL: 	['xls', 'xlsx', 'xlsm'],
	MAIL: 	['eml', 'msg'],
	PDF: 	['pdf'],
	WEB:	['html', 'htm'],
	TEXT:	['txt']
};

/**
 * @properties={typeid:24,uuid:"A5DC5444-ED91-4A59-963E-614F20CB117C"}
 * @return {Array<String>}
 */
function returnAcceptedFiles(){
	var _aAccepted = _oKnownFiles.WORD;
	_aAccepted = _aAccepted.concat(_oKnownFiles.EXCEL);
	_aAccepted = _aAccepted.concat(_oKnownFiles.MAIL);
	_aAccepted = _aAccepted.concat(_oKnownFiles.PDF);
	_aAccepted = _aAccepted.concat(_oKnownFiles.WEB);
	_aAccepted = _aAccepted.concat(_oKnownFiles.TEXT);
	return _aAccepted;
}

/**
 * TODO generated, please specify type and doc for the params
 * @return {Array<plugins.file.JSFile>}
 * @param {String} _sIndexPath
 * @properties={typeid:24,uuid:"7C67FC03-061A-49FA-AE43-98524A2BE928"}
 */

function getContent(_sIndexPath){
    var _aDocs = [];
    var _jsMain = plugins.file.convertToJSFile(_sIndexPath);
    if(!_jsMain.exists()){
          return _aDocs;
    }
    loopContents(_jsMain);
    return _aDocs;
    
    /**@param {plugins.file.JSFile} _jsFolder*/
    function loopContents(_jsFolder){
    	// Get all visible objects
          var _aContents = plugins.file.getFolderContents(_jsFolder, null, null, 1)
          _aContents.forEach(function(_jsSubFile){
                if(_jsSubFile.isDirectory()){
                      loopContents(_jsSubFile);
                }else{
                      _aDocs.push(_jsSubFile)
                }
          })
    }     
}

/**
 * @properties={typeid:24,uuid:"1B1136BB-A953-4DAA-876A-2E769D84B0F0"}
 * @return {String}
 */
function getFileIcon (_sExtension){
	
	if(!_sExtension){ 
		return 'DEFAULT'
	}
	
	if(_oKnownFiles.WORD.indexOf(_sExtension))	{ return 'WORD'; }
	if(_oKnownFiles.EXCEL.indexOf(_sExtension))	{ return 'EXCEL'; }
	if(_oKnownFiles.MAIL.indexOf(_sExtension))	{ return 'MAIL'; }
	if(_oKnownFiles.PDF.indexOf(_sExtension))	{ return 'PDF'; }
	
	return 'DEFAULT';
	
}
