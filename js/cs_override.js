nav = new SceneNavigator(["startup"]);
stats = {};
isHeadless = true;
var scope = window.opener ? window.opener.parent.window : parent.window;
var thisProject = scope.cside.getActiveProject();
//var scope = parent.window;
window.allScenes = scope.cside.allScenes;

Scene.prototype.lineMsg = function lineMsg() {
	return "line " + (this.lineNum + 1) + " of " + stats.sceneName + ": ";
}

function findScene(sceneName) {
	var projectSceneList = thisProject.getScenes(); //if pop-out window
	for (var i = 0; i < projectSceneList.length; i++) {
		if (projectSceneList[i].getName() === sceneName) {
			//found it, return the data model:
			return projectSceneList[i];
		}
	}
	//we didn't find it
	return false;
}

Scene.prototype.script = function() {
    Scene.validCommands["script"] = false;
}

/* ERROR HANDLING (FOR ISSUES) */
window.onerror = function(msg, file, line, stack) {
    var e = {};
    e.message = msg;
    if (msg) {
        //window.onerror(e.message, e.fileName, e.lineNumber, e.stack); avoid pop-ups if we can
        var scene = findScene(stats.sceneName);
        e.message.match(/line [0-9]+/) ? e.lineNumber = parseInt(e.message.match(/line ([0-9]+)/)[1]) : e.lineNumber = "undefined"; //attempt to source a line number (!e.lineNumber && e.message.match(/[0-9]+/))
        if (scene) {
            thisProject.logIssue(e, scene);
        }
        else {
            //the scene isn't open - so open it first
            scope.cside.openScene(thisProject.getPath() + stats.sceneName + '.txt', function(err, scene) {
                if (err) {
					thisProject.logIssue(e);
                }
                else {
                    thisProject.logIssue(e, scene);
                }
            });
        }
    }
}

//make image's sourced from the project directory
function printImage(source, alignment) {
  var img = document.createElement("img");
  img.src = source.match("data:image") ? source : "file://" + thisProject.getPath() + source; //interal image, don't add directory
  setClass(img, "align"+alignment);
  document.getElementById("text").appendChild(img);
}

//make link's target _blank
function printLink(target, href, anchorText, onclick) {
  if (!target) target = document.getElementById('text');
  var link = document.createElement("a");
  link.setAttribute("href", href);
  link.setAttribute("target", "_blank");
  link.appendChild(document.createTextNode(anchorText));
  if (onclick) {
    if (link.addEventListener) {
      link.addEventListener("click", onclick, true);
    } else {
      link.onclick = onclick;
    }
  }
  target.appendChild(link);
  target.appendChild(document.createTextNode(" "));
}

//make sound sourced from the project directory
Scene.prototype.sound = function sound(source) {
	source = "file://" + thisProject.path() + source;
    if (typeof playSound == "function") playSound(source);
    if (this.verifyImage) this.verifyImage(source);
};

//prevent links from opening *inside* desktop version
if (scope.cside.getPlatform() != 'web-dropbox') {
	setTimeout(function() {
	 	window.$('body').on('click', 'a', function(e) {
			e.preventDefault();
			if ($(this).hasClass('alertify-button')) return false;
   alert("fired");
			scope.gui.Shell.openExternal(this.href);
			return false;
		});
	}, 1000); //needs a timeout or it seems to fire before the body is created.
}

//inject buttons:
$(document).ready(function() {
	if (scope === window.parent) {
		function moveButtonsInline() {
			var header = document.getElementById("header");
			var tags = header.getElementsByTagName("p");
			return tags[1];
		}
		var button = document.createElement("button");
		button.innerHTML = "Popout";
		button.setAttribute("title", "Pop out window");
		button.setAttribute("class", "spacedLink");
		button.onclick = function popOutWindow() {
			if (scope.cside.getPlatform() != 'web-dropbox') { //focus
        if (thisProject.window) {
            thisProject.window.focus();
        }
        else { //create new
          parent.gui.Window.open('run_index.html?persistence=CSIDE', {focus: true, width: 500, height: 500, title: ""}, function(new_win) {
            thisProject.window = new_win;
            // don't allow the popout window to overwrite the persistent store (allows popout testing of multiple choices etc)
            new_win.on("loaded", function() {
              new_win.window.storeName = null;
            });
            new_win.on("closed", function() {
              thisProject.window.leaveFullscreen();
              thisProject.window.hide();
              thisProject.window.close(true);
              thisProject.window = null;
            });
            });
            //window.location = "about:blank";
        }
			}
			else {
				thisProject.window = window.open("run_index.html?persistence=CSIDE", thisProject.getName(), "height=500,width=500,scrollbars=1");
                //window.location = "about:blank";
			}
		};
		var p = moveButtonsInline();
		p.appendChild(button);
	}
});
