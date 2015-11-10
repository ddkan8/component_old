
require.config({
    baseUrl:'/', 
    paths:{
        style:'lib/requirejs/css.min', 
        //async:'js/async', 
        text:'lib/requirejs/text', 
        jquery:'lib/jquery/1.8.1/jquery', 

    }
});

define('popupMenuGroup', [
    //'text!', 
    'jquery'], function($){

    var ChildMenu = function(options){
        this.options = options;
        this.initialize();
        this.eventInit();
    }
    ChildMenu.prototype = {
        initialize:function(){
            this.$el = $('<ul class="popupMenuGroup-menu"></ul>');
            var arr = [];
            $.each(this.options.menus, $.proxy(function(i, item){
                var $li = $('<li></li>');
                $li.html(item.name);
                arr.push($li);
            }, this));
            this.$el.append(arr);
            
        },
        eventInit:function(){
            var $el = this.$el;
            $el.on('mouseenter', '>li', $.proxy(this.childMenuInit, this));
            this.$el.on('destroy', $.proxy(function(){
                this.activeMenu && this.activeMenu.destroy();
            },this));
        }, 
        childMenuInit:function(e){
            var $src = $(e.currentTarget);
            var position = $src.offset();
            var childMenu = new ChildMenu({ menus:[ { name:'a1' }, { name:'a2' }, { name:'a3' },  ] });
            if (this.activeMenu){
                this.activeMenu.destroy();
            }
            this.activeMenu = childMenu;
            this.activeMenu.$el.css({ left:position.left+$src.width(), top:position.top });
            $('body').append(this.activeMenu.$el);
        },
        destroy:function(){
            this.$el.trigger('destroy');
            this.$el.remove();
        }, 
        /*
        trigger:function(evt, data) {
            this.$el.trigger(evt)
            $(this).trigger(evt, data);
        }, 
        on:function(evt, data) {
            $(this).on(evt, data);
        },*/ 
    }

    var objClass = function(options){
        this.options = options;
        this.initialize();
        this.eventInit();
    }
    objClass.prototype = {
        eventInit:function(){
            var $el = this.$el;
            $el.on('mouseenter', '>li', $.proxy(this.childMenuInit, this));
        },
        initialize:function(){
            this.$el = $(this.options.el);
            var arr = [];
            $.each(this.options.menus, function(i, item){
                var $item = $('<li></li>');
                $item.html(item.name);
                arr.push($item);
            });
            console.log(arr);
            this.$el.append(arr);
        },
        childMenuInit:function(e){
            var $src = $(e.currentTarget);
            var position = $src.offset();
            var childMenu = new ChildMenu({ menus:[ { name:'a1' }, { name:'a2' }, { name:'a3' },  ] });
            if (this.activeMenu){
                this.activeMenu.destroy();
            }
            this.activeMenu = childMenu;
            this.activeMenu.$el.css({ left:position.left, top:position.top+$src.height() });
            $('body').append(this.activeMenu.$el);
        },
        
    }

    return objClass;
    //alert($)
});

require(['popupMenuGroup'], function(PopupMenuGroup){
    var menuGroup = new PopupMenuGroup({
        el:'#popupMenuGroup', 
        menus:[
            //设计部 生产部 产品部
            { name:'设计部', childs:[
                {name:'设地一室'}, {name:'设地二室'}, {name:'设地三室'}, 
            ] }, 
            { name:'生产部', childs:'' }, 
            { name:'产品部', childs:'' }, 
        ]
    });
});


