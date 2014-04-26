/**
 * Joywok IM 系统基本输入框
 * @params 
 *		tip:默认提醒文字 
 *		style:设置input的高度(0为29px 1为35px)
 */
define(["jquery","underscore","backbone"],function($,_und,backbone){
	"use strict";
	var baseinput = Backbone.View.extend({
		className: "jwim-baseinput",
		// events:{
		// 	'focus input':'focus'
		// },
		initialize:function(options){
			_.extend(this, _.pick(options, ['tip','style']));
		},
		render:function(){
			// PlaceHolder 
			// console.log(inputTemp);
			// var html = _.template( '<%=content%>', this.collection.models[this.curpage].toJSON() );
			// this.$el.append('<input type="input" placeholder="'+this.tip+'" />');
			// this.$el.append( _.template( inputTemp, this ) );
			this.$el.append( '<h1>Render</h1>' );
			return this;
		}
	});

	return baseinput;
});