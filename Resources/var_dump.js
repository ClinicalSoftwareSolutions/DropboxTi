/**
 * Ref: http://timoa.com/en/2012/07/appcelerator-dump-javascript-object-ti-api-debug/
 * Debug : var_dump
 * 
 * @var: Var
 * @level: Level max
 * 
 */

exports.display = function(_var, _level) {
	Ti.API.info('*** VAR_DUMP ***');
	Ti.API.info(exports.getdump(_var, _level));	
};

exports.getdump = function(_var, _level) {
  var dumped_text = "";
  if(!_level) _level = 0;
     
  //The padding given at the beginning of the line.
  var level_padding = "";
  for(var j=0; j<_level+1; j++) level_padding += "    ";
     
    if(typeof(_var) == 'object') { //Array/Hashes/Objects 
      for(var item in _var) {
    var value = _var[item];
             
    if(typeof(value) == 'object') { // If it is an array,
      dumped_text += level_padding + "'" + item + "' ...\n";
      dumped_text += exports.getdump(value, _level+1);
    } else {
      dumped_text += level_padding +"'"+ item +"' => \""+ value +"\"\n";
    }
      }
    } else { //Stings/Chars/Numbers etc.
      dumped_text = "===>"+ _var +"<===("+ typeof(_var) +")";
    }
  return dumped_text;
};