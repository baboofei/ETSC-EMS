function init_site_interact() {
    $("#ajax_filter").click(function() {
        $.post(
            '/site/ajax_filter', {
                field1: 'hello'
            },
            function(returnData) {
                console.log(returnData);
                $("#myDiv").html(returnData);

            }
        );
    });

    $("#ajax_filter_small").click(function() {
        $.post(
            '/site/ajax_filter_small', {

            },
            function(returnData) {
                console.log(returnData);
            }
        )
    });

    $("#ajax_trigger").click(function() {
        $("#dynamic_form [name='category']").toggle(200);
//        $.post(
//            '/site/product', {
//                field1: 'xx'
//            }
//        );
//        update_paginator(5);
    });

    $(document).on("click", "#products .pagination a", function() {
        var me = this;
        var paginator = $(me).closest('ul');
        var li_length = $(me).closest('ul').children().length;
        var max_page = Number($(me).closest('ul').children('li').eq(li_length - 2)[0].innerText);
//        console.log($(me).closest('ul').children('li').eq(li_length - 2));
        var shown_page;

        if($(me).parent().hasClass("unavailable")) {
            return false;
        } else if($(me).closest('ul').children('li:first')[0] === $(me).parents('li')[0]) {
            //第一个li，即左箭头
            shown_page = 1;
        } else if($(me).closest('ul').children('li:last')[0] === $(me).parents('li')[0]) {
            //最后一个li，即右箭头
            shown_page = max_page;
        } else {
            //其它li
            shown_page = $(me)[0].innerText;
        }
        $.ajax({
            url: "/products/for_site",
            data: {
                page: $(me).attr("target_page")
            }
        }).done(function(msg) {
                update_paginator(max_page, Number(shown_page), 3, 2);
                update_products(msg);
            });
//        $.getScript('/site/product');
        return false;
    });
}

function update_paginator(max_page, shown_page, inner_window, outer_window) {
//    var max_page = 6;
//    var shown_page = 1;
//    var inner_window = 3;
//    var outer_window = 2;
    var output_array = [];

    if((shown_page - inner_window <= outer_window + 1) && (shown_page + inner_window + outer_window >= max_page)) {
        //双越界
        for(var i = 1; i <= max_page; i ++) {
            output_array.push(i);
        }
    } else if (shown_page - inner_window <= outer_window + 1) {
        //左越界
        for(var i = 1; i <= shown_page + inner_window; i ++) {
            output_array.push(i);
        }
        output_array.push('-');
        for(var i = max_page - outer_window + 1; i <= max_page; i ++) {
            output_array.push(i);
        }
    } else if (shown_page + inner_window + outer_window >= max_page) {
        //右越界
        console.log("right");
        for(var i = 1; i <= outer_window; i ++) {
            output_array.push(i);
        }
        output_array.push('-');
        for(var i = shown_page - inner_window; i <= max_page; i ++) {
            output_array.push(i);
        }
    } else {
        //常规
        for(var i = 1; i <= max_page; i ++) {
            output_array.push(i);
        }
        output_array.splice(outer_window, max_page - outer_window * 2, '_', '_');
        var to_join_array = [];
        for(var i = shown_page - inner_window; i <= shown_page + inner_window; i ++) {
            to_join_array.push(i);
        }
        for(var i = 0; i < to_join_array.length; i ++) {
            output_array.splice(outer_window + i + 1, 0, to_join_array[i]);
        }
    }
//    console.log(output_array);
//    数组生成完毕，开始转换为li

    var paginator = $(".pagination");
    paginator.empty();
    if(shown_page === 1) {
        $("<li class='arrow unavailable'><a href=''>&laquo;</a></li>").appendTo(paginator);
    } else {
        $("<li class='arrow'><a href='javascript:void(0);' target_page='1'>&laquo;</a></li>").appendTo(paginator);
    }
    for(var i = 0; i < output_array.length; i ++) {
        var str = ""
         if(output_array[i] === '-') {
            str = "<li class='unavailable'><a href=''>&hellip;</a></li>";
        } else {
            str = "<li><a href='javascript:void(0);' target_page='" + output_array[i] + "'>" + output_array[i] + "</a></li>";
        }
        $(str).appendTo(paginator);
    }
    if(shown_page === max_page) {
        $("<li class='arrow unavailable'><a href=''>&raquo;</a></li>").appendTo(paginator);
    } else {
        $("<li class='arrow'><a href='javascript:void(0);' target_page='" + max_page + "'>&raquo;</a></li>").appendTo(paginator);
    }
    for(var i = 0; i < paginator.children('li').length; i ++) {
        if(Number(paginator.children('li').eq(i)[0].innerText) === Number(shown_page)) {
            paginator.children('li').eq(i).addClass('current');
        }
    }
}

function update_products(array) {
    console.log(array.length);
    if(array.length === 6) {
        //满页，每个都写入值
        $.each(array, function(index, item) {
            $("#products [name=name]").eq(index).html(item.name);
            $("#products [name=brief]").eq(index).html(item.brief);
            $("#products [name=description]").eq(index).html(item.description);
        });
    } else {
        //不满页，后面的写空并隐藏
    }
    $.each(array, function(index, item) {
        console.log(item.id);
    });
}