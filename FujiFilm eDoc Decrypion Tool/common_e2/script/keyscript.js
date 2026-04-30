var presskey=0;
var altkey;
var ctrlkey;
var shiftkey;

document.onkeydown = keydownHandler;
function keydownHandler(){
	altkey = event.altKey;
	ctrlkey = event.ctrlKey;
	shiftkey = event.shiftKey;
	presskey = event.keyCode;


//	alert(event.srcElement.src);
//	alert(document.avtiveElement);
	// ←キーが押された
	if (presskey == 37) {
		if (altkey == true) {
			
		} else {
//			alert(top.main);
//			alert(top.manual);
			if (top.main != undefined) {
				goToPrevious();
			}
		}
	}

	// ↑↓キーが押された
	if (presskey == 38 || presskey == 40) {
		if (altkey == true) {
//			alert("a");
			top.header.hea.gotopic.focus();
		} else {
//			top.main.focus();
		}
	}

	// →キーが押された
	if (presskey == 39) {
		if (altkey == true) {
			
		} else {
			if (top.main != undefined) {
				goToNext();
			}
		}
	}

	if (presskey == 9) {
		if (shiftkey == true) {
//			alert('back');
			nCntAnchor = nCntAnchor - 1; 
			if (nCntAnchor < 0) {
//				alert(nCntAnchor);
//				nCntAnchor = nAllAnchor - 1;
				nCntAnchor = 0;
//				top.main.document.all.tags("A")(nCntAnchor).focus();
			}
		} else {
//			alert('prev');
			nCntAnchor = nCntAnchor + 1; 
			if (nCntAnchor > nAllAnchor - 1) {
				
//				alert(nCntAnchor);
				nCntAnchor = nAllAnchor - 1;
			}
		}
//		alert(nCntAnchor);
/*		for (i=0; i <= 13; i++) {
//			alert(document.links[i].href);
			for (j=0; j<100; j++) {
				top.main.document.all.tags("A")(i).focus();
			}
		}
*/
//		alert("Cnt=" + nCntAnchor);
//対比
/*		if (isNaN(nCntAnchor) == true) {
//			alert("Cnt=NaN");
			if (shiftkey == true) {
//				top.main.document.all.tags("A")(0).focus();
				top.main.getElementsByTagName('A')(0).focus();
				window.status="a " + nCntAnchor;
			} else {
//				alert(nAllAnchor);
//				top.main.document.all.tags("A")(nAllAnchor-1).focus();
				top.main.getElementsByTagName('A')(nAllAnchor-1).focus();
				window.status="b " + nCntAnchor;
			}
		// 実行しないようだ
		} else {
			if (shiftkey == true) {
				top.main.document.all.tags("A")(nCntAnchor).focus();
				window.status="c " + nCntAnchor;
			} else {
//				alert(nCntAnchor);
				top.main.document.all.tags("A")(nCntAnchor).focus();
				window.status="d " + nCntAnchor;
			}
*/

//			alert("b");
//			top.main.document.all.tags("A")(nCntAnchor).focus();
//			alert("focus="+nCntAnchor);
//			top.main.document.all.tags("A")(nCntAnchor).focus();
//			alert("Cnt=" + nCntAnchor);
//			alert("1");
/*			for (i=0; i<1000; i++) {
			top.main.document.all.tags("A")(1).focus();
			}
//			alert("2");
			for (i=0; i<1000; i++) {
			top.main.document.all.tags("A")(2).focus();
			}
//			alert("2");
			for (i=0; i<1000; i++) {
			top.main.document.all.tags("A")(3).focus();
			}
//			alert("2");
			for (i=0; i<1000; i++) {
			top.main.document.all.tags("A")(4).focus();
			}
//			alert("a")
*/
		}
//		obj = top.main.document.all.tags("A")(13);
//		alert(nAllAnchor + " " + nCntAnchor);
//		if (obj != null) {
//			obj.focus();
//		} else {
//			alert(nCntAnchor);
//		}
//		window.status=top.main.document.all.tags("A")(nCntAnchor) + " " + nCntAnchor;
//対比	}

	// Enterが押された
	if (presskey == 13) {
		if (altkey == true) {
//			obj = top.main.document.all.tags("A")(0);
//			obj.focus();
			 top.main.focus();
		} else {
		}
	}

	// Wが押された
	if (presskey == 87) {
		if (altkey == true) {
			if (top.main != undefined) {
	//			if (errFlag =='false') {
	//				alert('FxEdoc.dll is Not installed.');
	//			} else {
	//				 top.main.focus();
					FxMemo.copyDocFile(String(top.main.document.URL));
	//			}		
			}
		} else {
		}
	}

	// Mが押された
	if (presskey == 77) {
		if (altkey == true) {
			if (top.main != undefined) {
				var strTopic = document.hea.gotopic.options[document.hea.gotopic.selectedIndex].value;
				top.main.location.href = strTopic;
//				top.main.data.focus();
			}
		} else {
		}
	}

//	alert("presskey=" + presskey );
	
}

function keyPressTopic() {
	if (presskey == 13) {
		var strTopic = document.hea.gotopic.options[document.hea.gotopic.selectedIndex].value;
//		top.hide.location=strTopic;
		top.main.location.href = strTopic;
		top.main.data.focus();
	} else if (presskey == 9) {
		top.main.data.focus();
	}
}

var allHtmlFile;
var allHtmlFileCnt;
var HtmlFileCnt;

// 前のURLへ行く
function goToPrevious(){
	if (top.main.data != null && top.main.data.prev_html.value != "") {
		if (event.type == "click") {
			if (String(top.main.data.prev_html.value).indexOf("..") != -1) {
				top.main.location.href = String(top.main.data.prev_html.value).substr(1);
			} else {
				top.main.location.href = top.main.data.prev_html.value;
			}
		} else if (event.type == "keydown") {
//			top.main.location.href = top.main.data.prev_html.value;
			if (String(location.href).indexOf("fullheader") != -1) {
				if (String(top.main.data.prev_html.value).indexOf("..") != -1) {
//					alert("a=" + String(top.main.data.next_html.value).substr(1));
					top.main.location.href = String(top.main.data.prev_html.value).substr(1);
				} else {
//					alert("b=" + top.main.data.next_html.value);
					top.main.location.href = String(top.main.data.prev_html.value);
				}
			} else {
//				alert("c=" + top.main.data.next_html.value);
				top.main.location.href = top.main.data.prev_html.value;
			}
		} else {

		}
	}

//	if (top.main.data.prev_html.value != "") {
//		top.main.location.href = top.main.data.prev_html.value;
//	}
	/*
	allHtmlFile = top.hide.document.all.tags('A');
	allHtmlFileCnt = allHtmlFile.length -1;

	for (var i=0; i<=allHtmlFileCnt; i++){

		var HtmlFile;
		if (String(top.main.location).indexOf("#") != -1) {
			HtmlFile = String(top.main.location).substring(0,String(top.main.location).indexOf("#"))
		} else {
			HtmlFile = String(top.main.location);
		}

		if (String(allHtmlFile[i].href).indexOf(HtmlFile) != -1) {
			HtmlFileCnt = i;
			break;

		}
		HtmlFileCnt = -1;
	}

	HtmlFileCnt = HtmlFileCnt - 1;


	if (HtmlFileCnt < 0) {
		HtmlFileCnt = -1;
		if (String(top.main.location).indexOf(String(top.hide.location.href)) == -1) {
			top.main.location=top.hide.location;
		}
	} else {
		top.main.location=allHtmlFile[HtmlFileCnt].href;
	}
*/
}

// 次のURLへ行く
function goToNext(){

//	alert(location.href);
//	alert(event.y)
//	alert(event.fromElement);
	if (top.main.data != null && top.main.data.next_html.value != "") {
		if (event.type == "click") {
			if (String(top.main.data.next_html.value).indexOf("..") != -1) {
//				alert("a" + String(top.main.data.next_html.value).substr(1));
				top.main.location.href = String(top.main.data.next_html.value).substr(1);
			} else {
//				alert("b" + String(top.main.data.next_html.value));
				top.main.location.href = top.main.data.next_html.value;
			}
		} else if (event.type == "keydown") {
			if (String(location.href).indexOf("fullheader") != -1) {
				if (String(top.main.data.next_html.value).indexOf("..") != -1) {
//					alert("a=" + String(top.main.data.next_html.value).substr(1));
//alert("1:" + String(top.main.data.next_html.value).substr(1));
					top.main.location.href = String(top.main.data.next_html.value).substr(1);
				} else {
//					alert("b=" + top.main.data.next_html.value);
//alert("2:" + String(top.main.data.next_html.value).substr(1));
					top.main.location.href = String(top.main.data.next_html.value);
				}
			} else {
//				alert("c=" + top.main.data.next_html.value);
//alert("3:" + String(top.main.data.next_html.value).substr(1));
//alert("4:" + String(top.main.data.next_html.value));
//alert(location.href);
				if (String(location.href).indexOf("chap") != -1) {
//alert(String(top.main.data.next_html.value).substr(1));
					top.main.location.href = String(top.main.data.next_html.value).substr(1);
				} else {
					top.main.location.href = String(top.main.data.next_html.value);
				}
			}
		}
//alert(top.main.data.next_html.value + " " + top.main.location.href);

	}
/*
	allHtmlFile = top.hide.document.all.tags('A');
	allHtmlFileCnt = allHtmlFile.length -1;

	for (var i=0; i<= allHtmlFileCnt; i++){

		var HtmlFile;
		if (String(top.main.location).indexOf("#") != -1) {
			HtmlFile = String(top.main.location).substring(0,String(top.main.location).indexOf("#"))
		} else {
			HtmlFile = String(top.main.location);
		}
		
		if (String(allHtmlFile[i].href).indexOf(HtmlFile) != -1) {
			HtmlFileCnt = i;
			break;
		}
		HtmlFileCnt = -1;
	}

	HtmlFileCnt = HtmlFileCnt + 1;

	if (HtmlFileCnt > allHtmlFileCnt) {
		HtmlFileCnt = allHtmlFileCnt;
	} else {
		top.main.location=allHtmlFile[HtmlFileCnt].href;
	}
*/
}


function checkFocus() {

	var objCnt;

	if (top.main != undefined) {
		if (presskey == 9) {
	//		alert(presskey);
	//		var strTopic = document.hea.gotopic.options[document.hea.gotopic.selectedIndex].value;
	//		top.hide.location=strTopic;
	//		top.main.location.href = strTopic;
	//		top.main.focus();
//			alert("check");
			if (shiftkey == true) {
//				objCnt = top.main.document.all.tags("A").length-1;
//				alert(objCnt);
				if (nCntAnchor < 1) {
//					obj = top.main.document.all.tags("A")(0);
					obj = top.main.getElementsByTagName('A')(0);
					if (obj != undefined) {
						obj.focus();
					} else {
						top.main.focus();
					}
//				} else {
//					obj = top.main.document.all.tags("A")(0);
				}
			} else {
//				alert(top.main.document.all.tags("A").length);
				if (nCntAnchor > nAllAnchor-2) {
//					alert(obj);
//					obj = top.main.document.all.tags("A")(nAllAnchor-1);
					obj = document.getElementsByTagName('A')(nAllAnchor-1);
					if (obj != undefined) {
	//					alert("none");
						obj.focus();
					} else {
						top.main.focus();
					}
				}
			}
		
		}
	}

}

function memoFocus() {
	if (top.main != undefined) {
//		obj = top.main.document.all.item("Memo");
		obj = top.main.document.getElementById('Memo');
		obj.style.width=13;
		obj.style.height=14;
//		alert(obj);
	}
}

function memoBlur() {
	if (top.main != undefined) {
//		obj = top.main.document.all.item("Memo");
		obj = top.main.document.getElementById('Memo');
		obj.style.width=11;
		obj.style.height=12;
//		alert(obj);
	}
}

function topicFocus() {
	if (top.main != undefined) {
//		obj = top.main.document.all.item("Topic");
		obj = top.main.document.getElementById('Topic');
		obj.style.width=16;
		obj.style.height=14;
//		alert(obj);
	}
}

function topicBlur() {
	if (top.main != undefined) {
//		obj = top.main.document.all.item("Topic");
		obj = top.main.document.getElementById('Topic');
		obj.style.width=14;
		obj.style.height=12;
//		alert(obj);
	}
}

/*
function setFocus() {
	alert("setFocus");
	var obj = top.main.document.all.tags("A")(0);
	obj.focus();
}
*/



var nAllAnchor;
var nCntAnchor;
var timerID;
var obj;

function objFocus() {
	clearTimeout(timerID);
	obj.focus();
}

var array;

function getCountAnchor() {
	clearTimeout(timerID);

//		array = top.main.document.all.tags("A")
		array = top.main.document.getElementsByTagName('A');
//		alert(array(0));

	nAllAnchor = top.main.document.links.length;
//	alert("All=" + nAllAnchor);
	if (isNaN(nAllAnchor) != true) {
		nCntAnchor = -1;
//		obj = top.main.document.all.tags("A")(0);
		obj = top.main.document.getElementsByTagName('A')(0);
		if (obj != null) {
//			alert("a");
			timerID=setTimeout("objFocus()", 150);
//			obj.focus();
		}
	} else {
		top.main.body.focus();
	}

}

function countAnchor() {
	if (top.manual == undefined) {
		timerID=setTimeout("getCountAnchor()", 200);
	}
}

function setFocus() {
	nCntAnchor=0;
	if (top.main != undefined) {
		top.main.document.body.focus();
	}
}
