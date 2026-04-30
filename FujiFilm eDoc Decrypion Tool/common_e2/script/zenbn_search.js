// 検索データの部分表示閾値（文字数）
var PartialDisplayStrNum = 100;
// 部分表示のときの検索文字列の前後表示文字数
var BeforeAndAfterNum = 25;
// 最初にヒットしたもののみ表示
var OnlyFirstSearch = false;
// Solr検索のHighlight機能で検索結果表示
var UseSolrHighlightText = true;
// Solr検索をフレーズ検索として実行
var SolrPhraseSearch = true;
// Solr検索クエリー表示
var ShowSolrSearchQuery = false;
// 入力検索文字列をそのままSolrの検索条件へ指定
var SolrDirectCondition = false;

if(!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g,'');
	};
}

//
// 起動処理
//
window.onload = function() {
	initialize();
	searchMenu();

	var searchText = top.header.document.getElementById('txtzenbun').value;

	if (searchText) {
		var elmResultCount = document.getElementById('resultcount');
		var resultState = elmResultCount.parentNode;
		resultState.innerHTML = 'Searching...';
		resultState.setAttribute('id','resultState');

		loadAndSearchSolr(searchText, 'resultcount', 'resultol');

		var script = document.getElementById('zenbunidx');

		setTimeout(function() {
			//searchSolr(searchText, 'resultcount', 'resultol');
			if ('gSolrSearchUrl' in window) {
				return;
			}
//			alert("Solrサーバー接続なし");
			script.src = "zenbunidx/zenbun.idx.js";
		},100);

		onLoadScript(script, function() {
			setTimeout(function() {
				try {
				    selectZenbunIdxData(gZenbunIdx, searchText, 'resultcount', 'resultol');
				} catch(e) {
				    alert("[Error] " + e.message)
				}
			}, 500);
		});
	}
}

//
// 指定したスクリプトのロード完了後に指定処理実行
//
function onLoadScript(element, handler) {
	if ("onreadystatechange" in element) {	// IE用
		element.onreadystatechange = function (e) {
			if (element.readyState === "loaded" || element.readyState === "complete") {
				return handler(e);
			}
		};
	} else {	// Chrome,FireFox,EDGE用
	    element.onload = handler;
	}
}

//
// 全文検索用スクリプト
//
function selectZenbunIdxData(pZenbunIdx, pSearchText, pResultCountId, pResultAreaId) {
	if (!pZenbunIdx) {
		return ;
	}
	if (!pZenbunIdx.dataList) {
		return ;
	}
	if (pZenbunIdx.dataList.length == 0) {
		return ;
	}

	// 検索文字列変換
	var searchText = convertSearchText(pSearchText);

	// マッチパターンリスト取得
	var patterns = getMatchPatterns(searchText, pZenbunIdx.synonymList, false);

	// 検索結果HTMLの設定
	var iFoundCount = setResoltHtml(pZenbunIdx.dataList, patterns, pResultAreaId);

	// 検索結果件数の設定
	setState(pResultCountId, iFoundCount);
}

//
// 検索文字列の変換
//
function convertSearchText(pSearchText) {
	var searchText = pSearchText.trim();

	// 検索文字列の英数字を全角から半角に変換
	searchText = searchText.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 65248);
	});

	// Regex特殊記号エスケープ
	searchText = escapeRegexSymbol(searchText);

	// \&→&に、&→＆
	searchText = searchText.replace(/([^\\])&(.+)/g, '$1＆$2'); 
	searchText = searchText.replace(/\\&/g, '&'); 

	// HTML特殊文字変換
	searchText = convetHtmlSpecialChar(searchText);

	return searchText;
}

//
// 検索文字列のマッチパターン作成
//
function getMatchPatterns(searchText, synonymList, solr) {
	var synonymWords = null;

	// ワイルドカード指定の場合は、類義語検索は行わない。
	var wildcard = searchText.match(/\*/g) || searchText.match(/\?/g);

	if (!wildcard) {
		if (synonymList) {
			synonymWords = getSynonyms(searchText, synonymList); 
		}
	}

	// 類義語が設定されていなければ、指定検索文字のみ
	if (!synonymWords) {
		synonymWords = [];
		synonymWords.push(searchText);
	}

	// マッチパターンの事前作成
	var patterns = [];

	for (var wix = 0; wix < synonymWords.length; wix++) {
		var andptns = getAndMatchPatterns(synonymWords[wix]);

		if (andptns.length == 0) {
			var searchText = '(' + synonymWords[wix].trim() + ')';
			var pattern = searchText.replace(/\*/g,'.\*').replace(/\?/g,'.\?');
			rgexptn = new RegExp(pattern,'ig');
			var rptn = {};
			rptn.base = rgexptn;
			rptn.andp = null;
			patterns.push(rptn);
		} else {
			if (solr) {
				for (var i = 0; i < andptns.length; i++) {
					var rptn = {};
					rptn.base = andptns[i];
					rptn.andp = null;
					patterns.push(rptn);
				}
			} else {
				var rptn = {};
				rptn.base = andptns[0];
				rptn.andp = andptns[1];
				patterns.push(rptn);
			}
		}
	}

	return patterns;
}

//
// 検索文字列でAND条件指定時のマッチパターン取得
//
function getAndMatchPatterns(searchText) {
	
	var andptns = [];

	var andWord = searchText.split('＆');

	if (andWord.length > 1) {
		for (var i = 0; i < andWord.length; i++) {
			pattern = '(' + andWord[i].trim() + ')';
			andptns.push(new RegExp(pattern,'ig'))
		}
	}
	
	return andptns;
}

//
// 該当類義語の取得
//
function getSynonyms(pWord, pSynonymList) {
	for (i = 0; i < pSynonymList.length; i++) {
		var dataLines = pSynonymList[i];
		for (j = 0; j < dataLines.length; j++) {
			if (dataLines[j] == pWord) {
				return dataLines;
			}
		}
	}

	return null;
}

//
// 検索結果をHTML要素へ設定
//
function setResoltHtml(dataList, patterns, resultAreaId) {
	var partialDisplay = true;
	var olinnerhtml= '';
	var iFoundCount = 0;
	var listMax = dataList.length;

	for (var i = 0; i < listMax; i++) {
		var curdata = dataList[i];

		if (curdata.text) {
			var src = curdata.text;
			var matchstrings = '';
			var partialDisplay = (src.length > PartialDisplayStrNum);

			for (var wix = 0; wix < patterns.length; wix++) {
				var matchStringLine = getMatchSring(src, patterns[wix], partialDisplay);

				if (matchStringLine.length > 0) {
					matchstrings += matchStringLine;
				}
			}

			if (matchstrings.length > 0) {
				olinnerhtml += getHtmlResultLine(curdata.href, curdata.info, matchstrings);
				iFoundCount++;
			}
		}
	}

	if(iFoundCount > 0) {
		document.getElementById(resultAreaId).innerHTML = olinnerhtml;
	}

	return iFoundCount;
}

//
// 検索対象文字列から、検索パターンに該当する文字列と前後数文字を検索結果として取得
//
function getMatchSring(src, pattern, partialDisplay) {
	var matchstring = '';

	var rgexptn = pattern.base;
	rgexptn.lastIndex = 0;
	if (pattern.andp) {
		pattern.andp.lastIndex = 0;
	}

	if (partialDisplay) {
		// ヒットした文字列の前後数文字表示
		var result;
		var resultAnd;
		var andMatch = false;
		var andMatchList = [];

		while (result = rgexptn.exec(src)) {
			if (result[0].length == 0) {
				break;
			}

			if (pattern.andp) {
				while (resultAnd = pattern.andp.exec(src)) {
					if (resultAnd[0].length == 0) {
						break;
					}
					var andMatchString = getDispLine(src, pattern.andp, resultAnd[0]);
					andMatchList.push(andMatchString);
					andMatch = true;
				}

				if (!andMatch) {
					break;
				}
			}

			matchstring += getDispLine(src, rgexptn, result[0]);

			for (var i = 0; i < andMatchList.length; i++) {
				matchstring += andMatchList[i];
			}

			if (OnlyFirstSearch) {
				break;
			}
		}
	} else {
		var mresult = src.match(rgexptn);
		if (mresult) {
			if (pattern.andp) {
				var resultAnd = pattern.andp.exec(src);
				if (!resultAnd) {
					return matchstring;
				}
			}

			matchstring = src.replace(rgexptn,'<span class="match-word">$1</span>') + '<br />';

			if (pattern.andp) {
				matchstring += src.replace(pattern.andp,'<span class="match-word">$1</span>') + '<br />';
			}
		}
	}

	return matchstring;
}

//
// 表示用検索結果文字列を取得
//
function getDispLine(src, rgexptn, matchStr) {
	var beforeString = getBeforeString(src, rgexptn, matchStr);
	var afterString = getAfterString(src, rgexptn);

	return beforeString + '<span class="match-word">' + matchStr + '</span>' + afterString + '<br />';
}

//
// 一致文字列の前既定文字数を取得
//
function getBeforeString(src, rgexptn, mstr) {
	var ellipsis = '';
	var stix = rgexptn.lastIndex - mstr.length - BeforeAndAfterNum;

	if (stix < 0) {
		stix = 0;
	} else {
		ellipsis = '...';
	}

	var edix = rgexptn.lastIndex - mstr.length;
	return ellipsis + src.substring(stix, edix);
}

//
// 一致文字列の後既定文字数を取得
//
function getAfterString(src, rgexptn) {
	var ellipsis = '';
	var stix = rgexptn.lastIndex;
	var edix = rgexptn.lastIndex + BeforeAndAfterNum;

	if (edix >= src.length) {
		edix = src.length - 1;
	} else {
		ellipsis = '...'
	}

	return src.substring(stix , edix) + ellipsis;
}

//
// 検索結果のリンク、一致文字前後のHTMLを取得
//
function getHtmlResultLine(href, info, content) {
	return '<li><a href="' + href + '">' + info + '</a>\n'
		 + '<br>' + content
		 + '</li>\n'
	;
}

//
// 検索結果と検索件数の設定
//
function setState(pResultCountId, iFoundCount, pAddMsg) {
	var addMsg = '';
	if (pAddMsg) {
		addMsg = '<br />' + pAddMsg
	}

	var resultState = document.getElementById('resultState');
	resultState.innerHTML = 'Target Count：<span id="resultcount">0</span>Counts ' + addMsg;

	if(iFoundCount > 0) {
		var foundCount = String(iFoundCount).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
		document.getElementById(pResultCountId).innerText = foundCount
	} else {
		document.getElementById(pResultCountId).innerText = '0';
	}
}

//
// HTML特殊文字変換
//
var convetHtmlSpecialChar = (function() {
	var spChars = {
		'<': '&lt;',
		'>': '&gt;',
		'&': '&amp;',
		'"': '&quot;',
		'\'': '&#39;'
	};
	return function(s) {
		return s.replace(/[<>'&"]/g, function(c) {
			return spChars[c];
		});
	};
})();

//
// Regex特殊記号エスケープ
//
var escapeRegexSymbol = (function() {
	var symbols = {
		'(': '\\(',
		')': '\\)',
		'[': '\\[',
		']': '\\]',
		'^': '\\^',
		'$': '\\$',
//		'*': '\\*',
//		'?': '\\?',
		'+': '\\+',
		'.': '\\.'
	};
	return function(s) {
		return s.replace(/[\(\)\[\]\^\$\+\.]/g, function(c) {
			return symbols[c];
		});
	};
})();

//
// Solr検索 検索スクリプトロードとクエリー発行
//
function loadAndSearchSolr(pSearchText, pResultCountId, pResultAreaId) {
	var header = document.getElementsByTagName('head');
	var solrScript = document.createElement('script');
	header[0].appendChild(solrScript);
	solrScript.src = "zenbunidx/solr.js";

	onLoadScript(solrScript, function() {

		setTimeout(function() {
			try {
				searchSolr(pSearchText, pResultCountId, pResultAreaId);
			    return true;
			} catch(e) {
			    return false;
			}

		}, 100);

	});

	return false;
}

//
// Solr検索　検索クエリー発行と結果設定
//
function searchSolr(pSearchText, pResultCountId, pResultAreaId) {

	var ReadyStateComplete = 4;
	var StatusOK = 200;
	
	var req = new XMLHttpRequest();

	req.onreadystatechange = function() {
		var resultCount = document.getElementById(pResultCountId);
		var resultArea = document.getElementById(pResultAreaId);

		if (req.readyState == ReadyStateComplete) {
			if (req.status == StatusOK) {
				var data = JSON.parse(req.responseText);
				var numFound = data.response.numFound;
				var docsLen = data.response.docs.length;

				// 検索文字列変換
				var searchText = convertSearchText(pSearchText);

				// マッチパターンリスト取得
				var patterns = getMatchPatterns(searchText, gSynonym.synonymList, true);

				// 検索結果HTMLの設定
				var iFoundCount = setResultHtmlSolr(data, patterns, pResultAreaId);

				// 検索結果件数の設定
				if (ShowSolrSearchQuery) {
					setState(pResultCountId, iFoundCount, url);
				} else {
					setState(pResultCountId, iFoundCount);
				}
			} else {
				alert("SolrAccess Error (" + req.status + ":" + req.statusText + ")");
			}
		}
	}

	// 検索文字列変換
	var searchText = convertSearchText(pSearchText);
	searchText = searchText.replace(/&amp;/,'\\&');//for test
	var solrCond = makeSolrCondition(searchText, gSynonym.synonymList);
	var encSearchText = ' AND (' + solrCond + ')';
	var url = gSolrSearchUrl;

	if (SolrDirectCondition) {
		url += ' AND (text:' + encodeURIComponent(pSearchText) + ')';
	} else {
		url += encSearchText
	}
	req.open('GET', url, true);
	req.send(null);
}

//
// 検索文字列からSolrの検索条件を作成
//
function makeSolrCondition(pSearchText, synonymList) {

	var cond = '';
	var searchs = pSearchText.split('|');

	if (searchs.length > 1) {
		for (var i = 0; i < searchs.length; i++) {
			if (searchs[i].length > 0) {
				if (cond.length > 0) {
					cond += ' OR ';
				}
				cond += getSolrCond(searchs[i]);
			}
		}
		return cond;
	} 

	searchs = pSearchText.split('＆');

	if (searchs.length > 1) {
		for (var i = 0; i < searchs.length; i++) {
			if (searchs[i].length > 0) {
				if (cond.length > 0) {
					cond += ' AND ';
				}
				cond += getSolrCond(searchs[i]);
			}
		}
		return cond;
	}

	var searchWords = null;

	// ワイルドカード指定の場合は、類義語検索は行わない。
	var wildcard = pSearchText.match(/\*/g) || pSearchText.match(/\?/g);

	if (!wildcard) {
		if (synonymList) {
			searchWords = getSynonyms(pSearchText, synonymList); 
		}
	}

	if (!searchWords) {
		searchWords = [];
		searchWords.push(pSearchText);
	}

	for (var i = 0; i < searchWords.length; i++) {
		if (searchWords[i].length > 0) {
			if (cond.length > 0) {
				cond += ' OR ';
			}
			cond += getSolrCond(searchWords[i]);
		}
	}

	return cond;
}

//
// Solr検索条件の取得
//
function getSolrCond(condText) {
	var rSolrCond = '';
	var cond = condText.trim();

	if (cond.length > 0) {
		if (SolrPhraseSearch) {
			rSolrCond = 'text:\"' + encodeURIComponent(cond) + '\"';
		} else {
			rSolrCond = 'text:' + encodeURIComponent(cond);
		}
	}

	return rSolrCond;
}

//
// 検索結果をHTML要素へ設定(Solr検索用)
//
function setResultHtmlSolr(data, patterns, resultAreaId) {
	var dataList = data.response.docs;

	var partialDisplay = true;
	var olinnerhtml= '';
	var iFoundCount = 0;
	var listMax = dataList.length;

	for (var i = 0; i < listMax; i++) {
		var curdata = dataList[i];

		if (curdata.text) {
			var matchstrings = '';
			var partialDisplay = (curdata.text.length > PartialDisplayStrNum);

			if (UseSolrHighlightText) {
				matchstrings = getHighlightText(data, curdata.id);
			} else {
				for (var wix = 0; wix < patterns.length; wix++) {
					var matchStringLine = getMatchSring(curdata.text, patterns[wix], partialDisplay);

					if (matchStringLine.length > 0) {
						matchstrings += matchStringLine;
					}
				}
			}

			if (matchstrings.length > 0) {
				olinnerhtml += getHtmlResultLine(curdata.href, curdata.info, matchstrings);
				iFoundCount++;
			}
		}
	}

	if(iFoundCount > 0) {
		document.getElementById(resultAreaId).innerHTML = olinnerhtml;
	}

	return iFoundCount;
}

//
// Solr検索結果ハイライトテキスト取得
//
function getHighlightText(data, id) {
	var hlText = '';

	if (data.highlighting) {
		var texts = data.highlighting[id].text;

		for (var j = 0; j < texts.length; j++) {
			hlText += texts[j];
		}

		hlText = hlText.replace(/<em>/g,'<span class="match-word">');
		hlText = hlText.replace(/<\/em>/g,'</span>');
	}

	return hlText;
}
