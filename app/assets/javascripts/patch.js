/**
 * 反复开关tab标签后，标签里的按钮触发的窗口会变成多个重叠，数量等于开关该标签的次数
 * 于是用这个来判断一下，始终只出现一个
 * TODO 似乎是因为重复加载controller的问题，这里现在好像不再需要了，先留下吧
 * @param widget_name
 */
check_before_create = function(widget_name, eObj) {
    var all_widget = Ext.ComponentQuery.query(widget_name);
    var widget_to_show;
    if(all_widget.length > 0){
//        console.log("第2++次");
        //第二次打开时用这个，而且参数很奇妙地会保留
        widget_to_show = all_widget[0];
    }else{
//        console.log("第1次");
        //第一次打开时用这个
        widget_to_show = Ext.widget(widget_name, eObj);
    }
    widget_to_show.show();
};

/**
 * 避免重复加载controller，先判断一下是否已经加载过了
 * @param me 外边传过来的me，不管是啥了……
 * @param controller 要加载的controller, string
 */
load_uniq_controller = function(me, controller) {
    var controller_arr = me.application.controllers.keys;
    if(!Ext.Array.contains(controller_arr, controller)) {
        var c = me.application.getController(controller);
        c.init();
    }
};

filter_all_dict = function(filter, available_items_only) {
    var array = Ext.ComponentQuery.query('functree')[0].allDict;
    var new_array = [];
    if(available_items_only) {
        Ext.Array.each(array, function(item, index, allList) {
//            console.log(item, item['available'], typeof(item['available']));
            if(item['data_type'] === filter && item['available']) {
                new_array.push(item);
            }
        });
    }else{
        Ext.Array.each(array, function(item, index, allList) {
            if(item['data_type'] === filter) {
                new_array.push(item);
            }
        });
    }
//    console.log(new_array);
    
    //按value排序后返回
    var sorted_array = Ext.Array.sort(new_array, function compare(a, b){
        if(a.value > b.value)
            return 1;
        if(a.value < b.value)
            return -1;
        return 0;
    });
//    console.log(sorted_array);
    return sorted_array;
};
filter_all_application = function() {
    var array = Ext.ComponentQuery.query('functree')[0].allApplication;
    var new_array = [];
    Ext.Array.each(array, function(item, index, allList) {
            new_array.push(item);
    });
    
    //按id排序后返回
    var sorted_array = Ext.Array.sort(new_array, function compare(a, b){
        if(a.id > b.id)
            return 1;
        if(a.id < b.id)
            return -1;
        return 0;
    });
    return sorted_array;
};
filter_all_area = function() {
    var array = Ext.ComponentQuery.query('functree')[0].allArea;
    var new_array = [];
    Ext.Array.each(array, function(item, index, allList) {
            new_array.push(item);
    });
    
    //按id排序后返回
    var sorted_array = Ext.Array.sort(new_array, function compare(a, b){
        if(a.id > b.id)
            return 1;
        if(a.id < b.id)
            return -1;
        return 0;
    });
    return sorted_array;
};
filter_all_our_company = function() {
    var array = Ext.ComponentQuery.query('functree')[0].allOurCompany;
    var new_array = [];
    Ext.Array.each(array, function(item, index, allList) {
            new_array.push(item);
    });

    //按id排序后返回
    var sorted_array = Ext.Array.sort(new_array, function compare(a, b){
        if(a.id > b.id)
            return 1;
        if(a.id < b.id)
            return -1;
        return 0;
    });
    return sorted_array;
};
filter_all_material_code = function() {
    var array = Ext.ComponentQuery.query('functree')[0].allMaterialCode;
    var new_array = [];
    Ext.Array.each(array, function(item, index, allList) {
            new_array.push(item);
    });
    return sort_by_id(new_array);
};
filter_all_role = function() {
    var array = Ext.ComponentQuery.query('functree')[0].allRole;
    var new_array = [];
    Ext.Array.each(array, function(item, index, allList) {
        new_array.push(item);
    });

    //按id排序后返回
    var sorted_array = Ext.Array.sort(new_array, function compare(a, b){
        if(a.id > b.id)
            return 1;
        if(a.id < b.id)
            return -1;
        return 0;
    });
    return sorted_array;
};
filter_all_user = function() {
    var array = Ext.ComponentQuery.query('functree')[0].allUser;
    var new_array = [];
    Ext.Array.each(array, function(item, index, allList) {
        new_array.push(item);
    });

    //按id排序后返回
    var sorted_array = Ext.Array.sort(new_array, function compare(a, b){
        if(a.id > b.id)
            return 1;
        if(a.id < b.id)
            return -1;
        return 0;
    });
    return sorted_array;
};
filter_all_member = function() {
    var array = Ext.ComponentQuery.query('functree')[0].allMember;
    var new_array = [];
    Ext.Array.each(array, function(item, index, allList) {
        new_array.push(item);
    });

    //按id排序后返回
    var sorted_array = Ext.Array.sort(new_array, function compare(a, b){
        if(a.id > b.id)
            return 1;
        if(a.id < b.id)
            return -1;
        return 0;
    });
    return sorted_array;
};
filter_all_member_sale = function() {
    var array = Ext.ComponentQuery.query('functree')[0].allMemberSales;
    var new_array = [];
    Ext.Array.each(array, function(item, index, allList) {
        new_array.push(item);
    });
    return sort_by_id(new_array);

//    //按id排序后返回
//    var sorted_array = Ext.Array.sort(new_array, function compare(a, b){
//        if(a.id > b.id)
//            return 1;
//        if(a.id < b.id)
//            return -1;
//        return 0;
//    });
//    return sorted_array;
};
filter_all_buyer = function() {
    var array = Ext.ComponentQuery.query('functree')[0].allBuyer;
    var new_array = [];
    Ext.Array.each(array, function(item, index, allList) {
        new_array.push(item);
    });
    return sort_by_id(new_array);
};
filter_all_business = function() {
    var array = Ext.ComponentQuery.query('functree')[0].allBusiness;
    var new_array = [];
    Ext.Array.each(array, function(item, index, allList) {
        new_array.push(item);
    });
    return sort_by_id(new_array);
};
filter_all_supporter = function() {
    var array = Ext.ComponentQuery.query('functree')[0].allSupporter;
    var new_array = [];
    Ext.Array.each(array, function(item, index, allList) {
        new_array.push(item);
    });
    return sort_by_id(new_array);
};

filter_currency = function(query) {
    var array = Ext.ComponentQuery.query('functree')[0].allCurrency;
    var new_array = [];
    switch(query)
    {
    case 1:
        Ext.Array.each(array, function(item, index, allList) {
            if(item['id'] === 1) {
                new_array.push(item);
            }
        });
        break
    case 2:
        Ext.Array.each(array, function(item, index, allList) {
            if(item['id'] === 2) {
                new_array.push(item);
            }
        });
        break
    case 3:
        Ext.Array.each(array, function(item, index, allList) {
            if(item['id'] === 1 || item['id'] === 2) {
                new_array.push(item);
            }
        });
        break
    case 4:
        Ext.Array.each(array, function(item, index, allList) {
            if(item['id'] > 10) {
                new_array.push(item);
            }
        });
        break
    case 5:
        Ext.Array.each(array, function(item, index, allList) {
            if(item['id'] === 1 || item['id'] > 10) {
                new_array.push(item);
            }
        });
        break
    case 6:
        Ext.Array.each(array, function(item, index, allList) {
            if(item['id'] === 2 || item['id'] > 10) {
                new_array.push(item);
            }
        });
        break
    default:
        new_array = array;
        break
    }
    
    //按id排序后返回
    var sorted_array = Ext.Array.sort(new_array, function compare(a, b){
        if(a.id > b.id)
            return 1;
        if(a.id < b.id)
            return -1;
        return 0;
    });
    return sorted_array;
};

function sort_by_id(array) {
    var sorted_array = Ext.Array.sort(array, function compare(a, b){
        if(a.id > b.id)
            return 1;
        if(a.id < b.id)
            return -1;
        return 0;
    });
    return sorted_array;
}

/**
 * 所有form的默认参数
 * @type {Object}
 */
EIM_field_defaults = {
    labelWidth: 80,
    labelAlign: 'right',
    labelSeparator: '：',
    anchor: '100%',
    flex: 1,
    msgTarget: 'side'
};

/**
 * 需要同时校验的区域，校验未通过时的提示信息
 * @type {String}
 */
EIM_multi_field_invalid = "表单中还有值没有填写完整，请检查！";
/**
 * 修正chart组件中多种颜色时的legend图例显示颜色不对应问题
 */
Ext.override(Ext.chart.series.Pie, {
    getLegendColor: function(index) {
        var me = this;
        var store = me.chart.substore || me.chart.store;
        var record = store.getAt(index);
        return record.data.customColor || (me.colorSet && me.colorSet[index % me.colorSet.length]) || me.colorArrayStyle[index % me.colorArrayStyle.length];
    }
});


/*****************各种正则校验*****************/

var email_reg = /^[a-zA-Z0-9_\-]+(\.[_a-zA-Z0-9\-]+)*@([_a-zA-Z0-9\-]+\.)+([a-zA-Z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)$/i;
Ext.apply(Ext.form.VTypes, {
    //  vtype validation function
    zemail: function(val, field) {
        var array = val.split(",");
        var passed = 0;
        for(var i = 0; i < array.length; i++){
//            console.log(passed);
            //每一截分别校验
            if(email_reg.test(array[i])) {
                passed += 1;
            }else{
                return false;
            }
        }
        return true;
    },
    zemailText: '输入格式不合法，格式应该为“abc@example.com”之类。'//,
    // vtype Mask property: The keystroke filter mask
    //  pay_modeMask: /[\d\s:amp]/i
});

/**
 * 质保条款的正则校验
 * @type {RegExp}
 */
var term_reg = /^从(出厂|发货|到港|到货|客户验收|客户开始使用)起\d+个(月|小时)$/;
Ext.apply(Ext.form.VTypes, {
    //  vtype validation function
    term: function(val) {
        return term_reg.test(val);
    },
    termText: '输入格式不合法，格式应该为“从出厂起12个月”，或者“从客户开始使用起10000个小时”之类。'//,
});

/**
 * 付款方式的正则校验
 * @type {RegExp}
 */
var pay_mode_reg = /^(签合同后|发货前|发货后|验收后)\d+(?:天|周|月)内付(([A-Z]{3})\d+(?:\.\d+)?|\d+(?:\.\d+)?(%))[\(|（](电汇|信用证|现金)[\)|）]$/;
Ext.apply(Ext.form.VTypes, {
    //  vtype validation function
    pay_mode: function(val, field) {
        var array = val.split("，");
        var passed = 0;
        var currency_array = [];
        var time_point_array =[];
        var total = 0;
        for(var i = 0; i < array.length; i++){
            //每一截分别校验
            if(pay_mode_reg.test(array[i])) {
                currency_array.push(RegExp.$3);
                time_point_array.push(RegExp.$1);
                if(RegExp.$3 == "") {
                    total += Number(RegExp.$2.substr(0,RegExp.$2.length - 1));
                }
                passed += 1;
            }else{
                return false;
            }
        }
        if(Ext.unique(currency_array).length > 1 || passed != array.length) return false;//币种不一致时报错
        if(RegExp.$3 == "" && total != 100) return false;//总百分比超过100%时报错
//        if(Ext.unique(time_point_array).length != array.length) return false;//节点数多于四个时报错
        return true;
    },
    pay_modeText: '输入格式不合法，格式应该为“签合同时付USD3000(信用证)”，或者“发货前付100%(电汇)”之类。'//,
    // vtype Mask property: The keystroke filter mask
    //  pay_modeMask: /[\d\s:amp]/i
});

/*************************************************************************************/

/**
 * 帮助文档里的临时浮动提示框
 * @type {example}
 */

Ext.example = function(){
    var msgCt;

    function createBox(t, s){
        // return ['<div class="msg">',
        //         '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
        //         '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
        //         '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
        //         '</div>'].join('');
        return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    }
    return {
        msg : function(title, format, inDir, outDir, duration){
            if(!inDir) inDir = 't';
            if(!outDir) outDir = 't';
            if(!duration) duration = 1000;
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn(inDir).ghost(outDir, { delay: duration, remove: true});
        },

        init : function(){
//            var t = Ext.get('exttheme');
//            if(!t){ // run locally?
//                return;
//            }
//            var theme = Cookies.get('exttheme') || 'aero';
//            if(theme){
//                t.dom.value = theme;
//                Ext.getBody().addClass('x-'+theme);
//            }
//            t.on('change', function(){
//                Cookies.set('exttheme', t.getValue());
//                setTimeout(function(){
//                    window.location.reload();
//                }, 250);
//            });
//
//            var lb = Ext.get('lib-bar');
//            if(lb){
//                lb.show();
//            }
        }
    };
}();

Ext.example.shortBogusMarkup = '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed metus nibh, '+
    'sodales a, porta at, vulputate eget, dui. Pellentesque ut nisl. Maecenas tortor turpis, interdum non, sodales '+
    'non, iaculis ac, lacus. Vestibulum auctor, tortor quis iaculis malesuada, libero lectus bibendum purus, sit amet '+
    'tincidunt quam turpis vel lacus. In pellentesque nisl non sem. Suspendisse nunc sem, pretium eget, cursus a, fringilla.</p>';

Ext.example.bogusMarkup = '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed metus nibh, sodales a, '+
    'porta at, vulputate eget, dui. Pellentesque ut nisl. Maecenas tortor turpis, interdum non, sodales non, iaculis ac, '+
    'lacus. Vestibulum auctor, tortor quis iaculis malesuada, libero lectus bibendum purus, sit amet tincidunt quam turpis '+
    'vel lacus. In pellentesque nisl non sem. Suspendisse nunc sem, pretium eget, cursus a, fringilla vel, urna.<br/><br/>'+
    'Aliquam commodo ullamcorper erat. Nullam vel justo in neque porttitor laoreet. Aenean lacus dui, consequat eu, adipiscing '+
    'eget, nonummy non, nisi. Morbi nunc est, dignissim non, ornare sed, luctus eu, massa. Vivamus eget quam. Vivamus tincidunt '+
    'diam nec urna. Curabitur velit. Lorem ipsum dolor sit amet.</p>';

//Ext.onReady(Ext.example.init, Ext.example);


// old school cookie functions
var Cookies = {};
Cookies.set = function(name, value){
    var argv = arguments;
    var argc = arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    var path = (argc > 3) ? argv[3] : '/';
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    document.cookie = name + "=" + escape (value) +
        ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
        ((path == null) ? "" : ("; path=" + path)) +
        ((domain == null) ? "" : ("; domain=" + domain)) +
        ((secure == true) ? "; secure" : "");
};

Cookies.get = function(name){
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    var j = 0;
    while(i < clen){
        j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return Cookies.getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if(i == 0)
            break;
    }
    return null;
};

Cookies.clear = function(name) {
    if(Cookies.get(name)){
        document.cookie = name + "=" +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
};

Cookies.getCookieVal = function(offset){
    var endstr = document.cookie.indexOf(";", offset);
    if(endstr == -1){
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
};
