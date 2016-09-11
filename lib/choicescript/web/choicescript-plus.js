Scene.prototype.create_array = function create_array(data) {
  data = data || "";
  var args = data.split(" ");
  console.log(args);
  if (args.length > 3) throw new Error(this.lineMsg()+"Too many arguments; expected name, size and (optionally) a default value.");
  if (args.length < 2) throw new Error(this.lineMsg()+"Too few arguments; expected name, size and (optionally) a default value.");
  var arrName = args[0];
  var arrSize = parseInt(args[1]);
  var defaultVal = args[2] || "";
  if (isNaN(arrSize)) throw new Error(this.lineMsg()+"Size must be a number: " + args[1]);
  
  for (var i = 1; i <= arrSize; i++)
    this.create(arrName + "_" + i + " " + defaultVal);
};

Scene.prototype.loop_for = function loop_for(data) {

};

Scene.prototype.loop_while = function loop_while(data) {

};

Scene.prototype.repeat = function repeat(data) {
  this.loop_for(data);
};

Scene.prototype.repeat_while = function repeat_while(data) {
  this.loop_while(data);
};

Scene.validCommands.create_array = 1;
Scene.validCommands.loop_for = 1;
Scene.validCommands.loop_while = 1;
Scene.validCommands.repeat = 1;
Scene.validCommands.repeat_while = 1;