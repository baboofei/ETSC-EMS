//$("form :input:visible").serialize(); 提交时用这句

function init_site_interact() {
    $(document).ready(function() {
        //可能有多个刻度尺，每个下的都要平均

    });

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

    $("[name=trigger_category_search_panel]").click(function() {
        $("#dynamic_form [name='category']").hide(500);
        $("#dynamic_form [name='category']").eq(Number($(this).attr('category_id')) - 1).show(200, function() {
            $(".ETSC-range-slider [name=range-slider], .ETSC-range-slider-no-combo [name=range-slider]").each(function(index, item) {
                var width = $(item).width();
                var li_count = $(item).find("li").length;
                $(item).find("li").each(function(li_index, li_item) {
                    $(li_item).css({"text-align": "center"});
                    if(li_index === 0) $(li_item).css({"text-align": "left"});
                    if(li_index + 1 === $(item).find("li").length) $(li_item).css({"text-align": "right"});
                    $(li_item).css({"width": (width / li_count) - 3});
                });
            });
        });

        $.ajax({
            url: "/series/get_series_for_site",
            data: getAllFields($(this).attr('category_id'), "", "1"),
            success: function(msg) {
                update_paginator(msg['total_pages'], 1, 3, 2);
                update_products(msg['products']);
            }
        });
    });

    $("#dynamic_form :checkbox, #dynamic_form :radio").click(function() {
        formAjaxSubmit();
    });

    $(".ETSC-range-slider [name=range-slider]").each(function() {
        var name_in_code = $(this).attr("name_in_code");
//        console.log(name_in_code);
        var dimension = $(this).attr("dimension");
        var dimension_integer = Math.ceil(Math.log(dimension)/Math.LN10);
        var combo = $(this).parents(".ETSC-range-slider").eq(0).find("[name=" + name_in_code + "-min-combo]").eq(0);
//        var combo = $(this).parents(".ETSC-range-slider").eq(0).find("[name=min-combo]").eq(0);
//        console.log(combo);
        var min = 0;
        var max = 0;
        var step = 1;
        if(combo.length === 0) {
            //说明是同单位的范围选择，min和max由其下ul中的min和max得出
            min = Number($(this).find("li").eq(0).text());
            max = Number($(this).find("li").eq(1).text());
//            console.log(min, max, step);
        } else {
            //说明有单位变化，min和max由combo里的最小/最大值再除以/乘以精度得出
            var option_length = combo.find("option").length;
            min = combo.find("option").eq(0).attr("value");
            max = combo.find("option").eq(option_length - 1).attr("value");
            min = Number(min) - dimension_integer;
            max = Number(max) + dimension_integer;
            step = 1 / dimension;
        }
//        $(this).slider({
//            range: true,
//            min: 500,
//            max: 1000,
//            step: 0.001,
//            values: [500, 1000]
//        });
        $(this).slider({
            range: true,
            min: min,//-12 - 3,
            max: max,//15 + 3,
            step: step,//0.001,
            values: [min, max],//[-12 - 3, 15 + 3],
            change: function( event, ui ) {
                var min_field = $(this).parents(".ETSC-range-slider").eq(0).find("[name=" + name_in_code + "-min-value]").eq(0);
                var min_combo = $(this).parents(".ETSC-range-slider").eq(0).find("[name=" + name_in_code + "-min-combo]").eq(0);
                var max_field = $(this).parents(".ETSC-range-slider").eq(0).find("[name=" + name_in_code + "-max-value]").eq(0);
                var max_combo = $(this).parents(".ETSC-range-slider").eq(0).find("[name=" + name_in_code + "-max-combo]").eq(0);

                sliderSetValue(min_field, min_combo, ui.values[0], min, max, dimension_integer);
                sliderSetValue(max_field, max_combo, ui.values[1], min, max, dimension_integer);
                formAjaxSubmit();
            }
        });
    });

    $(".ETSC-range-slider [name*=min-value]").on({
        keyup: function() {
            var slider = $(this).parents(".ETSC-range-slider").eq(0).find("[name=range-slider]").eq(0);
            var dimension;
            if(slider.attr('dimension') === undefined) {
                dimension = 1;
            } else {
                dimension = Number(slider.attr('dimension'));
            }
            validateNumeric($(this), dimension);
        },
        keypress: function(event) {
            var key_code = (event.keyCode ? event.keyCode : event.which);
            var min_combo = $(this).parents(".ETSC-range-slider").eq(0).find("[name*=min-combo]").eq(0);
            var slider = $(this).parents(".ETSC-range-slider").eq(0).find("[name=range-slider]").eq(0);
            if(key_code == '13'){
                moveSlider($(this).val(), min_combo.val(), slider, "min");
                formAjaxSubmit();
            }
        }
    });
    $(".ETSC-range-slider [name*=min-combo]").on("change", function() {
        var min_value = $(this).parents(".ETSC-range-slider").eq(0).find("[name*=min-value]").eq(0);
        var slider = $(this).parents(".ETSC-range-slider").eq(0).find("[name=range-slider]").eq(0);
        moveSlider(min_value.val(), $(this).val(), slider, "min");
        validateNumeric(min_value, Number(slider.attr('dimension')));
        formAjaxSubmit();
    });

    $(".ETSC-range-slider [name*=max-value]").on({
        keyup: function() {
            var slider = $(this).parents(".ETSC-range-slider").eq(0).find("[name=range-slider]").eq(0);
            var dimension;
            if(slider.attr('dimension') === undefined) {
                dimension = 1;
            } else {
                dimension = Number(slider.attr('dimension'));
            }
            validateNumeric($(this), dimension);
        },
        keypress: function(event) {
            var key_code = (event.keyCode ? event.keyCode : event.which);
            var max_combo = $(this).parents(".ETSC-range-slider").eq(0).find("[name*=max-combo]").eq(0);
            var slider = $(this).parents(".ETSC-range-slider").eq(0).find("[name=range-slider]").eq(0);
            if(key_code == '13'){
                moveSlider($(this).val(), max_combo.val(), slider, "max");
            }
            formAjaxSubmit();
        }
    });
    $(".ETSC-range-slider [name*=max-combo]").on("change", function() {
        var max_value = $(this).parents(".ETSC-range-slider").eq(0).find("[name*=max-value]").eq(0);
        var slider = $(this).parents(".ETSC-range-slider").eq(0).find("[name=range-slider]").eq(0);
        moveSlider(max_value.val(), $(this).val(), slider, "max");
        validateNumeric(max_value, Number(slider.attr('dimension')));
        formAjaxSubmit();
    });

    $(".ETSC-properties .form>input").on("change", function() {
        formAjaxSubmit();
    });

    /*AJAX翻页*/
    $(document).on("click", "#products .pagination a", function() {
        var me = this;
        var paginator = $(me).closest('ul');
        var li_length = paginator.children().length;
        var max_page = Number(paginator.children('li').eq(li_length - 2).text());
//        console.log(paginator.children('li').eq(li_length - 2));
        var shown_page;

        if($(me).parent().hasClass("unavailable")) {
            return false;
        } else if(paginator.children('li:first')[0] === $(me).parents('li')[0]) {
            //第一个li，即左箭头
            shown_page = 1;
        } else if(paginator.children('li:last')[0] === $(me).parents('li')[0]) {
            //最后一个li，即右箭头
            shown_page = max_page;
        } else {
            //其它li
            shown_page = $(me).eq(0).text();
        }
        $.ajax({
            url: "/series/get_series_for_site",
            data: getAllFields("", "", shown_page),
            success: function(msg) {
//                console.log("msg:",msg);
//                console.log("max_page:", max_page);
                update_paginator(max_page, Number(shown_page), 3, 2);
                update_products(msg['products']);
            }
        });
//        $.getScript('/site/product');
        return false;
    });
}

function update_paginator(max_page, shown_page, inner_window, outer_window) {
//    var max_page = 15;
//    var shown_page = 5;
//    var inner_window = 3;
//    var outer_window = 2;
    var output_array = [];
//    console.log("maxpage:",max_page, "shownpage:",shown_page, inner_window, outer_window);
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
        if(Number(paginator.children('li').eq(i).eq(0).text()) === Number(shown_page)) {
            paginator.children('li').eq(i).addClass('current');
        }
    }
}

function update_products(array) {
//    console.log(array.length);
    if(array.length === 6) {
        //满页，每个都写入值
        $("#products .ETSC-product-list").slideUp(700, function() {
            $.each(array, function(index, item) {
                $("#products [name=name]").eq(index).html(item.name);
                $("#products [name=brief]").eq(index).html(item.brief);
                $("#products [name=description]").eq(index).html(item.description);
                $("#products .clear-indent").eq(index).show();
            });
            $("#products .ETSC-product-list").slideDown(700);
        });
    } else {
        //不满页，后面的写空并隐藏
        $("#products .ETSC-product-list").slideUp(700, function() {
            $("#products .clear-indent").hide();
            $.each(array, function(index, item) {
                $("#products [name=name]").eq(index).html(item.name);
                $("#products [name=brief]").eq(index).html(item.brief);
                $("#products [name=description]").eq(index).html(item.description);
                $("#products .clear-indent").eq(index).show();
            });
            $("#products .ETSC-product-list").slideDown(700);
        });
    }
    $.each(array, function(index, item) {
//        console.log(item.id);
    });
}

function sliderSetValue(field, combo, ui_values, min, max, dimension_integer) {
    var with_number = Math.pow(10, ui_values);
    if(combo.length != 0) {
        if(ui_values === min) {
            field.val(Math.pow(10, -dimension_integer));
            combo.val(min + dimension_integer);
        } else if(ui_values === max) {
            field.val(Math.pow(10, dimension_integer));
            combo.val(max - dimension_integer);
        } else {
            if(dimension_integer === 1) {
                //精度是10（10的1次方）的时候，受科学计数法的定义影响，计算出来的“系数部分”比1大，下面的方法不适用。另写
                var coefficient = (with_number.toExponential(3).split("e")[0] / 10).toFixed(1);
                var exponential = Number(with_number.toExponential(3).split("e")[1]) + 1;
                if(exponential <= (min + dimension_integer)) {
                    field.val(Number(coefficient * Math.pow(10, (-(min + dimension_integer) + Number(exponential)))).toFixed(dimension_integer));
                    combo.val(min + dimension_integer);
                } else {
                    var times = exponential / dimension_integer;
                    if(exponential < times + 1 && exponential >= times) {
                        field.val(Number(with_number.toExponential(3).split("e")[0]).toFixed(1));
                        combo.val(times - 1);
                    }
                }
            } else {
                //精度大于1时，可通用
                var coefficient = with_number.toExponential(dimension_integer).split("e")[0];
                var exponential = with_number.toExponential(dimension_integer).split("e")[1];

                if(exponential < ((min + dimension_integer) + dimension_integer * 1)) {
                    field.val(Number(coefficient * Math.pow(10, (-(min + dimension_integer) + Number(exponential)))).toFixed(dimension_integer));
                    combo.val(min + dimension_integer);
                } else {
                    var remainder = (exponential - (min + dimension_integer)) % dimension_integer;
                    var times = (exponential - remainder) / dimension_integer;
                    if(exponential < (dimension_integer * (times + 1)) && exponential >= (dimension_integer * times)) {
                        field.val(Number(coefficient * Math.pow(10, (-(dimension_integer * times) + Number(exponential)))).toFixed(dimension_integer));
                        combo.val(dimension_integer * times);
                    }
                }
            }
        }
    } else {
        field.val(ui_values);
    }
}

function validateNumeric(field, dimension_integer) {
        var val = field.val();
        var within_range;
        var is_numeric = /^\d+(\.\d+)?$/gi.test(val);
        if(is_numeric) {
            val = Number(val);
            if(dimension_integer != 1) {
                within_range = (val >= (1.0 / dimension_integer) && val <= dimension_integer);
            } else {
                within_range = val >= Number(field.parents(".ETSC-range-slider").eq(0).find("li").eq(0).text()) && val <= Number(field.parents(".ETSC-range-slider").eq(0).find("li").eq(1).text());
            }
        }
        if(!is_numeric || !within_range) {
            field.css({"background-color": "red"});
        } else {
            field.css({"background-color": "white"});
        }
}

function moveSlider(field_value, combo_value, slider, min_or_max) {
    if(combo_value === undefined) {
        if(min_or_max === "min") {
            slider.slider("option", "values", [field_value, slider.slider("option","values")[1]]);
        } else {
            slider.slider("option", "values", [slider.slider("option","values")[0], field_value]);
        }
    } else {
        var actually_value = Math.log(field_value) / Math.log(10) + Number(combo_value);
        if(min_or_max === "min") {
            slider.slider("option", "values", [actually_value, slider.slider("option","values")[1]]);
        } else {
            slider.slider("option", "values", [slider.slider("option","values")[0], actually_value]);
        }
    }
}

function formAjaxSubmit() {
    $.ajax({
        url: "/series/get_series_for_site",
        data: getAllFields("", "", ""),
        dataType: 'json',
        success: function(msg){
//            console.log("msg:", msg);
            update_paginator(msg['total_pages'], 1, 3, 2);
            update_products(msg['products']);
        }
    });
}

/**
 * 提取页面上所有需要传参数的区域以供提交。共有三个部分：
 * 分类（左边选了哪个分类。点击分类名时取自带的参数，已经有分类翻页时取“可见”的，无分类翻页时取0）
 * 表单（上面的大关键字和“当前”分类的子表单。实时AJAX）
 * 分页（下面的分页。点分页时是依当前条件分页，否则是取第一页）
 * @return {Object}
 */
function getAllFields(category_source, form, pagination_source) {
    var category = "";
    var form = "";
    var page = "";

    if(category_source != "") {
        category = category_source;
    } else {
        if($("[name='category']:visible").length > 0) {
            category = $("[name='category']:visible").eq(0).attr("id").split("_")[1];
        } else {
            category = "0";
        }
    }

    form = $("form :input:visible").serializeArray();

    if(pagination_source != "") {
        page = pagination_source;
    } else {
        page = "0";
    }
//    console.log({category: category, form: form, page: page});
    return {category: category, form: form, page: page}
}