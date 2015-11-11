
require.config({
    baseUrl:'/', 
    paths:{
        style:'lib/requirejs/css.min', 
        text:'lib/requirejs/text', 
        jquery:'lib/jquery/1.8.1/jquery', 

    }
});

define('popupMenuGroup', ['jquery', 'style!css/other/popupMenuGroup.css'], 
    function($){

    /*
    这是主程序
    参数
        el 绑定到页面上一个div，用于显示根级菜单
        menus 一个json数组，每个数组元素拥有 name、link、childs三个子元素，其中name和link为字符窜，childs为数组
    */
    var objClass = function(options){
        this.options = options;
        this.initialize();
        this.eventInit();
    }
    objClass.prototype = {
        eventInit:function(){
            var $el = this.$el;
            $el.on('mouseenter', '>li', $.proxy(this.childMenuInit, this));

            $('body').on('click', $.proxy(function(){
                if (this.activeMenu){
                    this.activeMenu.destroy();
                }
            }, this));
            
        },
        initialize:function(){
            this.$el = $(this.options.el);
            var arr = [];
            $.each(this.options.menus, function(i, item){
                var $item = $('<li></li>');
                $item.html(item.name);
                $item.attr('jsonObj', item.childs);
                arr.push($item);
            });
            this.$el.append(arr);
        },
        childMenuInit:function(e){
            var $src = $(e.currentTarget);
            var position = $src.offset();
            var menus = this.options.menus[$src.index()].childs;
            if (this.activeMenu){
                this.activeMenu.destroy();
            }
            if (menus.length){
                var childMenu = new ChildMenu({ menus:menus });
                this.activeMenu = childMenu;
                this.activeMenu.$el.css({ left:position.left, top:position.top+$src.height() });
                $('body').append(this.activeMenu.$el);
            }
            
        },
    }


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
                var $li = $('<li><a href="#"></a></li>');
                var $link = $('a', $li);
                $link.html(item.name);
                item.link && $link.attr('href', item.link);
                if (item.childs && item.childs.length){
                    $li.append('<span>></span>');
                }
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
            var menus = this.options.menus[$src.index()].childs;
            if (this.activeMenu){
                this.activeMenu.destroy();
            }
            if (menus && menus.length){
                var childMenu = new ChildMenu({ menus:menus });
                this.activeMenu = childMenu;
                this.activeMenu.$el.css({ left:position.left+$src.width(), top:position.top });
                $('body').append(this.activeMenu.$el);
            }

        },
        destroy:function(){
            this.$el.trigger('destroy');
            this.$el.remove();
        }
    }


    return objClass;
});

require(['popupMenuGroup'], function(PopupMenuGroup){

    var menuGroup = new PopupMenuGroup({
        el:'#popupMenuGroup', 
        menus:[
            //设计部 生产部 产品部
            { name:'设计部', childs:[
                {name:'设计一室', 
                    childs:[
                        { name:'绘制组' }, 
                        { name:'制板组', link:'www.baidu.com' }, 
                        { name:'批量组' }, 
                    ]
                }, {name:'设计二室'}, {name:'设计三室'}, 
            ] }, 
            { name:'生产部', childs:'' }, 
            { name:'产品部', childs:'' }, 
        ]
    });
});


