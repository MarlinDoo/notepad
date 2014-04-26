define(["jquery","baseinput"],function($,baseinput){
// define(["jquery","noteapp"],function($,noteapp){
  "use strict";

  $('#app-view').append('<h2>TTTT</h2>')
  var x = new baseinput({
		tip:'搜索'
	});

	$('#app-view').append(x.render().el)
  console.log('x',x)
  return "main marker";
});