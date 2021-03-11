dataSource:"db:/smart_doc/results",
items:[
{
anchors:3,
location:"520,340",
mediaOptions:14,
onActionMethodID:"BFC6DC20-595A-49C9-8150-04D38B48CD35",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
size:"110,20",
text:"Clear files/urls",
typeid:7,
uuid:"11CFC35D-D8E0-4833-9072-3F9BA13F4843"
},
{
anchors:15,
beanClassName:"net.stuff.servoy.beans.dnd.DnDFileBean",
beanXML:"<?xml version=\"1.0\" encoding=\"UTF-8\"?> \
<java version=\"1.6.0_23\" class=\"java.beans.XMLDecoder\"> \
 <object class=\"net.stuff.servoy.beans.dnd.DnDFileBean\"> \
  <void property=\"opaque\"> \
   <boolean>false<\/boolean> \
  <\/void> \
  <void property=\"recurseFolders\"> \
   <boolean>true<\/boolean> \
  <\/void> \
 <\/object> \
<\/java> \
",
formIndex:-2,
location:"10,370",
name:"bean_dnd",
size:"620,170",
typeid:12,
uuid:"1F10096D-06C4-4BCD-863F-ADCA65F838D5"
},
{
anchors:3,
location:"500,90",
mediaOptions:14,
onActionMethodID:"4FA2DB12-2AA3-40A8-830F-FE7D2F638E9C",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
size:"130,20",
text:"Show saved file...",
typeid:7,
uuid:"2FB3AFDB-0577-43CD-84F1-0EC4D6CC4E30"
},
{
anchors:11,
borderType:"LineBorder,1,#000000",
items:[
{
containsFormID:"F0B542C0-ACA9-4717-866A-AA46F623342E",
location:"20,130",
text:"urls",
typeid:15,
uuid:"97C74E41-C30C-4822-B980-736550874F89"
}
],
location:"10,120",
name:"tab_urls",
size:"620,210",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"44C0064C-B9D5-4449-B6B1-C2F7B2B1A95B"
},
{
location:"10,100",
margin:"0,5,0,0",
mediaOptions:14,
size:"150,20",
tabSeq:-1,
text:"Index all the urls here:",
transparent:true,
typeid:7,
uuid:"457E1D67-4222-4028-B84F-2415B7626194"
},
{
location:"10,45",
mediaOptions:14,
onActionMethodID:"1B3A47F6-151A-4DE2-A2D7-9930547F2467",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
size:"120,30",
text:"INDEX!",
typeid:7,
uuid:"549C59E4-BF06-402F-B16F-3027D1C9CAE2"
},
{
anchors:11,
dataProviderID:"subPath",
location:"360,50",
name:"subPath",
size:"270,20",
text:"Subpath",
typeid:4,
uuid:"6C89DAD7-D8B8-4EA8-A0ED-DA38F7FDC823"
},
{
dataProviderID:"onlyNew",
displayType:4,
fontType:"Segoe UI,1,12",
location:"140,50",
size:"130,20",
text:"New ones only",
typeid:4,
uuid:"81C7C153-0A96-4E22-A5BE-09549AEFF40B"
},
{
anchors:15,
borderType:"BevelBorder,1",
formIndex:-1,
horizontalAlignment:0,
location:"10,370",
mediaOptions:14,
size:"620,170",
tabSeq:-1,
text:"DROP SURFACE",
transparent:true,
typeid:7,
uuid:"86DDB134-60CB-4320-BF8C-F8A9BD4B7FDB",
verticalAlignment:0
},
{
location:"10,350",
margin:"0,5,0,0",
mediaOptions:14,
size:"190,20",
tabSeq:-1,
text:"And the dropped files/urls here:",
transparent:true,
typeid:7,
uuid:"A75BA016-4E1C-49EA-8616-B1DB8500DED5"
},
{
anchors:3,
location:"490,10",
mediaOptions:14,
onActionMethodID:"B72176A1-659E-4ECE-A274-7E89111C4F09",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
size:"140,20",
text:"Go to search...",
typeid:7,
uuid:"A831C575-FEC8-40E5-8D90-41B91F9D4BC9"
},
{
fontType:"Segoe UI,1,12",
horizontalAlignment:4,
labelFor:"subPath",
location:"290,50",
mediaOptions:14,
size:"60,20",
tabSeq:-1,
text:"New path",
transparent:true,
typeid:7,
uuid:"E97F6301-FA2A-4E81-93A5-A1BD8C8CC751"
},
{
fontType:"Segoe UI,1,14",
location:"10,10",
mediaOptions:14,
size:"390,20",
tabSeq:-1,
text:"INDEX / ADD DOCUMENTS",
transparent:true,
typeid:7,
uuid:"ED0B2ED2-0FAB-45BD-8115-BAEA4842ABC7"
},
{
height:550,
partType:5,
typeid:19,
uuid:"F0930B2A-FBC8-4629-B232-B9FD8A981015"
},
{
anchors:3,
location:"400,90",
mediaOptions:14,
onActionMethodID:"3AA4CE5E-4B9B-445C-827D-8EB36B991C6B",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
size:"80,20",
text:"Add url",
typeid:7,
uuid:"F0CA430A-22CC-40DF-A945-0CC71E46A8FC"
}
],
name:"main",
navigatorID:"-1",
onLoadMethodID:"-1",
onShowMethodID:"-1",
paperPrintScale:100,
showInMenu:true,
size:"640,550",
typeid:3,
uuid:"FF9A4E7E-BC6B-4D37-8986-94F6286FF41F"