//==============================================================

// faq.js V01L10

// システム名(FAQシステム) 

//==============================================================

// Contents  : 検索機能部分共通で使用するJavaScriptです

// Note      : 

// History   : 2007/6/25 FAQ.js V01L10 初版

//==============================================================

	

//-------- フォームデータの受け渡し先 -------------------

var sendData = "/faq/servlet/FAQControlServlet";



//==============================================================

// Contents  : 検索ボタンが押下された時に入力項目チェックを行い

//             エラーが無ければ、サーブレットに制御を受け渡す。

// Parameter : データ受け渡し用フォーム( kensakuhidden )

// Return    : なし

// Note      :

// History   : 2007/6/25 checkSearch V01L10 初版

//==============================================================

function checkSearch() {

  var f  = document.forms["kensakuform"];

  var o  = document.forms["kensakuhidden"];



  // 次画面ID

  var nextWindow = "FAQResult";



  // 入力チェック

  var s    = f.keyword.value;

  var temp = f.keyword.value;

  var i = 0;

  for(i=0; i<s.length; i++) {

	if ((temp.substring(0, 1) == " ") || (temp.substring(0, 1) == "　")) {

		temp = s.substring(i + 1, s.length );

	}else{

		break;

	}

  }



  if ( i == s.length )  {

     alert("検索語句を入力してください。");

     f.keyword.focus();

     return;

  }



  // 字数チェック

  var strString;

/*

  strString = strTrim(f.fcode.value);

  if (strString.length == 1) {

  	document.getElementById("top").innerHTML = "<div style=\"color:red;\">入力された条件では検索できません。</div>";

	return;

  }

  strString = strTrim(f.errmsg.value);

  if (strString.length == 1) {

  	document.getElementById("top").innerHTML = "<div style=\"color:red;\">入力された条件では検索できません。</div>";

	return;

  }

*/



  strString = strTrim(f.keyword.value);

  if (strString.length == 1) {

  	document.getElementById("top").innerHTML = "<div style=\"color:red;\">入力された条件では検索できません。</div>";

	return;

  }



  // キーワード入力

/*

  o.fcode.value = strTrim( f.fcode.value );

  o.errmsg.value = strTrim( f.errmsg.value );

*/

  o.keyword.value = strTrim( f.keyword.value );



  // 次画面ＩＤをセット

  o.next_window.value = nextWindow;



  // 検索フラグ

  o.search_flg.value = 1;





  // フォームデータの受け渡し先を指定

  o.action = o.vdpath.value + sendData;





  // フォームを送信

  o.submit();



}





//==============================================================

// Contents  : ページリンクをクリックした時にサーブレットに

//             制御を受け渡す。

// Parameter : データ受け渡し用フォーム( frm_page )

// Return    : なし

// Note      :

// History   : 2007/6/25 pageClick V01L10 初版

//==============================================================

function pageClick(page_no) {

  var f = document.forms["frm_page"];

  

  // 次画面ID

  var nextWindow = "FAQResult";

  // ページ番号をセット 

  f.page.value = page_no;

  // 次画面ＩＤをセット

  f.next_window.value = nextWindow;

  

  // フォームデータの受け渡し先を指定

  f.action = f.vdpath.value + sendData;

  // フォームを送信

  f.submit();

}





//==============================================================

// Contents  : 絞り込みキーワードをクリックした時にサーブレットに

//             制御を受け渡す。

// Parameter : データ受け渡し用フォーム( frm_page )

// Return    : なし

// Note      :

// History   : 2007/6/25 pageClick V01L10 初版

//==============================================================

function keyClick(key) {

  var f = document.forms["frm_page"];

  

  // 次画面ID

  var nextWindow = "FAQResult";



  // 検索フラグ

  f.search_flg.value = 1;

  // キーワード入力

  f.query.value = f.prequery.value + " " + key;



  // 次画面ＩＤをセット

  f.next_window.value = nextWindow;

  

  // フォームデータの受け渡し先を指定

  f.action = f.vdpath.value + sendData;

  // フォームを送信

  f.submit();

}





//==============================================================

// Contents  : 渡された文字列の左空白文字を切除する

// Parameter : 渡される文字列（Str）

// Return    :

// Note      :

// History   : 2007/6/25 strTrim V01L10 初版

//==============================================================

function strTrim(str) 

{ 

  var temp = str;

  var i=0;

  for(i=0; i<str.length; i++) {

	if ((temp.substring(0, 1) == " ") || (temp.substring(0, 1) == "　")) {

		temp = str.substring(i + 1, str.length );

 	}else{

		break;

 	}

  }

  return temp; 

} 

