/**
 * @properties={type:12,typeid:36,uuid:"F03A7F0D-09D9-41A8-8554-FF40CA365BEB"}
 */
function real_id()
{
	return 'id_' + id;
}

/**
 * @properties={type:12,typeid:36,uuid:"11356FC7-61D1-484A-8738-EA2B93006657"}
 */
function fileIcon()
{
	var _sExt = extension||'';
	switch (_sExt.toUpperCase()) {
	case "PDF":
		return "fa fa-file-pdf-o icon"
		break;
	case "DOCX":
		return "fa fa-file-word-o icon"
		break;
	
	default:
		return "fa fa-file-o icon"
		break;
	}
}
