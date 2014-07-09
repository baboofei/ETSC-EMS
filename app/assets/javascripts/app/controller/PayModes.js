Ext.define('EIM.controller.PayModes', {
    extend: 'Ext.app.Controller',

    stores: [
        'PayModes'
    ],
    models: [
        'PayMode'
    ],

    views: [
        'pay_mode.Form'
    ],

    refs: [
        //        {
        //            ref: 'grid',
        //            selector: 'pay_mode_grid'
        //        }
    ],

    init: function() {
        var me = this;
        me.control({
            //            'pay_mode_grid': {
            //                itemdblclick: this.editPayMode,
            //                selectionchange: this.selectionChange
            //            },
            'pay_mode_form [name=name]': {
                change: this.initCreditLevel
            },
            'pay_mode_form button[action=save]': {
                click: this.savePayMode
            }
        });
    },

    initCreditLevel: function(combo, newValue) {
        var form = combo.up('form');
        var credit_field = form.down('combo[name=credit_level]', false);

        var sign_percent_array = [],
            before_send_percent_array = [],
            after_send_percent_array = [],
            after_check_percent_array = [];
        var check_expire_flag = false;
        var rawValue = combo.getRawValue();
        var pay_mode_split_array = rawValue.split("，");
        if (rawValue.match(/[A-Z]{3}/)) {
            //币种方式时算出总价
            var total_amount = eval(combo.getRawValue().replace(/.*?[A-Z]{3}(\d+(?:.\d+)?)/g, "$1,").replace(/,\(.*?\)$/, "").split(",").join("+"));
        }

        Ext.Array.each(pay_mode_split_array, function(item) {
            var description_array = item.match(/(.*?)(\d+)([天|周|月])内付(\d+(?:\.\d+)?%|[A-Z]{3}\d+(?:\.\d+)?)\((电汇|信用证|现金)\)/);
            //            console.log(description_array);
            if (description_array) {
                var milestone = description_array[1];
                var time_range = description_array[2];
                var time_range_unit = description_array[3];
                var amount = description_array[4];
                //                var pay_method = description_array[5];
                switch (milestone) {
                    case "签合同后":
                        sign_percent_array.push(amount);
                        break;
                    case "发货前":
                        before_send_percent_array.push(amount);
                        break;
                    case "发货后":
                        after_send_percent_array.push(amount);
                        break;
                    case "验收后":
                        after_check_percent_array.push(amount);
                        //如果是“天”，看有没有超过30天的；是“周”，超过4周；是“月”，超过1月
                        switch (time_range_unit) {
                            case "天":
                                if (Number(time_range) > 30) check_expire_flag = true;
                                break;
                            case "周":
                                if (Number(time_range) > 4) check_expire_flag = true;
                                break;
                            case "月":
                                if (Number(time_range) > 1) check_expire_flag = true;
                                break;
                            default:
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        var sign_percent_sum = 0;
        var before_send_percent_sum = 0;

        if (rawValue.match(/[A-Z]{3}/)) {
            //币种方式时计算出百分比
            Ext.Array.map(sign_percent_array, function(item) {
                before_send_percent_sum += Number(item.replace(/%|[A-Z]{3}/, '') * 100.0 / total_amount);
                sign_percent_sum += Number(item.replace(/%|[A-Z]{3}/, '') * 100.0 / total_amount);
            });
            Ext.Array.map(before_send_percent_array, function(item) {
                before_send_percent_sum += Number(item.replace(/%|[A-Z]{3}/, '') * 100.0 / total_amount);
            });
        } else {
            //百分比方式直接用
            Ext.Array.map(sign_percent_array, function(item) {
                before_send_percent_sum += Number(item.replace(/%|[A-Z]{3}/, ''));
                sign_percent_sum += Number(item.replace(/%|[A-Z]{3}/, ''));
            });
            Ext.Array.map(before_send_percent_array, function(item) {
                before_send_percent_sum += Number(item.replace(/%|[A-Z]{3}/, ''));
            });
        }
        //        console.log(sign_percent_sum, before_send_percent_sum);
        //开始巨型树判断信用等级
        if ((
            sign_percent_array.length === 0 && before_send_percent_array.length === 0 && after_send_percent_array.length === 0 && after_check_percent_array.length === 0
        ) || !combo.isValid()) {
            //不合规则
            credit_field.setValue("5");
        } else {
            if (before_send_percent_sum === 100) {
                //货前总付为100%
                if (sign_percent_sum != 0) {
                    //有预付款
                    if (sign_percent_sum === 100) {
                        //预付100%
                        credit_field.setValue("5");
                    } else {
                        //预付不足100%
                        credit_field.setValue("4");
                    }
                } else {
                    //无预付款
                    credit_field.setValue("3");
                }
            } else {
                //货前总付不足100%
                if (before_send_percent_sum >= 60) {
                    //货前总多于60%
                    if (sign_percent_sum != 0) {
                        //有预付款
                        if (check_expire_flag) {
                            //验收后超过1个月付款
                            credit_field.setValue("1");
                        } else {
                            //验收后1个月内付款
                            credit_field.setValue("3");
                        }
                    } else {
                        //无预付款
                        if (check_expire_flag) {
                            //验收后超过1个月付款
                            credit_field.setValue("1");
                        } else {
                            //验收后1个月内付款
                            credit_field.setValue("2");
                        }
                    }
                } else {
                    //货前总不足60%
                    if (before_send_percent_sum >= 30) {
                        //货前总多于30%
                        if (check_expire_flag) {
                            //验收后超过1个月付款
                            credit_field.setValue("1");
                        } else {
                            //验收后1个月内付款
                            credit_field.setValue("2");
                        }
                    } else {
                        //货前总不足30%
                        credit_field.setValue("1");
                    }
                }
            }
        }

        //        console.log(check_expire_flag);
        //        console.log(sign_percent_array, before_send_percent_array, after_send_percent_array, after_check_percent_array);
        //        console.log(sign_percent_array[0], sign_percent_array.length);
    },

    savePayMode: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        if (form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: "pay_modes/save_pay_mode",
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    var target_by_id = form.down('[name=source_element_id]', false).getValue();
                    //如果是从小加号来的窗口(也就是source_element_id的值不为空)，则把值回填到小加号前面的combo里
                    if (!Ext.isEmpty(target_by_id)) {
                        var target = Ext.getCmp(target_by_id);
                        var target_combo = target.up('container').down("combo", false);
                        var text = response.request.options.params.name;
                        target_combo.store.load({
                            params: {
                                query: text
                            },
                            callback: function(records, operation, success) {
                                target_combo.select(msg['id']);
                            }
                        });
                    }
                    win.close();
                    Ext.example.msg('成功', msg.message);
                },
                failure: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('失败', msg.message);
                    button.enable();
                }
            });
        }
    }
});