// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

/**
 * Link to the project's GitHub page:
 * https://github.com/duralog/CodeMirror
 */

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineMode('choicescript', function(conf, parserConf){
    var tokenBase = function(stream, state) {
      var next_rule = state.next || "start";
      if (next_rule) {
        state.next = state.next;
        var nr = Rules[next_rule];
        if (nr.splice) {
          for (var i$ = 0; i$ < nr.length; ++i$) {
            var r = nr[i$], m;
            if (r.regex && (m = stream.match(r.regex))) {
              state.next = r.next || state.next;
              return r.token;
            }
          }
          stream.next();
          return 'null';
        }
        if (stream.match(r = Rules[next_rule])) {
          if (r.regex && stream.match(r.regex)) {
            state.next = r.next;
            return r.token;
          } else {
            stream.next();
            return 'null';
          }
        }
      }
      stream.next();
      return 'error';
    };
    var external = {
      startState: function(){
        return {
          next: 'start',
          lastToken: null
        };
      },
      token: function(stream, state){
        while (stream.pos == stream.start)
          var style = tokenBase(stream, state);
		//### CSIDE - highlight bad spelling hook ###
		if (style === 'word' ) {
			cside.spellCheck(stream.current()) ? style = 'null' : style = "spell-error";
		}
		//### END - highlight bad spelling hook ###
        state.lastToken = {
          style: style,
          indent: stream.indentation(),
          content: stream.current()
        };
        return style.replace(/\./g, ' ');
      },
      indent: function(state){
        console.log(state);
        if (typeof state.lastToken == 'undefined' || state.lastToken == null) { return 0; }
        var indentation = state.lastToken.indent || 0;
        if (state.lastToken.content.match(indentCommands) || state.lastToken.content.match(/^#.*/)) {
          indentation += conf.indentUnit;
        }
		else if (state.lastToken.content.match(dedentCommands)) {
		  indentation -= conf.indentUnit;
		}
        return indentation;
      }
    };
    return external;
  });

function commandRegexp(words) {
	return new RegExp("\\*(" + words.join('|') + ")( [^ ].*)?$");
}

var commonkeywords = ['/^\*label /'];
var commonCommands =["abort", "achievement", "achieve", "advertisement", "allow_reuse", "author", "bug", "check_achievements",
					"check_purchase", "check_registration", "choice", "create", "delay_break", "delay_ending",
					"delete", "disable_reuse", "elseif", "elsif", "else", "end_trial", "ending", "fake_choice", "finish",
					"gosub_scene", "gosub", "goto_random_scene", "goto_scene", "gotoref", "goto", "hide_reuse", "if", "image",
					"input_number", "input_text", "line_break", "link_button", "link", "login", "looplimit", "more_games",
					"page_break", "print", "purchase", "rand", "redirect_scene", "reset", "restart", "restore_game", "restore_purchases", "return",
					"save_game", "selectable_if",  "scene_list", "script", "setref", "set", "share_this_game", "show_password", "sound", "stat_chart",
					"subscribe", "temp", "title"];
var jumpCommands = ["gosub_scene", "gosub", "goto_random_scene", "goto_scene", "gotoref", "goto", "redirect_scene", "return"];
var indentCommands = ["choice", "if", "scene_list", "elseif", "else", "elsif", "fake_choice", "stat_chart"];
var dedentCommands = ["finish", "goto_scene", "goto", "ending", "redirect_scene"];
var csPlusCommands = ["create_array", "loop_while", "loop_for"];

var builtins = commandRegexp(commonCommands);
indentCommands = commandRegexp(indentCommands);
dedentCommands = commandRegexp(dedentCommands);
jumpCommands = commandRegexp(jumpCommands);
csPlusCommands = commandRegexp(csPlusCommands);

  var stringfill = {
    token: 'string',
    regex: '.+'
  };
  var Rules = {
    start: [
      {
        token: 'variable',
        regex: '\\$\\{.+(\\[\w+\\])*\\}$'//'\\$!{0,2}\\{[\\w\\{\\}\\+\\-&\\*/\\s0-9#]+(\\[[\\w0-9]+\\])*\\}' //
      },
      {
        token: 'comment',
        regex: '\\*comment .*'
      }, {
        token: 'keyword',
        regex: '\\*label .*'
      }, {
		token: 'keyword',
		regex: jumpCommands
	  }, {
		token: 'operator',
		regex: '#.*'
	  }, {
        token: 'builtin',
        regex: builtins
      }, {
        token: 'operator',
        regex: '#'
	  }, {
		token: 'word',
		regex: '\\b(\\w+\'\\w+|\\w+\'?)\\b'
	  }
    ]
  };
  for (var idx in Rules) {
    var r = Rules[idx];
    if (r.splice) {
      for (var i = 0, len = r.length; i < len; ++i) {
        var rr = r[i];
        if (typeof rr.regex === 'string') {
          Rules[idx][i].regex = new RegExp('^' + rr.regex);
        }
      }
    } else if (typeof rr.regex === 'string') {
      Rules[idx].regex = new RegExp('^' + r.regex);
    }
  }

  CodeMirror.defineMIME('text/x-choicescript', 'choicescript');

});
