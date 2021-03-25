/**
 * @properties={typeid:24,uuid:"72E05FC6-2931-4137-83CE-A89409A17D18"}
 */
function allowFormIncludedInMenu() {
	return true;
}

/**
* @protected 
* @return {RuntimeForm<AbstractMicroSample>}
* @override 
* @properties={typeid:24,uuid:"D970D405-6AD7-453E-B77D-FE9997A527C2"}
*/
function getParent() {
	return forms.commonComponentSamples;
}

/**
 *
 * @return {String}
 *
 * @properties={typeid:24,uuid:"481CC031-2391-4055-9F19-4F41F617AEB0"}
 */
function getName() {
	return 'Field Components';
}

/**
*
* @return {String}
*
* @properties={typeid:24,uuid:"A826D80E-4D95-47D9-BCB2-E789F6CDF0B8"}
*/
function getDescription() {
	return 'Common field components found in any business application'
}

/**
*
* @return {String}
*
* @properties={typeid:24,uuid:"0EDAFEE4-10A4-41C7-A26B-A0E58E2E3C5D"}
*/
function getIconStyleClass() {
	return 'fa fa-pencil';
}

/**
* @protected 
* @return {String} The sort order, i.e. 1, 1.1, 1.1.2
*
* @properties={typeid:24,uuid:"5E54CC8D-C877-4B7E-8837-00BE1A690474"}
*/
function getSort() {
	return '1';
}
