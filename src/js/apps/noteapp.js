/**
 * notepad app
 */
define(["jquery","underscore","backbone","localstorage","bootstrap"],function($,_und,backbone,localstorage,bootstrap){
	"use strict";

	var jw = {};
  
  jw.note = {};

  jw.note.m = {};
  // base 
  jw.note.m.base = Backbone.Model.extend({
  	defaults:{title:'',content:''}
  });

  // TODOs 
  jw.note.m.todo = jw.note.m.base.extend({

  });
  // 
  jw.note.coll = Backbone.Collection.extend({
  	model:jw.note.m.base,
  	localStorage: new Store("Notes"),
    comparator: 'updated_at',
    parse:function(response, options){
      console.log('response',response)
      response = _(response).map(function(attrs){
        if( attrs.type && jw.note.m[attrs.type] ) 
          return new jw.note.m[attrs.type](attrs);
        else
          return new jw.note.m['base'](attrs);
      });
      this.add(response);
    }
  });

  jw.note.edit = Backbone.View.extend({
  	className:'note-edit-w modal fade',
  	events:{
  		'click .btn-primary':'submit',
  		'click .btn-close':'close',
  	},
  	initialize:function(){
  		_.bindAll( this, 'check' );
  		if(!this.model) this.model = new jw.note.m.base;

      var self = this;
  		this.model.bind('change', this.check )
        .bind('change:type', this.changeType )
        .bind('sync',function(){
          self.close();
        });
  		this.render();
  	},
  	template:function(){
  		var template = '<div class="modal-dialog">\
    <div class="modal-content">\
      <div class="modal-body">\
        <input class="form-control" id="focusedInput" type="text" value="<%=title%>" placeholder="Title" />\
        <textarea class="form-control" rows="10" placeholder="Content"><%=content%></textarea>\
      </div>\
      <div class="modal-footer">\
        <button type="button" class="btn btn-default btn-close" data-dismiss="modal">Close</button>\
        <button type="button" class="btn btn-primary" disabled>Save changes</button>\
      </div>\
    </div>\
	</div>';
  		return template;
  	},
    // 变更类别为checkbox类别
    changeType:function(){
      console.log('')
    },
  	render:function(){
  		var self = this;
  		this.$el.append( _.template( this.template() , this.model.toJSON() ) );//.attr('role','dialog');
  		$('body').append(this.$el);
  		this.$el.modal({
  			keyboard : true,
				show : true,
				backdrop : 'static'
  		});

  		this.$el.bind('shown.bs.modal',function(evt){
  			// alert('shown')
  			self.$el.find('textarea').focus();
  		}).bind('hidden.bs.modal',function(evt){
  			if(self.model.isNew()) self.model.destroy();
  			this.remove();
  			// self.close();
  		});

  		this.$el.find('input').on('input propertychange',function(){
  			self.model.set('title', $.trim($(this).val()) );
  		});
  		this.$el.find('textarea').on('input propertychange',function(){
  			self.model.set('content', $(this).val() );
  		});
  	},
  	check:function(){
  		if( this.model.get('content')!='' && this.$el.find('.btn-primary').attr('disabled') ) 
  			this.$el.find('.btn-primary').removeAttr('disabled');
  		if( this.model.get('content')=='' && typeof this.$el.find('.btn-primary').attr('disabled')=='undefined')
  			this.$el.find('.btn-primary').attr('disabled','disabled');
  	},
  	submit:function(){
      this.model.set('updated_at',new Date());
  		this.model.save({wait: true});
  	},
  	close:function(){
  		if(this.model && this.model.isNew()) this.model.destroy();
  		this.$el.modal('hide');
  	}
  });
  // 单个笔记视图
	jw.note.sm = Backbone.View.extend({
		className:'note-item col-md-4',
    events:{
      // 'click .bar-remind-btn':'editReminder'
    },
		initialize:function(){
			_.bindAll( this, 'edit' ,'remove', 'render' );
			this.model.on('destroy', this.remove )
        .on('change',this.render);
		},
		template:function(){
			var template = '<div class="note-itemc"><h3 class="text-overflow"><%=title%></h3><p><%=content%></p><div class="n-bar"><span class="bar-remind-btn glyphicon glyphicon-time" data-placement="bottom" data-original-title="Remind me"></span><span class="glyphicon glyphicon-picture" data-placement="bottom" data-original-title="Add image"></span><span class="glyphicon glyphicon-list" data-placement="bottom" data-original-title="Show checkbox"></span><span class="glyphicon glyphicon-trash" data-placement="bottom" data-original-title="Remove note"></span></div></div>';
			return template;
		},
		render:function(){
      this.$el.empty();
			this.$el.append( _.template( this.template() , this.model.toJSON() ) );
			if(!this.model.isNew()) this.$el.attr('id',this.model.id);
			this.$el.find('h3,p').click( this.edit );
      this.$el.find('.glyphicon').tooltip()
			return this;
		},
		edit:function(){
			new jw.note.edit({
				model: this.model
			});
		},
		remove:function(){
			this.$el.remove();
		},
    editReminder:function(){
      this.$el.addClass('editing');
      this.$el.append('<div class="edit-reminder"></div>')
    }
	});

	var noteapp = Backbone.View.extend({
		initialize:function(options){
      console.log('initialize')
			_.bindAll(this, 'addOne', 'addAll', 'render', 'addNew' );
			this.collection = new jw.note.coll;
			this.collection.bind('add', this.addOne );
			this.collection.bind('reset', this.addAll );
      console.log('xxx',this.collection.comparator)
      this.render();
			this.collection.fetch();
		},
		render:function(){
      this.$el.before('<header class="navbar navbar-inverse navbar-fixed-top bs-docs-nav" role="banner"><nav class="note-bar"><ul class="nav navbar-nav"><li><a class="category-btn"><span class="glyphicon glyphicon-align-justify"></span><span>Notes</span></a></li></ul></nav></header><div class="note-new"><button id="addnew-btn" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> Add New Note</button></div>');
      this.$el.append('<div class="n-container"></div>');
      $('#addnew-btn').click( this.addNew );
		},
		addOne : function( model ){
			// console.log('model addOne',model.get('updated_at'))
			var view = new jw.note.sm({model: model});
			this.$el.find('.n-container').append(view.render().el);
		},
		addAll : function() {
			this.collection.each( this.addOne );
		},
		addNew:function(){
      // console.log('addNew')
			var model = new jw.note.m.base;
			new jw.note.edit({
				model: model
			});
			this.collection.add( model );
		}
	});

	return noteapp;
});