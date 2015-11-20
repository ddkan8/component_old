
require.config({
    baseUrl:'../../', 
    paths:{
        style:'lib/requirejs/css.min', 
        text:'lib/requirejs/text', 
        jquery:'lib/jquery/1.8.1/jquery'
        
    }
});
define('laydate',['jquery','lib/laydate/laydate'],function($){
	var Dates = function (options){
		this.options = options;
		this.initialize();
	}
	Dates.prototype ={
		initialize:function(){
			var obj = this.options;
			laydate(obj);
		},
		setMaxDate : function(maxDate){
			this.options.max = maxDate;
			laydate(this.options);
		},
		setMinDate : function(minDate){
			this.options.min = minDate;
			laydate(this.options);
		}
	}
	return Dates;
});
require(['laydate'],function(Laydate){
	var start = null,end = null,maxDate = '' ;
	 start = new Laydate({
			elem: '#demoa',
		    format: 'YYYY/MM/DD hh:mm:ss',
		    start:laydate.now(0,'YYYY/MM/DD hh:mm:ss'),
		    istime: true,
		    istoday: false,
		    choose : function(datas){
		    	end.setMinDate(datas);
		    }
		});
	 end = new Laydate({
			elem: '#demob',
		    format: 'YYYY/MM/DD',
		    istime: true,
		    istoday: false,
		    choose: function(datas){
			      start.setMaxDate(datas); 
			    }
		});

});
