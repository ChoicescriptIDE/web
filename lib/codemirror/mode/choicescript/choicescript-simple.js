function CommandRegexp(words) {
	return new RegExp("\\s*\\*(" + words.join('|') + ")(?: .*)?$");
}
var commonCommands =["abort", "achievement", "achieve", "advertisement", "allow_reuse", "author", "bug", "check_achievements",
					"check_purchase", "check_registration", "choice", "create", "delay_break", "delay_ending",
					"delete", "disable_reuse", "elseif", "elsif", "else", "end_trial", "ending", "fake_choice", "finish",
					"gosub_scene", "gosub", "goto_random_scene", "goto_scene", "gotoref", "goto", "hide_reuse", "if", "image",
					"input_number", "input_text", "line_break", "link_button", "link", "login", "looplimit", "more_games",
					"page_break", "print", "purchase", "rand", "redirect_scene", "reset", "restart", "restore_game", "restore_purchases", "return",
					"save_game", "selectable_if",  "scene_list", "script", "setref", "set", "share_this_game", "show_password", "sound", "stat_chart",
					"subscribe", "temp", "title"];
var indentCommands = ["choice", "if", "scene_list", "elseif", "else", "elsif", "fake_choice", "stat_chart"];
var dedentCommands = ["finish", "goto_scene", "goto", "ending", "redirect_scene"];

var builtins = CommandRegexp(commonCommands);
var indentCommands = CommandRegexp(indentCommands);
var dedentCommands = CommandRegexp(dedentCommands);

CodeMirror.defineSimpleMode("choicescript-simple", {
  // The start state contains the rules that are intially used
  start: [
	{regex: indentCommands, token: 'builtin', indent: true, sol: true},
	{regex: dedentCommands, token: 'builtin', dedent: true, sol: true},
	{regex: builtins, token: 'builtin', sol:true},
	{regex: /\s*\*label .*/, token: 'keyword', sol: true},
    {regex: /\s*\*comment(?: .*)?/, token: 'comment', sol: true},
    // The regex matches the token, the token property contains the type
    //{regex: /"(?:[^\\]|\\.)*?"/, token: "string"},
    // You can match multiple tokens at once. Note that the captured
    // groups must span the whole string in this case
    // Rules are matched in the order in which they appear, so there is
    // no ambiguity between this one and the one above
    // A next property will cause the mode to move to a different state
    {regex: /\$!{0,2}\{[\w\{\}\+\-&\*/\s0-9#]+(\[[\w0-9]+\])*\}/, token: "variable"},
    //{regex: /[#-+\/*=<>!]+/, token: "operator"},
    {regex: /\s+#/, token: "operator", indent: true}
	//{regex: /\s*$/, dedent: true, sol: true}, //whitespace (blank lines)
    // indent and dedent properties guide autoindentation
    // You can embed other modes with the mode property. This rule
    // causes all code between << and >> to be highlighted with the XML
    // mode.
  ],
  // The meta property contains global information about the mode. It
  // can contain properties like lineComment, which are supported by
  // all modes, and also directives like dontIndentStates, which are
  // specific to simple modes.
  meta: {
    //lineComment: "*comment"
  }
});
