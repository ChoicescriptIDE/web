(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

    CodeMirror.defineMode("choicescript", function(conf, parserConf) {

        var cmdRegExp = function(words) {
        	return new RegExp("^\\s*\\*(" + words.join('|') + ")(?: .*)?$");
        }
        var commonCommands =["abort", "achievement", "achieve", "advertisement", "allow_reuse", "author", "bug", "check_achievements",
        					"check_purchase", "check_registration", "choice", "create", "delay_break", "delay_ending",
        					"delete", "disable_reuse", "elseif", "elsif", "else", "end_trial", "ending", "fake_choice", "finish",
        					"gosub_scene", "gosub", "goto_random_scene", "goto_scene", "gotoref", "goto", "hide_reuse", "if", "image",
        					"input_number", "input_text", "line_break", "link_button", "link", "login", "looplimit", "more_games",
        					"page_break", "print", "purchase", "rand", "redirect_scene", "reset", "restart", "restore_game", "restore_purchases", "return",
        					"save_game", "selectable_if",  "scene_list", "script", "setref", "set", "share_this_game", "show_password", "sound", "stat_chart",
        					"subscribe", "temp", "title"];
        var jumpCommands = ["ending", "finish", "gosub_scene", "gosub", "goto_random_scene", "goto_scene", "gotoref", "goto", "label", "redirect_scene", "return"];
        var indentCommands = ["achievement", "choice", "if", "scene_list", "elseif", "else", "elsif", "fake_choice", "stat_chart"];
        var dedentCommands = ["finish", "goto_scene", "goto", "ending", "redirect_scene"];
        //var choiceCommands = ["hide_reuse", "allow_reuse", "selectable_if"];
        var csPlusCommands = ["console_log", "console_track", "console_track_all", "console_untrack_all", "console_untrack", "console_clear", "console_track_list"];
        var choiceOption = /\s+(?:\*(hide_reuse|allow_reuse|(if|selectable_if) .+) )?#.+/;

        var builtins = cmdRegExp(commonCommands);
        indentCommands = cmdRegExp(indentCommands);
        dedentCommands = cmdRegExp(dedentCommands);
        jumpCommands = cmdRegExp(jumpCommands);
        csPlusCommands = cmdRegExp(csPlusCommands);

        var TOKENS = {
            start: [
                {regex: /\s*\*comment(?: .*)?/, token: "comment"},
                {regex: jumpCommands, token: "keyword"},
                {regex: /\s+(?:\*(hide_reuse|allow_reuse|(if|selectable_if) .+) )?#.+/, token: "operator"},
                {regex: builtins, token: "builtin"},
                {regex: csPlusCommands, token: "cs-plus"},
                {regex: choiceOption, token: "variable"},
                {regex: /\b([A-Za-z-]+'[A-Za-z-]+|[A-Za-z-]+'?)\b/, token: "word"},
                {regex: /\$!{0,2}\{[\w\{\}\+\-&\*/\s0-9#]+(\[[\w0-9\[\]]+\])*\}/, token: "variable"},
                {regex: /[\{\}]/, token: "curly-bracket"},
                {regex: /[\(\)]/, token: "standard-bracket"},
                {regex: /[\[\]]/, token: "square-bracket"}
            ]
        };

        var TOKEN_NAMES = {
            '+': 'positive',
            '-': 'negative',
            '@': 'meta'
        };

        return {
            startState: function(){
                return {
                    next: 'start',
                    lastToken: null
                };
            },
            token: function(stream, state) {
                var tokenBase = function(stream, state) {
                    var next_rule = state.next || "start";
                    if (next_rule) {
                        state.next = state.next;
                        var nr = TOKENS[next_rule];
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
                        if (stream.match(r = TOKENS[next_rule])) {
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
                while (stream.pos == stream.start)
                  var style = tokenBase(stream, state);
                state.lastToken = {
                  style: style,
                  indent: stream.indentation(),
                  content: stream.current()
                };
                return style;
            },
            indent: function(state) {
                if (typeof state.lastToken === 'undefined' || state.lastToken === null) { return 0; }
                var indentation = state.lastToken.indent || 0;
                if (state.lastToken.content.match(indentCommands) || state.lastToken.content.match(choiceOption)) {
                    indentation += conf.indentUnit;
                }
                else if (state.lastToken.content.match(dedentCommands)) {
                    indentation -= conf.indentUnit;
                }
				indentation = (indentation < 0 ? 0 : indentation); //never allow negative indentation
                return indentation;
            },
            blankLine: function(state) {
                state.lastToken = {
                  style: "blank-line",
                  indent: 0,
                  content: ""
                };
            }
        };
    });

    CodeMirror.defineMIME("text/x-choicescript", "choicescript");

});
