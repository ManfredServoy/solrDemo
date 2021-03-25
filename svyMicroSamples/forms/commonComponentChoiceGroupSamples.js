/**
 * @properties={typeid:24,uuid:"F0AAEC09-205D-4398-84DB-5C2CE867C9A7"}
 */
function allowFormIncludedInMenu() {
	return true;
}

/**
* @protected 
* @return {RuntimeForm<AbstractMicroSample>}
* @override 
* @properties={typeid:24,uuid:"AA557E3E-959A-499B-99B6-5985F52F1FE5"}
*/
function getParent() {
	return forms.commonComponentSamples;
}

/**
 *
 * @return {String}
 *
 * @properties={typeid:24,uuid:"E817CA27-7B35-4270-B41F-ED6B854F7C22"}
 */
function getName() {
	return 'Choice Group Components';
}

/**
*
* @return {String}
*
* @properties={typeid:24,uuid:"D51E43D0-9A61-4E30-886B-A87D46A270C1"}
*/
function getDescription() {
	return 'Common choice group components found in any business application'
}

/**
*
* @return {String}
*
* @properties={typeid:24,uuid:"F3BED5A6-7A8C-4F77-BDD1-D1E027471830"}
*/
function getIconStyleClass() {
	return "fa fa-list-ul";
}

/**
* @protected 
* @return {String} The sort order, i.e. 1, 1.1, 1.1.2
*
* @properties={typeid:24,uuid:"E0A6D360-3E4A-4B4F-A008-EFDD2E4857FB"}
*/
function getSort() {
	return '3';
}
