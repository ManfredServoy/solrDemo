/**
 * @properties={type:12,typeid:36,uuid:"4B4AE8FB-06AC-4891-BF3B-960E4F692354"}
 */
function filetype() {
	if (!extension) {
		return 'Other'
	}

	if (scopes.file._oKnownFiles.WORD.indexOf(extension) > -1) {
		return 'Word';
	}
	if (scopes.file._oKnownFiles.EXCEL.indexOf(extension) > -1) {
		return 'Excel';
	}
	if (scopes.file._oKnownFiles.MAIL.indexOf(extension) > -1) {
		return 'Mail';
	}
	if (scopes.file._oKnownFiles.PDF.indexOf(extension) > -1) {
		return 'PDF';
	}
	if (scopes.file._oKnownFiles.TEXT.indexOf(extension) > -1) {
		return 'Text';
	}

	if (scopes.file._oKnownFiles.WEB.indexOf(extension) > -1) {
		return 'Web';
	}

	if (scopes.file._oKnownFiles.IMAGE.indexOf(extension) > -1) {
		return 'Image';
	}
	return 'Other'
}

/**
 * @properties={type:12,typeid:36,uuid:"EBD36F34-0200-45FF-ACB9-A6B09F165FA0"}
 */
function bytesize() {
	var bytes = filesize
	var decimals = 2

	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat( (bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];

}

/**
 * TODO generated, please specify type and doc for the params
 * @param bytes
 *
 * @properties={type:12,typeid:36,uuid:"F9BE46A3-D339-4AF2-A80F-6B96C8C86119"}
 */
function bytesToSize(bytes) { }

/**
 * @properties={type:12,typeid:36,uuid:"74D430F2-9453-4FFA-8821-97793CD12B1D"}
 */
function indexStatus() {
	if (errormessage) {
		return "fa fa-exclamation-triangle error "
	}
	if (indexed) {
		return "fa fa-check-circle ok"
	}

	return ''
}

/**
 * @properties={type:12,typeid:36,uuid:"F03A7F0D-09D9-41A8-8554-FF40CA365BEB"}
 */
function real_id() {
	return 'id_' + id;
}

/**
 * @properties={type:12,typeid:36,uuid:"11356FC7-61D1-484A-8738-EA2B93006657"}
 */
function fileIcon2() {
	var _sExt = extension || '';
	switch (_sExt.toUpperCase()) {
	case "PDF":
		return "fa fa-file-pdf-o icon"
		break;
	case "DOCX" || "DOC" || "DOCM" || "DOTM" || "RTF":
		return "fa fa-file-word-o icon"
		break;
	case "TXT":
		return "fa fa-file-text-o icon"
		break;

	case "XLS" || "XLSX" || "XLSM":
		return "fa fa-file-excel-o icon"
		break;

	case "JPG" || "JPEG" || "PNG" || "PSD" || "TIF":
		return "fa fa-file-image-o icon"
		break;

	default:
		return "fa fa-file-o icon"
		break;
	}
}

/**
 * @properties={type:12,typeid:36,uuid:"7B20A6A6-A09A-4902-BAF2-9D9EB4EAD8C6"}
 */
function fileIcon() {
	if (!extension) {
		return "fa fa-file-o icon"
	}

	if (scopes.file._oKnownFiles.WORD.indexOf(extension) > -1) {
		return "fa fa-file-word-o icon"
	}
	if (scopes.file._oKnownFiles.EXCEL.indexOf(extension) > -1) {
		return "fa fa-file-excel-o icon"
	}
	if (scopes.file._oKnownFiles.MAIL.indexOf(extension) > -1) {
		return "fa fa-envelope-o icon"
	}
	if (scopes.file._oKnownFiles.PDF.indexOf(extension) > -1) {
		return "fa fa-file-pdf-o icon"
	}
	if (scopes.file._oKnownFiles.TEXT.indexOf(extension) > -1) {
		return "fa fa-file-text-o icon"
	}

	if (scopes.file._oKnownFiles.WEB.indexOf(extension) > -1) {
		return "fa fa-html5 icon"
	}

	if (scopes.file._oKnownFiles.IMAGE.indexOf(extension) > -1) {
		return "fa fa-file-image-o icon"
	}
	return "fa fa-file-o icon"

}
