/**
 * 拆开后单独加载“导出Excel条件”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.ExportConditionForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'AdminInventorySNs'
    ],
    models: [
//        'AdminInventorySN'
    ],

    views: [
        'admin_inventory.ExportConditionForm'
    ],

    //    refs: [{
    //        ref: 'list',
    //        selector: 'recommended_item_grid'
    //    }],

    init: function() {
        var me = this;

        me.control({
            /**
             * 最大最小日期的互相制约
             */
            'admin_inventory_export_condition_form [name=start_at]': {
                change: function(field, newValue) {
                    var form = field.up('form');
                    var end_at_field = form.down('[name=end_at]', false);
                    if(Ext.isEmpty(newValue) || !field.isValid()) {
                        end_at_field.setMinValue();
                    } else {
                        end_at_field.setMinValue(newValue)
                    }
                }
            },
            'admin_inventory_export_condition_form [name=end_at]': {
                change: function(field, newValue) {
                    var form = field.up('form');
                    var start_at_field = form.down('[name=start_at]', false);
                    if(Ext.isEmpty(newValue) || !field.isValid()) {
                        start_at_field.setMaxValue();
                    } else {
                        start_at_field.setMaxValue(newValue);
                    }
                }
            },

            /**
             * 最大最小单价的制约
             */
            'admin_inventory_export_condition_form [name=min_unit_price]': {
                blur: function(field) {
                    var form = field.up('form');
                    var max_unit_price_field = form.down('[name=max_unit_price]', false);
                    max_unit_price_field.setMinValue(field.getValue());
                    max_unit_price_field.validate();
                    if(!Ext.isEmpty(max_unit_price_field.getValue()) && max_unit_price_field.getValue() < field.getValue()) {
                        max_unit_price_field.setValue(field.getValue());
                    }
                },
                focus: function(field) {
                    var form = field.up('form');
                    var max_unit_price_field = form.down('[name=max_unit_price]', false);
                    max_unit_price_field.setMinValue(field.getValue());
                    max_unit_price_field.validate();
                }
            },
            'admin_inventory_export_condition_form [name=max_unit_price]': {
                blur: function(field) {
                    var form = field.up('form');
                    var min_unit_price_field = form.down('[name=min_unit_price]', false);
                    min_unit_price_field.setMaxValue(field.getValue());
                    min_unit_price_field.validate();
                    if(!Ext.isEmpty(min_unit_price_field.getValue()) && min_unit_price_field.getValue() > field.getValue()) {
                        min_unit_price_field.setValue(field.getValue());
                    }
                },
                focus: function(field) {
                    var form = field.up('form');
                    var min_unit_price_field = form.down('[name=min_unit_price]', false);
                    min_unit_price_field.setMaxValue(field.getValue());
                    min_unit_price_field.validate();
                }
            },

            'admin_inventory_export_condition_form [action=save]': {
                click: function(button) {
                    var win = button.up('window');
                    var form = win.down('form', false);
                    if(Ext.isEmpty(win.down('[name=start_at]', false).getValue()) &&
                        Ext.isEmpty(win.down('[name=end_at]', false).getValue()) &&
                        Ext.isEmpty(win.down('[name=vendor_unit_id]', false).getValue()) &&
                        Ext.isEmpty(win.down('[name=keyword]', false).getValue()) &&
                        Ext.isEmpty(win.down('[name=min_unit_price]', false).getValue()) &&
                        Ext.isEmpty(win.down('[name=min_unit_price]', false).getValue())) {
                        Ext.example.msg('不行', EIM_multi_field_invalid + '<br />请至少选择一个条件来导出！');
                        return false;
                    }

                    if(form.form.isValid()) {
                        //防双击
                        button.disable();
                        form.submit({
                            url: "admin_inventory_histories/export_excel",
                            params: {
                                "vendor_unit_ids": win.down('[name=vendor_unit_id]', false).getValue().join("|")
                            },
                            submitEmptyText: false,
                            success: function(the_form, action) {
                                var response = action.response;
                                var msg = Ext.decode(response.responseText);
                                win.close();
                                Ext.example.msg('成功', msg.message);
                            }
                        });
                    }
                }
            }
        });
    }
});