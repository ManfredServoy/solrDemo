customProperties:"formComponent:false,\
methods:{\
onLoadMethodID:{\
arguments:null,\
parameters:null\
}\
},\
useCssPosition:true",
dataSource:"db:/smart_doc/results",
encapsulation:108,
extendsID:"C465D8A8-5CF6-4919-A0A7-67008E90CFAA",
items:[
{
cssPosition:"-1,11,15,-1,136,30",
json:{
cssPosition:{
bottom:"15",
height:"30",
left:"-1",
right:"11",
top:"-1",
width:"136"
},
onActionMethodID:"2780C685-9F25-4FED-AD68-E5CEBC3C6278",
size:{
height:30,
width:80
},
text:"reset"
},
name:"button_Reset",
size:"80,30",
typeName:"bootstrapcomponents-button",
typeid:47,
uuid:"1597BCDF-7CDB-4237-83F7-EC28ECCF7EB9"
},
{
cssPosition:"-1,-1,11,117,558,30",
json:{
cssPosition:{
bottom:"11",
height:"30",
left:"117",
right:"-1",
top:"-1",
width:"558"
},
dataProviderID:"indexPath",
size:{
height:30,
width:140
}
},
name:"textbox_IndexPath",
size:"140,30",
typeName:"bootstrapcomponents-textbox",
typeid:47,
uuid:"2F094403-E9C1-41DC-86B6-214C174675F4"
},
{
cssPosition:"11,-1,-1,15,339,30",
json:{
cssPosition:{
bottom:"-1",
height:"30",
left:"15",
right:"-1",
top:"11",
width:"339"
},
dataProviderID:"queryString",
onActionMethodID:"DF74AD72-4268-4120-9D5F-8B1B74B7FB6E",
placeholderText:"Voer hier uw zoekterm in",
size:{
height:30,
width:140
}
},
name:"textbox_Search",
size:"140,30",
typeName:"bootstrapcomponents-textbox",
typeid:47,
uuid:"4CC5A0FE-D669-4A68-B5D2-B8CEACFBF027"
},
{
cssPosition:"-1,-1,11,11,98,30",
json:{
cssPosition:{
bottom:"11",
height:"30",
left:"11",
right:"-1",
top:"-1",
width:"98"
},
formIndex:0,
onActionMethodID:"4B37D35E-82D5-4F2C-86AD-D5768C2E7F8D",
size:{
height:30,
width:80
},
text:"Indexeer",
visible:true
},
name:"button_Index",
size:"80,30",
typeName:"bootstrapcomponents-button",
typeid:47,
uuid:"74D1138E-7504-404E-92E7-9EFD7C896C02"
},
{
height:480,
partType:5,
typeid:19,
uuid:"83EB0D9E-9445-4960-9A92-4041B8EC4C84"
},
{
cssPosition:"53,11,51,13,413,325",
json:{
columns:[
{
dataprovider:"id",
svyUUID:"55594208-4033-44B5-96C0-8581D590AA1F",
width:"40"
},
{
dataprovider:"path",
svyUUID:"97CEE3AE-DAE0-4C73-836D-D7BD2CD015D6"
},
{
dataprovider:"title",
svyUUID:"CD86BC9D-92EB-4575-ACC0-71AF7405586F"
}
],
cssPosition:{
bottom:"51",
height:"325",
left:"13",
right:"11",
top:"53",
width:"413"
}
},
name:"table_Results",
typeName:"servoyextra-table",
typeid:47,
uuid:"B75942B1-A1DF-4B1D-BEE0-6410DFA6B55D"
},
{
cssPosition:"11,11,-1,-1,190,30",
json:{
cssPosition:{
bottom:"-1",
height:"30",
left:"-1",
right:"11",
top:"11",
width:"190"
},
onActionMethodID:"376C2823-C60F-4115-9FF6-22FB3949489B",
size:{
height:30,
width:80
},
text:"Geavanceeerd Zoeken"
},
name:"button_AdvancedSearch",
size:"80,30",
typeName:"bootstrapcomponents-button",
typeid:47,
uuid:"F04C424F-A208-4B12-8A7B-98FB19743C9B"
}
],
name:"maing",
navigatorID:"-1",
onLoadMethodID:"3AAE8E63-3B61-496B-AF6E-CCDD16785884",
showInMenu:true,
size:"831,480",
typeid:3,
uuid:"09E925BF-46D4-482D-BF07-762086296A8E"