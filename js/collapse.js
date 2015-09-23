(function($){
	
  var $_this;
  var $_child;
  var $_class;

  $.fn.Collapse = function(options){
	  options = $.extend({
			openClass :"c-open",
			animate : true,
			speed :"fast",
			fade : false
		}, options);
	  
    $_this = this;	
    /* hides elements & prevents a css bug when containers elements have padding */
    $_this.next('div').css({'display': 'none','overflow' : 'hidden'});   
    /* sets 'open' class */
    $_class = (options.openClass) ? options.openClass : 'c-open';		
    /* checks for units set to be open on load */
    $_this.each(function(){

      if($(this).hasClass($_class)) $(this).next('div').show();
    });		
    $_this.click(function(){
      $(this).toggleClass($_class);
      $_child = $(this).next();
      (options.animate) ? animateToggle(options,$_child) : $_child.toggle();
    });	
  }

  function animateToggle(a,c){
    (a.fade) ? c.slideFadeToggle(a.speed) : c.stop(true, true).slideToggle(a.speed);
  }	

  /* Slide Toggle effect */
  $.fn.slideFadeToggle = function(speed) {
    return this.animate({opacity: 'toggle', height: 'toggle'}, speed);
  };	

})(jQuery);