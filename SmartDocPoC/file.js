
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
