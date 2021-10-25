//Todo redo tokenize to handle no spaces e.g. pusher{}
function _tokenize(htmlIn) {
	var tokens = [];
	var curtoken = "";
	var pushfunc = function () {
		if (curtoken.length > 0) {
			tokens.push(curtoken);
			curtoken = ""
		}
	};
	for (var ci = 0; ci < htmlIn.length; ci++) {
		var ch = htmlIn[ci];
		if (/[\s]/.test(ch)) {
			pushfunc();
			continue;
		}
		if (/[\.#]/.test(ch)) {
			pushfunc();
		}
		if (ch == '"') {
			pushfunc();
			var all = htmlIn.slice(ci + 1);
			var dex = all.search('[^\\\\]"');
			if (dex < 0) {
				throw new Error('No closing \'"\' found');
			}
			var z = all.slice(0, dex + 1);
			curtoken = '"' + z;
			ci += curtoken.length + 1;
			pushfunc();
		}
		else if (ch == '[') {
			pushfunc();
			var all = htmlIn.slice(ci + 1);
			var dex = all.indexOf(']');
			if (dex < 0) {
				throw new Error('No closing ] found');
			}
			var z = all.slice(0, dex);
			curtoken = '[' + z;
			ci += curtoken.length + 1;
			pushfunc();
		}
		else if (ch == '/' && htmlIn[ci + 1] == '/') {
			pushfunc();
			var all = htmlIn.slice(ci + 2);
			var dex = all.indexOf('\n');
			ci += dex + 2;
		}
		else if (ch == '{' || ch == '}' || ch == "=") {
			pushfunc();
			curtoken = ch;
			pushfunc();
		}
		else {
			curtoken += ch;
		}
	}
	pushfunc();
	return tokens;
}

function _parse(tokens, index, level) {
	var outhtml = "";
	var ci = index;
	var curnode = {
		"tag": "div",
		"id": null,
		"attr": {},
		"classes": [],
		"style": null
	};

	while (ci < tokens.length) {
		if (tokens[ci].startsWith('"')) {
			outhtml += tokens[ci].slice(1);
			ci++;
		}
		else if (tokens[ci].startsWith('#')) {
			curnode.id = tokens[ci].slice(1);
			ci++;
		}
		else if (tokens[ci].startsWith('[')) {
			curnode.style = tokens[ci].slice(1);
			ci++;
		}
		else if (tokens[ci].startsWith('.')) {
			curnode.classes.push(tokens[ci].slice(1));
			ci += 1;
		}
		else if (tokens[ci + 1] == '=') {
			k = tokens[ci]
			v = tokens[ci + 2]
			ci += 3;
			curnode.attr[k] = v;
		}
		else if (/[\w\d]+/.test(tokens[ci])) {
			curnode.tag = tokens[ci];
			ci++;
		}
		else if (tokens[ci] == '{') {

			outhtml += '\t'.repeat(level) + '<' + curnode.tag;
			if (curnode.classes.length > 0) {
				outhtml += ' class="' + curnode.classes.join(' ') + '" ';
			}
			if (curnode.style) {
				outhtml += ' style="' + curnode.style + '" ';
			}
			for (const [key, value] of Object.entries(curnode.attr)) {
				outhtml += ` ${key}="${value}"`;
			}
			if (curnode.id != null) {
				outhtml += ` id="${curnode.id}"`;
			}

			outhtml += '>\n';
			internalresult = _parse(tokens, ci + 1, level + 1);
			outhtml += internalresult[0];
			ci = internalresult[1];
			outhtml += '\t'.repeat(level) + '</' + curnode.tag + '>\n';
			curnode = {
				"tag": "div",
				"id": null,
				"attr": {},
				"classes": [],
				"style": null
			}; //reset
		}
		else if (tokens[ci] == '}') {
			ci += 1;
			break;
		}
		else {
			throw new Error("Unrecognized token" + tokens[ci]);
		}
	}
	return [outhtml, ci];
}

function divify(oldHtml) {
	var tk = _tokenize(oldHtml);
	var rs = _parse(tk, 0, 0);
	return rs[0];
}


function undivify(allnodes, recurrance_increment = '\t', recurrance_str = '\n') {
	var outstr = "";
	for (e in allnodes) {
		switch (e.nodeType) {
			case Node.TEXT_NODE:
				outstr += recurrance_str + '"' + e.nodeValue + '"';
				break;
			case Node.COMMENT_NODE:
				outstr += recurrance_str + "//" + e.nodeValue + "\n";
				break;
			case Node.ELEMENT_NODE:
				outstr += recurrance_str + e.classList.value;
				if (e.hasAttributes()) {
					var attrs = e.attributes;
					for (var i = 0; i < attrs.length; i++) {
						if (attrs[i].name == "style") {
							outstr += '[' + attrs[i].value + '] ';
						}
						else {
							outstr += attrs[i].name + '="' + attrs[i].value + '" ';
						}
					}
				}
				if (e.nodeName.toLowerCase() != 'div') {
					outstr += '^' + e.nodeName.toLowerCase() + ' ';
				}
				outstr += '{';
				if (e.hasChildNodes()) {
					var children = e.childNodes;
					outstr += undivify(children, recurrance_str + recurrance_increment, recurrance_increment);
				}
				outstr += recurrance_str + '}';
				break;
		};
	}
}


function _divifyAll() {
	var elements = document.querySelectorAll('.divified');
	elements.forEach((element) => {
		element.innerHTML = divify(element.innerHTML);
	});

}
document.addEventListener('DOMContentLoaded', (event) => {
	_divifyAll();
});
