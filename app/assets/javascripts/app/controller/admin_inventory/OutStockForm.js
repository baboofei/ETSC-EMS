/**
 * 拆开后单独加载“出库”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.OutStockForm', {
    extend: 'Ext.app.Controller',

    stores: [
        'AdminInventorySNs',
        'ComboUsers'
    ],
    models: [
        'AdminInventorySN',
        'ComboUser'
    ],

    views: [
        'admin_inventory.OutStockForm'
    ],

    //    refs: [{
    //        ref: 'list',
    //        selector: 'recommended_item_grid'
    //    }],

    init: function() {
        var me = this;

        me.control({
            'admin_inventory_out_stock_form [name=outstock_count]': {
//                change: this.validateNumberByCount
            },
            'admin_inventory_out_stock_form [name=outstock_numbers]': {
                select: this.validateNumberByNumber
            },
            'admin_inventory_out_stock_form': {
                show: function(win) {
//                    var grid = Ext.ComponentQuery.query('admin_inventory_out_stock_query_grid')[0];

//                    var combo = win.down('combo[name=outstock_numbers]', false);
//                    combo.getStore().loadData([[1,"a"], [2,"xx1"]]);
                }
            },
            'admin_inventory_out_stock_form button[action=save]': {
                click: this.submit
            }
        });
    },
//
//    validateNumberByCount: function(text, newValue) {
//        var win = text.up('window');
//        var number_field = win.down('[name=outstock_numbers]', false);
//        if(number_field.getValue().length != 0 && newValue != number_field.getValue().length) {
//            number_field.invalidMsg = '数量和序列号个数不一致，请检查！';
//        } else {
//            number_field.invalidMsg = '';
//        }
//        number_field.validate();
//    },

    validateNumberByNumber: function(combo, records) {
//        var win = combo.up('window');
//        var quantity_field = win.down('[name=outstock_count]', false);

        var grid = Ext.ComponentQuery.query('admin_inventory_out_stock_query_grid')[0];
        var expected_quantity = grid.getSelectedItem().get('current_quantity');

//        quantity_field.setValue(records.length);
//        //比如先把这里选上3个，然后把数量改成2，再把这里去掉1个变成2个，这时候数量未变，所以不触发change事件，标记仍在。
//        //故手动校验一次
        if(records.length === expected_quantity) {
            combo.invalidMsg = '';
            combo.validate();
        } else {
            combo.invalidMsg = '需要出库的数量为 ' + expected_quantity + '，请检查输入数量！';
            combo.validate();
        }
    },

    submit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var combo = form.down('combo[name=outstock_numbers]', false);
        if(combo.getStore().count() > 0 && Ext.isEmpty(combo.getValue())) {
            combo.invalidMsg = '请选择需要出库的物品！';
            combo.validate();
        }
        //                    console.log(combo.getValue());
        if(form.form.isValid()) {
            var store_data = Ext.Array.pluck(Ext.ComponentQuery.query('boxselect')[0].getStore()["data"]["items"], "data");
            form.submit({
                url: "admin_inventories/save_admin_inventory",
                params: {
                    "items": combo.getValue().join("|"),
                    "store": Ext.encode(store_data),
                    "event": "stock_out_" + form.down('[name=out_stock_type]', false).getValue()
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridOutStockQueryAdminInventories').load({
                        scope: this,
                        callback: function() {
                            if(Ext.getStore('GridOutStockQueryAdminInventories').count() === 0) {
                                Ext.ComponentQuery.query('admin_inventory_out_stock_query_form')[0].close();
                            }
                        }
                    });
                },
                failure: function() {
                }
            });
        }
        //                    combo.getStore().loadData([[1,"a"], [2,"xx"]]);
    }
});