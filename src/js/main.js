// define(["jquery","baseinput"],function($,baseinput){
define(["jquery","noteapp"],function($,noteapp){
  "use strict";
  // $('#app-view').append('<h2>TTTT</h2>')
  console.log('1')
  var x = new noteapp({
    el:$('#app-view')
    // tip:'搜索'
  });
  return "main marker";
});