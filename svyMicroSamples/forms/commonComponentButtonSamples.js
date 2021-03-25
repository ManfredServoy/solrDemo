/**
 * @properties={typeid:24,uuid:"33EBDCB1-CBD1-4EB9-91D2-76C11C52C430"}
 */
function allowFormIncludedInMenu() {
	return true;
}

/**
* @protected 
* @return {RuntimeForm<AbstractMicroSample>}
* @override 
* @properties={typeid:24,uuid:"5865AC89-123D-4143-BEF5-8E357370B8CA"}
*/
function getParent() {
	return forms.commonComponentSamples;
}

/**
 *
 * @return {String}
 *
 * @properties={typeid:24,uuid:"5D14BF43-C50D-4A3B-BD31-6214F7631475"}
 */
function getName() {
	return 'Buttons Components';
}

/**
*
* @return {String}
*
* @properties={typeid:24,uuid:"27FB7BB4-2393-4FB4-8690-952F20B6F7FF"}
*/
function getDescription() {
	return 'Common buttons components found in any business application'
}

/**
*
* @return {String}
*
* @properties={typeid:24,uuid:"AFF13A74-CBBE-49AC-A964-4E5FC411799C"}
*/
function getIconStyleClass() {
	return "fa fa-plus-square-o";
}

/**
* @protected 
* @return {String} The sort order, i.e. 1, 1.1, 1.1.2
*
* @properties={typeid:24,uuid:"3BD098E1-01A1-4C69-8A6A-6CAFECF4EE46"}
*/
function getSort() {
	return '2';
}
