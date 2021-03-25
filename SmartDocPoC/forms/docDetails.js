/**
 * @param {JSRecord<db:/smart_doc/results>} file
 *
 * @properties={typeid:24,uuid:"B5042A5A-E4F1-4275-937B-74C96D52E9D1"}
 */
function download(file) {
	var f = plugins.file.convertToJSFile(file.path)
	plugins.file.writeFile(file.filename, f.getBytes())
}



/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"79B22E9E-275E-40D1-A849-1A9C6D89F905"}
 */
function onActionDownload(event) {
	download(foundset.getSelectedRecord())
}



/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"D3CF9011-BD0D-4886-93D4-87E6F392A46C"}
 */
function onActionNotImplementedYet(event) {
	plugins.webnotificationsToastr.info("Peninding Requirements")
}
