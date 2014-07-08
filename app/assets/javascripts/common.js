

/*tab*/
$.fn.TabADS = function(){
	var obj = $(this);
	var currentClass = "select";
	var tabs = obj.find(".tab_hd").find("li");
	var conts = obj.find(".tab_cont");
	var t;
	tabs.eq(0).addClass(currentClass);
	conts.hide();
	conts.eq(0).show();
	tabs.each(function(i){
		$(this).bind("mouseover",function(){
			 t = setTimeout(function(){
				conts.hide().eq(i).show();
				tabs.removeClass(currentClass).eq(i).addClass(currentClass);
			},200);
		}).bind("mouseout",function(){
			clearTimeout(t);
		});
	});
}
/*tab2*/
$.fn.TabADS2 = function(){
	var obj = $(this);
	var currentClass = "select";
	var tabs = obj.find(".tab_hd2").find("li");
	var conts = obj.find(".tab_cont2");
	var t;
	tabs.eq(0).addClass(currentClass);
	conts.hide();
	conts.eq(0).show();
	tabs.each(function(i){
		$(this).bind("click",function(){
			 conts.hide().eq(i).show();
			tabs.removeClass(currentClass).eq(i).addClass(currentClass);
		});
	});
}
