	function writeCookie(key, value, days) {
	     var str = key + "=" + escape(value) + ";";         // 書き出す値１ : key=value
	     if (days != 0) {                                                 /* 日数 0 の時は省略 */
	          var dt = new Date();                                   // 現在の日時
	          dt.setDate(dt.getDate() + days);                   // days日後の日時
	          str += "expires=" + dt.toGMTString() + ";"; // 書き出す値２ : 有効期限
	     }
	     document.cookie = str;                                   // Cookie に書き出し
	}
	
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