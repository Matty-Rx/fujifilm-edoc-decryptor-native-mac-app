function yesClicked(strId)
{
	var a;
	var splitIdCnt = strId.lastIndexOf(".");
	var splitId = strId.substring(0, splitIdCnt);
	
	var bFoundId = false;

	for (i=1;; i++) {
		var strBefId = String("");
		var strChkId = String("");
		strNum = String(i);
		for (var j=5; j > strNum.length; j--) {
			strChkId = strChkId.concat("0");
		}
		var strChkId = splitId + "." + strChkId + i;

		var chkItem = document.getElementById(strChkId);
		if (chkItem == null) {
			break;
		}

		if (strChkId == strId) {
			chkItem.style.color="#FF3333";
			bFoundId = true;

			if (i%2 == 0) {
				strNum = String(i-1);
				for (var j=5; j > strNum.length; j--) {
					strBefId = strBefId.concat("0");
				}
				var strBefId = splitId + "." + strBefId + (i-1);
				chkItem = document.getElementById(strBefId);
				chkItem.style.color="black";
			}
		} else {
			if (bFoundId == true) {
				chkItem.style.color="black";
			}
		}
	}
	var arrBranchLine = document.getElementsByTagName('DIV');
	for (var i=0,j=arrBranchLine.length; i<j; i++){
		if(arrBranchLine[i].className=="no-branch-line")
		arrBranchLine[i].style.color="black";
	}
}

function plItemHighright() {

h2Element = document.getElementById("h2id");
pldivElement = document.getElementById("pldiv");

// 下の1行をコメントにする
//pldivElement.style.height=document.body.clientHeight-(pldivElement.offsetTop+h2Element.offsetTop)-5;

//pldivElement.style.height=document.documentElement.clientHeight-(pldivElement.offsetTop+h2Element.offsetTop);

	trElement = document.getElementsByTagName("TR");
	for (i = 0; i < trElement.length; i++) {
		if (trElement[i] == "[object]" || trElement[i] == "[object HTMLTableRowElement]") {
			trElement[i].style.background = "";
		}
	}

	var strUrl = document.URL;
	var strHash;
	if (strUrl.indexOf("#") != -1) {
		strHash = strUrl.substring(strUrl.indexOf("#")+1);
	}

	if(navigator.userAgent.indexOf("MSIE") == -1) {
	  var AnchorElement = document.getElementById(strHash);
	  if(!!AnchorElement){
	    trElement = AnchorElement.parentElement;
	    if (!trElement) {
	      return;
	    }
	    if (/td/i.test(trElement.tagName)) {
	      trElement = trElement.parentElement;
	    }
	    trElement.style.background="#ffcccc";
	    return;
	  } 
	}

	AnchorElement = document.getElementsByName(strHash);

	for (i = 0; i < AnchorElement.length; i++) {

		trElement = AnchorElement[i].parentElement;

		if (trElement == undefined) {
			continue;;
		}

		if (trElement.tagName == "TD" || trElement.tagName == "td") {
			trElement = trElement.parentElement;
		}
		
		trElement.style.background="#ffcccc";

	}
}

var trHighrightId;
function trHighright() {

	var trElement = document.getElementsByTagName('TR');
	for (i = 0; i < trElement.length; i++) {
		if (trElement[i] == "[object]" || trElement[i] == "[object HTMLTableRowElement]") {
			trElement[i].style.background = "";
		}
	}

	var strUrl = document.URL;
	var strHash;
	if (strUrl.indexOf("#") != -1) {
		strHash = strUrl.substring(strUrl.indexOf("#")+1);
	}

//	strHash = String(document.location.hash);
//	strHash = strHash.substring(1);

	tdElement = document.getElementById(strHash);
//	if (tdElement.tagName == "td") {
//		tdElement = tdElement.parentElement;
//	}

	if (tdElement == undefined) {
		return;
	}
	
	trElement = tdElement.parentElement;

	if (trElement == undefined) {
		return;
	}

	if (trElement.tagName == "TD" || trElement.tagName == "td") {
		trElement = trElement.parentElement;
	}

	if (trElement.tagName == "TR" || trElement.tagName == "tr") {
		trElement.style.background="#ffcccc";
	}
}

function openPrintWindow() {
	window.open(window.location.href,"printWindow");
}

function drawSquare(strTargetId) 
{

	var arTargetId = strTargetId.split(",");
	var mapElement = document.getElementsByTagName('map');

	if (mapElement.length != 1) {
		return;
	}

	strMapId = mapElement[0].getAttribute("name");
	ImageElement = document.getElementById(strMapId);
	MainElement = document.getElementById("main");

	// canvas要素のノードオブジェクト 
	 var canvas = document.getElementById("imgCanvas");
	// canvas要素の存在チェックとCanvas未対応ブラウザの対処 
	if ( ! canvas || ! canvas.getContext ) {
		return false;
	}

	// 一旦クリアする
	clearRectOnCanvas(canvas)

	for(var i=0; i < arTargetId.length; i++) {
		areaElement = document.getElementById(arTargetId[i]);
		
		if (areaElement == undefined || areaElement == null) {
			return false;
		}
		strCoords = areaElement.getAttribute("coords");
		arrCoords = strCoords.split(",");

		drawRectOnCanvas(canvas, arrCoords);
	}
}

function drawBsdSquare() {

	if(!document.getElementById("bsd")){return;}

	var canvas = null;
	var canvasDiv = null;
	var image = null;
	var imageDiv = null;

	if (isNewHtml()) {
		canvas = document.getElementById('bsdImgCanvas');
		canvasDiv = document.getElementById('bsdCanvas');
		image = document.getElementById('imageArea');
		imageDiv = document.getElementById('imgArea');

		canvasDiv.style.top = imageDiv.offsetTop;
		canvasDiv.style.left = imageDiv.offsetLeft;

		var scrollbarWidth = imageDiv.offsetWidth - imageDiv.clientWidth;
		var scrollbarHeight = imageDiv.offsetHeight - imageDiv.clientHeight;
		canvasDiv.style.width = imageDiv.offsetWidth - scrollbarWidth
		canvasDiv.style.height = imageDiv.offsetHeight - scrollbarHeight;

	} else {
		canvas = document.getElementById('canvas');
		image = document.getElementById('image');
	}

	// canvas要素の存在チェックとCanvas未対応ブラウザの対処 
	if ( ! canvas || ! canvas.getContext ) {
		return false;
	}

	// マウス移動によるCanvasとImgの重なり制御設定
	SetCanvasAndImageMouseActionBsd(canvas, image, canvasDiv, imageDiv);

	var strHash = String(document.location.hash);
	if (!strHash || strHash.length <= 0) {
		// 描画対象が指定されていない
		return;
	}

	strHash = strHash.substring(1);
	var mapElement = document.getElementsByTagName('map');

	if (mapElement.length != 1) {
		return;
	}

	strMapId = mapElement[0].getAttribute("name");
	ImageElement = document.getElementById(strMapId);
	MainElement = document.getElementById("main");

	areaElement = document.getElementById(strHash);

	strCoords = areaElement.getAttribute("coords");
	if(! strCoords){return false;}

	arrCoords = strCoords.split(",");
	if(arrCoords.length < 4){return false;}

	// square描画
	clearRectOnCanvas(canvas);
	drawRectOnCanvas(canvas, arrCoords);

	if (isNewHtml()) {
		var ImageDivElement = document.getElementById("imgArea");	// BSDのイメージDIV
		var bsdDivCanvas = document.getElementById("bsdCanvas");	// キャンバスのイメージDIV
		// 赤四角まで移動する
		if (ImageDivElement.scrollLeft != arrCoords[0]
			&& ImageDivElement.scrollTop != arrCoords[1]) {

			ImageDivElement.scrollLeft = arrCoords[0];
			ImageDivElement.scrollTop = arrCoords[1];

			// 幅の同時スクロール
			bsdDivCanvas.scrollLeft = ImageDivElement.scrollLeft;
			// 高さの同時スクロール
			bsdDivCanvas.scrollTop  = ImageDivElement.scrollTop;
		}
	} else {
		var wrapper = document.getElementById("wrapper");
		var figure = document.getElementById("image");
		if(!wrapper || !figure){
			return;
		}

		var squareScrollTop = square.top;
		var elem;
		for(elem = figure; elem !== wrapper && !!elem; elem = elem.offsetParent){
			squareScrollTop += elem.offsetTop;
		}
		wrapper.scrollTop = squareScrollTop;

		var squareScrollLeft = square.left;
		for(elem = figure; elem !== wrapper && !!elem; elem = elem.offsetParent){
			squareScrollLeft += elem.offsetLeft;
		}
		wrapper.scrollLeft = squareScrollLeft;
	}
}

function clearRectOnCanvas(canvas) {
	var ctx = canvas.getContext('2d');
	ctx.beginPath();
	ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
	ctx.closePath();
}

function drawRectOnCanvas(canvas, coords) {
	square = {};
	square.left = parseInt(coords[0],10);
	square.top = parseInt(coords[1],10);
	square.width = parseInt(coords[2],10) - square.left;
	square.height = parseInt(coords[3],10) - square.top;

	// 2Dコンテキスト 
	var ctx = canvas.getContext('2d');
	ctx.beginPath();

	// 四角を描く 
	ctx.strokeStyle = "rgb(255, 0, 0)";
	ctx.lineWidth = 2;
	ctx.strokeRect(square.left, square.top, square.width, square.height);
	ctx.closePath();
}

//
// キャンバスをBSDのイメージにあわせる
//
function iniBsdCanvas () {

	var ImageElement = document.getElementById("imageArea");
	var ImageDivElement = document.getElementById("imgArea");

	var bsdDivCanvas = document.getElementById("bsdCanvas");
	var canvas = document.getElementById("bsdImgCanvas");

	var scrollbarWidth = ImageDivElement.offsetWidth - ImageDivElement.clientWidth;
	var scrollbarHeight = ImageDivElement.offsetHeight - ImageDivElement.clientHeight;

	if (isCompatibleMode()) {
		bsdDivCanvas.style.top = ImageDivElement.offsetTop;
		bsdDivCanvas.style.left = ImageDivElement.offsetLeft;
		bsdDivCanvas.style.width = ImageDivElement.offsetWidth - scrollbarWidth;
		bsdDivCanvas.style.height = ImageDivElement.offsetHeight - scrollbarHeight;

		canvas.style.top = ImageElement.offsetTop;
		canvas.style.left = ImageElement.offsetLeft;
		canvas.style.width = ImageElement.clientWidth;
		canvas.style.height = ImageElement.clientHeight;
	}

	// canvas要素の存在チェックとCanvas未対応ブラウザの対処 
	if ( ! canvas || ! canvas.getContext ) {
		return false;
	}
}

//
// BSDのイメージとキャンバスを同時にスクロールさせる
//
function bsd_scroll() {

	var ImageDivElement = document.getElementById("imgArea");	// BSDのイメージDIV
	var bsdDivCanvas = document.getElementById("bsdCanvas");	// キャンバスのイメージDIV

	// 幅の同時スクロール
	bsdDivCanvas.scrollLeft = ImageDivElement.scrollLeft;
	// 高さの同時スクロール
	bsdDivCanvas.scrollTop  = ImageDivElement.scrollTop;
}

function bsd_resize() {

	MainElement = document.getElementById("main");
	BsdElement = document.getElementById("bsd");

	if (!BsdElement) {
		return;
	}

	if (isNewHtml()) {
		var ImageDivElement = document.getElementById("imgArea");	// div
		var ImageElement = document.getElementById("imageArea");	// img

		var bsdDivCanvas = document.getElementById("bsdCanvas");	// div
		var canvas = document.getElementById("bsdImgCanvas");		// canvas

		var scrollbarWidth = ImageDivElement.offsetWidth - ImageDivElement.clientWidth;
		var scrollbarHeight = ImageDivElement.offsetHeight - ImageDivElement.clientHeight;

		if (isCompatibleMode()) {
			bsdDivCanvas.style.top = ImageDivElement.offsetTop;
			bsdDivCanvas.style.left = ImageDivElement.offsetLeft;
			bsdDivCanvas.style.width = ImageDivElement.offsetWidth - scrollbarWidth;
			bsdDivCanvas.style.height = ImageDivElement.offsetHeight - scrollbarHeight;

			canvas.style.left = ImageElement.offsetLeft;
			canvas.style.top = ImageElement.offsetTop;
			canvas.style.width = ImageElement.clientWidth;
			canvas.style.height = ImageElement.clientHeight;
		}
	}

	var h2Element = document.getElementsByTagName("h2");
	var objElement = document.getElementsByTagName("div");
	objElement[2].style.height=document.body.offsetHeight - (objElement[2].offsetTop + h2Element[0].offsetTop);
}

var searchMenuId;
var strLeftUrl;

function searchMenu() {

	if (top.doc == undefined) {
		return;
	}
	if (strLeftUrl == top.doc.navi.location.href) {
		return;
	}

	// 現在の左側のHTMLを保存する
	strLeftUrl = top.doc.navi.location.href;

	// 現在のドキュメントの拡張子を除くHTMLファイル名を取得する
	var strUrl = location.href;
	// #以降を削除する
	if (strUrl.lastIndexOf("#") > -1) {
		strUrl = strUrl.substring(0, strUrl.lastIndexOf("#"));
	}
	// ファイル名のみ取得する
	strUrl = strUrl.substring(strUrl.lastIndexOf("/")+1);
	strUrl = strUrl.substring(0,strUrl.lastIndexOf("."));

	// 前のページの背景を元に戻す
	if (top.top.doc.navi.getId == undefined) {
		return;
	}
	var objwMenu = top.doc.navi.document.getElementById(top.top.doc.navi.getId());
	if (objwMenu != undefined && objwMenu != null) {
		objwMenu.style.background="";
//		return;
	}

	// 現在表示しているドキュメントのオブジェクトを取得する
	var objMenu = top.doc.navi.document.getElementById(strUrl);

	if (objMenu == undefined || objMenu == null) {
		return;
	}
	
	// 現在表示しているドキュメントに対応したメニューの背景を変更する
	objMenu.style.background="#ffcccc";

	var objDispMenu = objMenu.parentNode.parentNode;
	var objImg = objDispMenu.parentNode.childNodes[0].childNodes[0];

	while (objDispMenu != undefined && objDispMenu != null && objImg != undefined && objImg != null) {
		if (objDispMenu.tagName == "UL" && objImg.tagName == "IMG") {
			objDispMenu.style.display = "";

			// スクリプト内に環境依存のアイコンパスが記述されているので
			// 既存の閉じたアイコンのパスを使用して開いたアイコンのパスを設定する。
			var imgpath = objImg.href;
			var ps = imgpath.lastIndexOf('/');
			imgpath = imgpath.substring(0, ps);
			//objImg.src ="../../common2/images/folder_open_y.gif";
			objImg.src = imgpath + '/' + 'folder_open_y.gif';
		} else {
			break;
		}

		objDispMenu = objDispMenu.parentNode.parentNode;
		objImg = objDispMenu.parentNode.childNodes[0].childNodes[0];
	}

	var objSub = top.doc.navi.document.getElementById("sub");

	var scrollbarHeight = top.doc.navi.document.body.offsetHeight - top.doc.navi.document.body.clientHeight;

	// 現在表示しているドキュメントのメニューが上に隠れている場合、スクロールさせて表示する
	if(navigator.userAgent.indexOf("MSIE") == -1) {
		if (parseInt(objMenu.offsetTop) < (parseInt(top.doc.navi.document.body.scrollTop))) { // firefox
			top.doc.navi.window.scrollTo(0,objMenu.offsetTop - 5);
		}
	} else {
		if (parseInt(objMenu.offsetTop) < (parseInt(top.doc.navi.document.body.scrollTop) - parseInt(objSub.offsetTop))) { // IE
			top.doc.navi.window.scrollTo(0,objMenu.offsetTop + objSub.offsetTop - 5); // +5で調整
		}
	}

	// 現在表示しているドキュメントのメニューが下に隠れている場合、スクロールさせて表示する
	if(navigator.userAgent.indexOf("MSIE") == -1) {
		if (top.doc.navi.document.body.scrollTop + top.doc.navi.document.body.clientHeight <  objMenu.offsetTop + objMenu.offsetHeight) {
			top.doc.navi.window.scrollTo(0,objMenu.offsetTop);
		}
	} else {
		if (objMenu.offsetTop - top.doc.navi.document.body.scrollTop > top.doc.navi.document.body.clientHeight  - scrollbarHeight - objSub.offsetTop) {
			top.doc.navi.window.scrollTo(0,objMenu.offsetTop);
		}
	}

	// 現在表示しているドキュメントのIdを保存する
	top.doc.navi.setId(strUrl);
//	if (searchMenuId != undefined) {
//		clearInterval(searchMenuId);
//	}
}

var ImgWidth = 296;
var ImgHeight = 296;

function RepCanvasDraw(strId, strImage, strWidth, strHeight) {	
  
	var canvas = document.getElementsByTagName('canvas');
	for (var i=0; i < canvas.length; i++) {
		if ( ! canvas[i] || ! canvas[i].getContext ) {
			return false;
		}
		
		if (strId == canvas[i].id) {
			var ctx = canvas[i].getContext('2d');
			/* Imageオブジェクトを生成 */
			var img = new Image();
			img.src = "../figures/" + strImage + ".jpg?" + new Date().getTime();

			var MagnificationWidth,MagnificationHeight;
			if (strWidth > strHeight) {
				MagnificationHeight = strHeight / strWidth;
				MagnificationWidth = 1;
			} else {
				MagnificationWidth = strWidth / strHeight;
				MagnificationHeight = 1;
			}

			/* 画像を描画 */
			var width =  ImgWidth * MagnificationWidth;
			var height =  ImgHeight * MagnificationHeight;

			canvas[i].width = width;
			canvas[i].height = height;
			
			img.onload = function() {
				ctx.drawImage(img, 0, 0, strWidth, strHeight, 0 ,0, width, height);
			}
		}
	}
	
}

function AdjCanvasDraw(strId, strImage, strWidth, strHeight) {	

	var canvas = document.getElementsByTagName('canvas');
	for (var i=0; i < canvas.length; i++) {

		if ( ! canvas[i] || ! canvas[i].getContext ) {
			return false;
		}
		
		if (strId == canvas[i].id) {
			var ctx = canvas[i].getContext('2d');
			/* Imageオブジェクトを生成 */
			var img = new Image();
			img.src = "../figures/" + strImage + ".jpg?" + new Date().getTime();

			/* 画像を描画 */
			canvas[i].width = strWidth;
			canvas[i].height = strHeight;

			img.onload = function() {
				ctx.drawImage(img, 0, 0, strWidth, strHeight);
				
			}
		}
	}
	
}

function setCookie() {

	clearTimeout(timer1);

	if (top.doc != undefined && top.doc.main != undefined) {
		top.header.writeCookie("URL", top.doc.main.location.href, 1);
	} else if (top.main != undefined) {
		top.header.writeCookie("URL", top.main.location.href, 1);
	}
}

var timer1;

function chap_initialize() {
	searchMenuId = window.setInterval('searchMenu();', 500);

	if( top.document.title == "FULL EDOC" ){
		timerID=setTimeout("setHeader()", 100);
	}

	timer1 = window.setInterval('setCookie()', 100);		

	if (document.location.href.indexOf("welcome") != -1) {
			top.document.body.rows = "75,*,40";
	} else {
		if (top.footer != undefined) {
			if (top.footer.document.title.indexOf("Top") != -1) {
				top.document.body.rows = "75,*,0";
			}
		}
	}

    if(navigator.userAgent.indexOf("Android") < 0){
		return;
	}

	var height = 0;
	var i = 0;
	var contentsOfMain = document.getElementById("main").childNodes;

	for(i = contentsOfMain.length - 1; 0 <= i; i--){
		if(height <= contentsOfMain[i].offsetHeight){
			height = contentsOfMain[i].offsetHeight;
		}
	}
	document.body.style.height = height + "px";
}

function initialize() {
	searchMenuId = window.setInterval('searchMenu();', 500);
	window.setInterval('trHighright();', 1000);

	BlinkString();

	if( top.document.title == "FULL EDOC" ){
		timerID=setTimeout("setHeader()", 100);
	}

	timer1 = window.setInterval('setCookie()', 100);

	if (document.location.href.indexOf("welcome") != -1) {
			top.document.body.rows = "75,*,40";
	} else {
		if (top.footer != undefined) {
			if (top.footer.document.title.indexOf("Top") != -1) {
				top.document.body.rows = "75,*,0";
			}
		}
	}
}

function pl_initialize() {
	// androidではパーツリストが縦スクロールしないようにする必要がある。
	// 縦スクロールする要素はframeを飛び出してしまうから。
	if(/android/i.test(navigator.userAgent)){
		if(parseInt(pldiv.style['height']) < pldiv.scrollHeight + 2){
			pldiv.style['height'] = (pldiv.scrollHeight + 2) + "px";	// 2pxはボーダー幅の分
		}
	}

	plw = parseInt(pldiv.style.width) + 25;
	var w = document.body.clientWidth - parseInt(imgCanvas.style.width);
	if (w < plw) {
		pldiv.style.width = plw;
		pltbl.style.width = plw - 76;
	} else {
		pldiv.style.width = "auto";
		pltbl.style.width = "auto";
	}

	var mapElement = document.getElementsByTagName('map');

	if (mapElement.length != 1) {
		return;
	}

	// canvas要素のノードオブジェクト 
	var canvas = document.getElementById("imgCanvas");
	// canvas要素の存在チェックとCanvas未対応ブラウザの対処 
	if ( ! canvas || ! canvas.getContext ) {
		return false;
	}

	// 新eDOCでcanvasにwidth,height属性が指定されていない場合、
	// 矩形の縦横の比率が不正になり、位置がずれるためwidth,height属性追加
	var width = canvas.getAttribute('width');
	if (!width) {
		canvas.setAttribute('width', canvas.style.width);
	}
	var height = canvas.getAttribute('height');
	if (!height) {
		canvas.setAttribute('height', canvas.style.height);
	}

	var strMapId = mapElement[0].getAttribute("name");
	var ImageElement = document.getElementById(strMapId);

	searchMenuId = window.setInterval('searchMenu();', 500);
	window.setInterval('plItemHighright();', 1000);

	BlinkString();

	if( top.document.title == "FULL EDOC" ){
		timerID=setTimeout("setHeader()", 100);
	}

	timer1 = window.setInterval('setCookie()', 100);		

	if (document.location.href.indexOf("welcome") != -1) {
			top.document.body.rows = "75,*,40";
	} else {
		if (top.footer != undefined) {
			if (top.footer.document.title.indexOf("Top") != -1) {
				top.document.body.rows = "75,*,0";
			}
		}
	}

	// マウス移動によるCanvasとImgの重なり制御設定
	SetCanvasAndImageMouseAction(canvas, ImageElement);
}

function pl_resize() {

	if (typeof plw == 'undefinded') {
		var w = document.body.clientWidth - parseInt(imgCanvas.style.width);
		if (w < plw) {
			pldiv.style.width = plw;
			pltbl.style.width = plw - 76;
		} else {
			pldiv.style.width = "auto";
			pltbl.style.width = "auto";
		}
	} else {
		pldiv.style.width = "auto";
		pltbl.style.width = "auto";
	}

	var mapElement = document.getElementsByTagName('map');

	if (mapElement.length != 1) {
		return;
	}

	// canvas要素のノードオブジェクト 
	var canvas = document.getElementById("imgCanvas");
	// canvas要素の存在チェックとCanvas未対応ブラウザの対処 
	if ( ! canvas || ! canvas.getContext ) {
		return false;
	}

	strMapId = mapElement[0].getAttribute("name");
	ImageElement = document.getElementById(strMapId);
	ImageElement.style.left = canvas.offsetLeft;
	ImageElement.style.top = canvas.offsetTop;
}

function bsd_initialize() {

	var bsdElem = document.getElementById("bsd");

	if (!bsdElem) {
		return;
	}

	timer1 = window.setInterval('setCookie()', 100);		

	if( top.document.title == "FULL EDOC" ){
		timerID=setTimeout("setHeader()", 100);
	}
	
	if (document.location.href.indexOf("welcome") != -1) {
			top.document.body.rows = "75,*,40";
	} else {
		if (top.footer != undefined) {
			if (top.footer.document.title.indexOf("Top") != -1) {
				top.document.body.rows = "75,*,0";
			}
		}
	}
}

function rep_resize() {
}

function resize() {
}

var lngBlinkCount = 0;
var lngMaxBlinkCount = 10;
var lngBlinkFlag = 1;
var lngBlinkTimeId = 0;
var lngBlinkTimer = 500;
var objBlinkTxt;
function BlinkString(){

	objBlinkTxt = document.getElementsByTagName('div');
	objBlinkTxt2 = document.getElementsByTagName('span');

	if (lngBlinkCount < lngMaxBlinkCount) {
		
		// visible
		if(lngBlinkFlag == 0){ 
			for (i = 0; i < objBlinkTxt.length; i++) {
				if (objBlinkTxt[i].className == "danger" ||
					objBlinkTxt[i].className == "warning" ||
					objBlinkTxt[i].className == "caution") {
					objBlinkTxt[i].style.visibility = "visible";
				}
			}
			for (i = 0; i < objBlinkTxt2.length; i++) {
				if (objBlinkTxt2[i].className == "sccisc") {
					objBlinkTxt2[i].style.visibility = "visible";
				}
			}

			lngBlinkFlag = 1; 
			lngBlinkCount++;
		} 
		else{ 
			// hidden
			for (i = 0; i< objBlinkTxt.length; i++) {
				if (objBlinkTxt[i].className == "danger" ||
					objBlinkTxt[i].className == "warning" ||
					objBlinkTxt[i].className == "caution") {
					objBlinkTxt[i].style.visibility = "hidden";
				}
			}
			for (i = 0; i< objBlinkTxt2.length; i++) {
				if (objBlinkTxt2[i].className == "sccisc") {
					objBlinkTxt2[i].style.visibility = "hidden";
				}
			}

			lngBlinkFlag = 0; 
		} 

		if (lngBlinkTimeId != 0) {
			clearTimeout(lngBlinkTimeId);
		
		}
		lngBlinkTimeId = setTimeout("BlinkString()", lngBlinkTimer); 

	}
}

function fullTopic() {
	
	var WO;
	var nSizeWidth = screen.availWidth;
	var nSizeHeight = screen.availHeight;
	var strHref = location.href;
	var strHtmlString = "<HTML>" +
						"<HEAD><TITLE>FULL EDOC</TITLE></HEAD>" +
						"<FRAMESET ROWS=\"35,*\" frameborder=\"0\" framespacing=\"0\">" +
						"<FRAME src=\"../fullheader.html\"NAME=header noresize scrolling=\"no\">" +
						"<FRAME NAME=main src=\"" + strHref + "?new\" scrolling=\"yes\">" +
						"</FRAMESET>" +
						"</HTML>";

	if(/android/i.test(navigator.userAgent)){return;}

	WO = window.open("", "full", "status=yes,toolbar=no,location=no,menubar=yes,resizable=yes, top=0, left=0, width=" + nSizeWidth + ", height=" + nSizeHeight);
	WO.document.write(strHtmlString);

	WO.document.close();

	WO.window.moveTo(0, 0);
	WO.window.resizeTo(nSizeWidth, nSizeHeight);
}

var timerID;
function setHeader()
{

	clearTimeout(timerID);
	
	if (top.header.hea != undefined && top.header.hea.t1 != null) {
		top.header.hea.t1.value="";

		if( document.data.t2.value != ""){

			lngLen = document.data.t2.value.length;
			for (i = 0; i < lngLen; i++) {
				if (document.data.t2.value.charAt(i) == "\t")
					top.header.hea.t1.value += " ";
				else
					top.header.hea.t1.value += document.data.t2.value.charAt(i);					
			}
		}

		if( document.data.t3.value != ""){
			if (top.header.hea.t1.value != "")
				top.header.hea.t1.value += " \: ";
			lngLen = document.data.t3.value.length;
			for (i = 0; i < lngLen; i++) {
				if (document.data.t3.value.charAt(i) == "\t")
					top.header.hea.t1.value += " ";
				else
					top.header.hea.t1.value += document.data.t3.value.charAt(i);					
			}
		}
	
		///// 章リストボックスを設定する
		if( document.data.chap.value != ""){
			var chap = document.data.chap.value;
			var lngCnt = chap.indexOf("-");
			if (lngCnt != -1)
				chap = chap.substr(0, lngCnt);

			var nCnt = top.header.hea.gotopic.options.length;
			for (i = 0; i < nCnt; i ++) {
				strUrl = top.header.hea.gotopic.options[i].value;
				re = new RegExp(chap,"i");
				if (strUrl.match(re)) {
					top.header.hea.gotopic.options[i].selected = true;
					break;
				}
			}
		}

		top.header.hea.t1.focus();

	} else if(top.topic != undefined && top.topic.hea.t1 != null) {
		top.topic.hea.t1.value="";

		if( document.data.t2.value != ""){

			lngLen = document.data.t2.value.length;
			for (i = 0; i < lngLen; i++) {

				if (document.data.t2.value.charAt(i) == "\t")
					top.topic.hea.t1.value += " ";
				else
					top.topic.hea.t1.value += document.data.t2.value.charAt(i);					
			}
		}

		if( document.data.t3.value != ""){

			if (top.topic.hea.t1.value != "")
				top.topic.hea.t1.value += " \: ";
			lngLen = document.data.t3.value.length;
			for (i = 0; i < lngLen; i++) {

				if (document.data.t3.value.charAt(i) == "\t")
					top.topic.hea.t1.value += " ";
				else
					top.topic.hea.t1.value += document.data.t3.value.charAt(i);					
			}
		}
	}
}

function mainwindow_onload(mid) {

	if( top.document.title == "FULL EDOC" ){
		timerID=setTimeout("setHeader()", 100);
	}

}

// JavaScript ソース

/* Cookie への書き出し
     引数 key　 : データキー （半角英数 _ のみ）
     引数 value : データの値（日本語可）
     引数 days  : データを保持する日数（ 0 の時は有効期限は省略）*/
function writeCookie(key, value, days) {
     var str = key + "=" + escape(value) + ";path=/";         // 書き出す値１ : key=value
     if (days != 0) {                                                 /* 日数 0 の時は省略 */
          var dt = new Date();                                   // 現在の日時
          dt.setDate(dt.getDate() + days);                   // days日後の日時
          str += "expires=" + dt.toGMTString() + ";"; // 書き出す値２ : 有効期限
     }
     document.cookie = str;                                   // Cookie に書き出し
}

/* Cookie の読み込み
     引数 key : 求める値のキー
     戻り値　 : 値（ない時は空文字""）*/
function readCookie(key) {
     var sCookie = document.cookie;    // Cookie文字列
     var aData = sCookie.split(";");       // ";"で区切って"キー=値"の配列にする
     var oExp = new RegExp(" ", "g");   // すべての半角スペースを表す正規表現
     key = key.replace(oExp, "");          // 引数keyから半角スペースを除去

     var i = 0;
     while (aData[i]) {                           /* 語句ごとの処理 : マッチする要素を探す */
          var aWord = aData[i].split("=");                         // さらに"="で区切る
          aWord[0] = aWord[0].replace(oExp, "");              // 半角スペース除去
          if (key == aWord[0]) return unescape(aWord[1]); // マッチしたら値を返す
          if (++i >= aData.length) break;                          // 要素数を超えたら抜ける
     }
     return "";                                   // 見つからない時は空文字を返す
}

// ダイアグ実行
function Do_diag(ST){
	//top.header.document.diagctl1.Text = ST;
}


function runMemo(strChap) {
//		var strUrl;
//		strUrl = String(document.URL);
//	strUrl = strUrl.replace("contents", "chap" + strChap)
//	FxMemo.copyDocFile(String(strUrl));
}

function runPlMemo(strChap, strSubChap) {
//		var strUrl;
//		strUrl = String(document.URL);
//	strUrl = strUrl.replace("contents", "manual\\chap" + strChap)
//	FxMemo.copyPlDocFile(String(strUrl), strSubChap);
}

function goTop(){
	if(/android/i.test(navigator.userAgent)){
		top.window.scrollTo(0,0);
    }
};

function expand(elems){
    var i;
    
    // androidでは要素がスクロールしないようにする必要がある。
    // スクロールする要素はframeを飛び出してしまうから。
    for(i = elems.length - 1;0 <= i;i -= 1){

        (function(elem){
            var style,elemScrollOuterHeight, elemScrollOuterWidth;
            style = window.getComputedStyle(elem);

            if(!!style && style["overflow"] === "auto"){
                // 2pxはボーダー幅の分
                elemScrollOuterHeight = elem.scrollHeight + 2;
                elemScrollOuterWidth = elem.scrollWidth + 2;

                if(elem.offsetHeight < elemScrollOuterHeight){
				    elem.style['height'] = elemScrollOuterHeight + "px";
			    }
                if(elem.offsetWidth < elemScrollOuterWidth){
				    elem.style['width'] = elemScrollOuterWidth + "px";
			    }
            }
        })(elems[i]);
    }
};

function recalcHeight(elem){
	// 旧eDOCでリサイズ時の処理が何も設定されていないため
	// スクロールエリアのサイズ設定処理を再設定する。
	// 各ページで設定すべきところだが、htmlを再出力しないため、
	// 既存スクリプトに仕込む。
	// ※新eDOCでは本処理を使用していない。
    window.onresize = function() {
		bsd_resize();
	}
	bsd_resize();

	// 旧eDOCでonload時にBSDの画面で、下記処理を実行していないため
	// Cookieに現在のURLが保存されない。
	// そのため、拡大表示ウィンドウで前に保存したURLが表示される。
	bsd_initialize();

    if(!/android/i.test(navigator.userAgent)){return;};

    elem = elem || document.body;
    elem.style["height"] = (elem.scrollHeight + 40) + "px";
    // footerに1行だけめり込んで見えなくなることがある。
    // footer分の高さを補填しておくことで文言がめり込むことを回避する
}

// IE10以降Canvasとimgが重なる場合、それぞれの最前面のイベントしか検出しないので
// マウス移動でCanvasとimgの重なりを制御する。
function SetCanvasAndImageMouseAction(canvas, image) {
	if (canvas) {
		setTargetRect();
//		drawTest(canvas);
		canvas.style.zIndex = 1;
/*
		AddEventListener(canvas, 'mouseover',function() {
			doLater(function() {
				canvas.style.zIndex = -1;
				image.style.zIndex = 1;
			}, 100);

		});
*/
		document.onmousemove = function(event) {
			event = event || window.event;
			var x = event.pageX;
			var y = event.pageY;
			var rc = toRelativeCoord(canvas, x,y);
			
			if (isWithinRange(rc[0],rc[1])) {
				canvas.style.zIndex = -1;
				image.style.zIndex = 1;
			} else {
				canvas.style.zIndex = 1;
				image.style.zIndex = -1;
			}
		};
	}

	if (image) {
		AddEventListener(image, 'mouseout',function() {
			doLater(function() {
				canvas.style.zIndex = 1;
				image.style.zIndex = -1;
			}, 100);
		});
	}
}

function SetCanvasAndImageMouseActionBsd(canvas, image, canvasDiv, imageDiv) {
	if (canvas) {
		setTargetRect();
//		drawTest(canvas);
		canvas.style.zIndex = 1;
		if (canvasDiv) {
			canvasDiv.style.zIndex = 1;
		}
		image.style.zIndex = -1;
		if (imageDiv) {
			imageDiv.style.zIndex = -1;
		}
/*
		AddEventListener(canvas, 'mouseover',function(event) {
			doLater(function() {
				canvas.style.zIndex = -1;
				image.style.zIndex = 1;
			}, 100);

		});
*/
/*
		AddEventListener(canvas, 'click',function(event) {
			var main = document.getElementById('main');
			var x = event.pageX;
			var y = event.pageY;
			var rc = toRelativeCoord(this, x,y);
			alert("can(" + x + "," + y + ") ("+ rc[0] + "," + rc[1] + ") range:" + isWithinRange(rc[0],rc[1]))
		});
*/
		document.onmousemove = function(event) {
			event = event || window.event;
			var x = event.pageX;
			var y = event.pageY;
			var rc = toRelativeCoord(canvas, x,y);
			
			if (isWithinRange(rc[0],rc[1])) {
				canvas.style.zIndex = -1;
				image.style.zIndex = 1;

				if (canvasDiv) {
					canvasDiv.style.zIndex = -1;
				}
				if (imageDiv) {
					imageDiv.style.zIndex = 1;
				}
			} else {
				canvas.style.zIndex = 1;
				image.style.zIndex = -1;

				if (canvasDiv) {
					canvasDiv.style.zIndex = 1;
				}
				if (imageDiv) {
					imageDiv.style.zIndex = -1;
				}
			}
		};
	}

	if (image) {

		AddEventListener(image, 'mouseout',function() {
			doLater(function() {
				canvas.style.zIndex = 1;
				image.style.zIndex = -1;

				if (canvasDiv) {
					canvasDiv.style.zIndex = 1;
				}
				if (imageDiv) {
					imageDiv.style.zIndex = -1;
				}
			}, 100);
		});
/*
		AddEventListener(image, 'click',function(event) {
			var main = document.getElementById('main');
			var x = event.pageX;
			var y = event.pageY;
			main.innerHtml= "<span>(" + x + "," + y + ")</span>"
			alert("img(" + x + "," + y + ")")
		});
*/
	}
}

function AddEventListener( element, type, listener )
{
    if( element.addEventListener )
    {
        element.addEventListener( type, listener, false );
    }
    else if( element.attachEvent )
    {
        element.attachEvent( 'on' + type,
            function() { listener.apply( element, arguments ); } );
    }
}

function doLater(job, tmo) {
  //タイムアウト登録されているならキャンセル
  if(job in doLater.TID) {
    window.clearTimeout(doLater.TID[job]);
  }
  //タイムアウト登録する
  doLater.TID[job] = window.setTimeout(
      function() {
        //実行前にタイマーIDをクリア
        delete doLater.TID[job];
        //登録処理を実行
        try {
          job.call();
        } catch(e) {
          alert("EXCEPTION CAUGHT : " + job);
        }
    }, tmo);
}
doLater.TID = {};

function triggerEvent(element, event) {
	if (document.createEvent) {
		// IE以外
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent(event, true, true ); // event type, bubbling, cancelable
		return element.dispatchEvent(evt);
	} else {
		// IE
		var evt = document.createEventObject();
		return element.fireEvent("on"+event, evt);
	}
}

var areaCoords = [];

function setTargetRect() {
	var areaElems = document.getElementsByName("area");
	var areaElems = document.getElementsByTagName('area');
	for (i = 0; i < areaElems.length; i++){
		var coords = areaElems[i].getAttribute('coords');
		var parts = coords.split(',');
		areaCoords.push(parts)
	}
}

function isWithinRange(x,y) {
	for (i = 0; i < areaCoords.length; i++){
		var x1 = parseInt(areaCoords[i][0]);
		var y1 = parseInt(areaCoords[i][1]);
		var x2 = parseInt(areaCoords[i][2]);
		var y2 = parseInt(areaCoords[i][3]);
		if (x >= x1 & x <= x2) {
			if (y >= y1 & y <= y2) {
				return true;
			}
		}
	}
	return false;
}
function toRelativeCoord(elem, x,y) {
	var clientRect = elem.getBoundingClientRect() ;
	var positionX = clientRect.left + window.pageXOffset;
	var positionY = clientRect.top + window.pageYOffset;
	var rx = x - positionX ;
	var ry = y - positionY ;
	return [rx,ry];
}

function drawTest(canvas) {
	var ctx = canvas.getContext('2d');
	ctx.beginPath();
	ctx.strokeStyle = 'rgb(28, 5, 255)';
	//ctx.strokeStyle = '"green';
	//ctx.strokeStyle="#FF0000";
	ctx.lineWidth = 2;
	ctx.shadowOffsetX = 0;
	ctx.shadowBlur = 0;
	ctx.scale(1,1);
	ctx.translate(0,0);

	for (i = 0; i < areaCoords.length; i++){
		var x1 = parseInt(areaCoords[i][0]);
		var y1 = parseInt(areaCoords[i][1]);
		var x2 = parseInt(areaCoords[i][2]);
		var y2 = parseInt(areaCoords[i][3]);
		var w = x2 - x1;
		var h = y2 - y1;
		ctx.strokeRect(x1, y1, w, h);
	}

	//ctx.closePath();
}

function isNewHtml() {
	if (document.getElementById("bsdImgCanvas")) {
		return true;
	}
	return false;
}

function isCompatibleMode() {
	var userAgent = window.navigator.userAgent.toLowerCase();
	if (userAgent.indexOf("msie") != -1 || userAgent.indexOf("trident") != -1) {
		if (document.documentMode > 10) {
			return false;
		} else {
			return true;
		}
	} else {
		return false;
	}
}
