var scope = window.opener ? window.opener.parent : parent.window;
var thisProject = scope.cside.getActiveProject();

Scene.prototype.verifyImage = function webVerifyImage(fileName) {
  var xhr = new XMLHttpRequest();
  var url = thisProject.getPath() + "/images/" + fileName;
  xhr.open("GET", url, false);
  try {
    xhr.send();
  } catch (e) {
    throw new Error(this.lineMsg() + "File does not exist: " + fileName);
  }
  if (xhr.status && xhr.status != 200) {
    throw new Error(this.lineMsg() + "File does not exist: " + fileName);
  }
}

function loadScenes(sceneNum) {
  var fileName = knownScenes[sceneNum];
  var sceneName = fileName.replace(/.txt$/, "");
  var url = thisProject.getPath() + fileName;
  var skip = false;
  var loadFailed = false;
  scope.cside.readFile(url, function(err, data) {
	  if (err)
		loadFailed = true;
	  checkScene(data);
  });
  function checkScene(sceneData) {
	  if (loadFailed) {
		if (/^choicescript_(stats|upgrade)$/.test(sceneName)) {
		  skip = true;
		} else {
		  doneLoading();
		  console.log("QUICKTEST FAILED");
		  console.log("ERROR: couldn't open " + url);
		  success = false;
		  return;
		}
	  }
	  if (!skip) {
		function parseSceneList(lines, lineNum) {
		  var nextIndent = null;
		  var scenes = [];
		  var purchases = {};
		  var line;
		  while(typeof (line = lines[++lineNum]) != "undefined") {
			  if (!line.trim()) continue;

			  var indent = /^(\s*)/.exec(line)[1].length;
			  if (nextIndent === null || nextIndent === undefined) {
				  // initialize nextIndent with whatever indentation the line turns out to be
				  // ...unless it's not indented at all
				  if (indent === 0) throw new Error("invalid scene_list indent, expected at least one row");
				  this.indent = nextIndent = indent;
			  }
			  if (indent === 0) break;
			  if (indent != this.indent) {
				  // all scenes are supposed to be at the same indentation level
				  throw new Error("invalid scene_list indent, expected "+this.indent+", was " + indent);
			  }

			  line = line.trim();
			  var purchaseMatch = /^\$(\w*)\s+(.*)/.exec(line);
			  if (purchaseMatch) {
				line = purchaseMatch[2];
				var product = purchaseMatch[1].trim() || "adfree";
				purchases[line] = product;
			  }
			  if (!scenes.length && "startup" != line) scenes.push("startup");
			  scenes.push(line);
		  }
		  return {scenes:scenes, purchases:purchases, lineNum:lineNum-1};
		}
		try {
		  var sceneLines = sceneData;
		  for (var j = 0; j < sceneLines.length; j++) {
			var line = sceneLines[j];
			var words;
			var result = /^\s*\*(\w+)(.*)/.exec(line);
			if (!result) continue;
			var command = result[1].toLowerCase();
			var data = trim(result[2]);
			if (command == "goto_scene" || command == "gosub_scene") {
			  if (data === null) data = "";
			  if (/[\[\{]/.test(data)) {
				// print warning?
			  } else {
				words = data.split(/ /);
				if (words[0] !== "") {
				  addFile(words[0]+".txt");
				}
				if (words.length > 1) {
				  if (!gotoSceneLabels[words[0]]) gotoSceneLabels[words[0]] = [];
				  gotoSceneLabels[words[0]].push({origin:sceneName, originLine:j, label:words[1]});
				}
			  }
			} else if (command == "save_game") {
			  if (data !== null) addFile(data+".txt");
			} else if (command == "scene_list" && sceneNum === 0) {
			  var sceneList = parseSceneList(sceneLines, j);
			  j = sceneList.lineNum;
			  for (var k = 0; k < sceneList.scenes.length; k++) {
				addFile(sceneList.scenes[k]+".txt");
			  }
			}
		  }
		} catch (e) {
		  console.log("Error parsing "+sceneName+" line "+(j+1)+ "; we'll flag the error in detail later\n");
		  console.log(e);
		}
	  }

	  if (++sceneNum < knownScenes.length) return setTimeout(function(){loadScenes(sceneNum)}, 0);

	  testScene(0);
  }
}


function testScene(sceneNum) {
  var fileName = knownScenes[sceneNum];
  var sceneName = fileName.replace(/.txt$/, "");
  var url = thisProject.getPath() + fileName;
  var skip = false;
  var loadFailed = false;
	scope.cside.readFile(url, function(err, data) {
		if (err)
			loadFailed = true;
		test(data);
	});

	function test(sceneData) {
		 if (loadFailed) {
			if (/^choicescript_(stats|upgrade)$/.test(sceneName)) {
			  skip = true;
			} else {
			  doneLoading();
			  console.log("QUICKTEST FAILED");
			  console.log("ERROR: couldn't open " + url);
			  success = false;
			  return;
			}
		  }
		  if (!skip) {
			console.log(sceneName);
			try {
			  testForInvalidCharacters(sceneData);
			  var uncovered = autotester(sceneData, nav, sceneName, gotoSceneLabels[sceneName])[1];
			  if (uncovered) {
				uncoveredScenes.push({name:sceneName, lines:uncovered});
			  }
			  if (sceneNum === 0) {
				titleIncluded = /\*title /m.test(sceneData);
				authorIncluded = /^\*author /m.test(sceneData);
			  }
			} catch (x) {
			  console.log("QUICKTEST FAILED");
				console.log(x);
				console.error(x.stack);
				success = false;
				return;
			}
		  }

		  if (++sceneNum < knownScenes.length) return setTimeout(function(){testScene(sceneNum)}, 0);

		  if (success) {
			var allLinesTested = true;
			for (var i = 0; i < uncoveredScenes.length; i++) {
			  allLinesTested = false;
			  var uncoveredScene = uncoveredScenes[i];
			  for (var j = 0; j < uncoveredScene.lines.length; j++) {
				console.log("UNTESTED " + uncoveredScene.name + " " + uncoveredScene.lines[j]);
			  };
			}
			(function() {
			  if (nav.achievementList && nav.achievementList.length) {
				for (var i = 0; i < nav.achievementList.length; i++) {
				  var name = nav.achievementList[i];
				  if (!nav.achieved[name]) {
					console.log("UNUSED achievement: " + name);
				  }
				}
			  }
			})();
			if (!allLinesTested) console.log("SOME LINES UNTESTED");
			if (!titleIncluded) console.log("MISSING *TITLE COMMAND");
			if (!authorIncluded) console.log("MISSING *AUTHOR COMMAND");
			console.log("QUICKTEST PASSED");
		  }
	}
}

var scope = window.opener ? window.opener.parent : parent.window;
var thisProject = scope.cside.getActiveProject();

/* 
function isIssue(msg) {
  if (typeof msg != "string") {
    console.log(typeof msg);
	console.log(JSON.stringify(msg));
    return false;
  }
  if (msg.match(/^(MISSING|UNUSED|UNTESTED|Error:)/i)) {
	return true;
  }
  return false;
}

console.log = function() {
  var msg = arguments[0];
  printBody(msg);
  var br = document.createElement("br");
  document.body.appendChild(br);
  br.scrollIntoView();

  if (isIssue(msg)) {
	thisProject.logIssue({message: msg});
  }

  oldLog.apply(this, arguments);
}*/
