Ext.define('EIM.controller.CustomerUnits', {
    extend: 'Ext.app.Controller',

    stores: [
        'CustomerUnits', 'dict.CustomerUnitSorts', 'dict.Cities', 'GridCustomerUnits'
    ],
    models: [
        'CustomerUnit', 'dict.CustomerUnitSort', 'dict.City', 'GridCustomerUnit'
    ],

    views: [
        'customer_unit.Grid', 'customer_unit.Form'
    ],

    refs: [{
        ref: 'grid',
        selector: 'customer_unit_grid'
    }],

    init: function() {
        var me = this;
        me.control({
            'customer_unit_grid': {
                itemdblclick: this.editCustomerUnit,
                selectionchange: this.selectionChange
            },
            'customer_unit_grid button[action=addCustomerUnit]': {
                click: this.addCustomerUnit
            },
            'customer_unit_form button[action=save]': {
                click: this.saveCustomerUnit
            }
        });
    },

    addCustomerUnit: function() {
        Ext.widget('customer_unit_form').show();
    },

    saveCustomerUnit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        if (form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: "customer_units/save_customer_unit",
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
                                //如果有带加号的客户选择组件，则为其加一个过滤参数
                                var customer_combo_array = Ext.ComponentQuery.query("expandable_customer_combo");
                                if (customer_combo_array.length > 0) {
                                    Ext.Array.each(customer_combo_array, function(item) {
                                        if (item.up('form') === target_combo.up('form')) {
                                            item.down('combo', false).getStore().getProxy().setExtraParam('customer_unit_id', msg['id'])
                                        }
                                    });
                                }
                            }
                        });
                    }
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridCustomerUnits').load();
                },
                failure: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('失败', msg.message);
                    button.enable();
                }
            });
        }
    },

    loadCustomerUnits: function() {
        //        Ext.getStore("CustomerUnits").load();
        //        Ext.getStore("dict.Cities").load();
    },

    editCustomerUnit: function() {
        var record = this.getGrid().getSelectedCustomerUnit();
        var view = Ext.widget('customer_unit_form').show();
        view.down('form', false).loadRecord(record);
        //给combo做一个假的store以正确显示值
        var city_field = view.down('[name=city_id]', false);
        city_field.getStore().loadData([
            [record.get('city_id'), record.get('city>name')]
        ]);
        city_field.setValue(record.get('city_id'));
    },

    selectionChange: function() {

    }
});