/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"C58FF477-9F1A-4C4C-9031-F31B924C4E3E"}
 */
function onActionDelete(event) {
	if (application.getApplicationType() != APPLICATION_TYPES.WEB_CLIENT && plugins.dialogs.showQuestionDialog("Confirm delete","Are you sure you want to delete?","NO","YES") == 'YES') {
		controller.deleteRecord();
	}
}
