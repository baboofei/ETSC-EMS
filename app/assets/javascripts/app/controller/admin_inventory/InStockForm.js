/**
 * 拆开后单独加载“入库”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.InStockForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'dict.MaterialCodes'
    ],
    models: [
//        'dict.MaterialCode'
    ],

    views: [
        'admin_inventory.InStockForm',
        'etscux.ExpandableMaterialCodeCombo'
    ],

    //    refs: [{
    //        ref: 'list',
    //        selector: 'recommended_item_grid'
    //    }],

    init: function() {
        var me = this;

        me.control({
            'admin_inventory_in_stock_form': {
                afterrender: this.allowTrigger
            },
            'admin_inventory_in_stock_form button[action=save]': {
                click: this.submit
            }
        });
    },

    allowTrigger: function(win) {
        var me = this;
        var grid = Ext.ComponentQuery.query('admin_inventory_in_stock_query_grid')[0];
        var selection = grid.getSelectedItem();
        var quantity = selection.get('current_quantity');

//        var currency_number_field = win.down('[name=buy_price] numberfield', false);
//        currency_number_field.on('change', me.syncRmb, this);
        var quantity_field = win.down('numberfield[name=current_quantity]', false);
        var sn_field = win.down('textfield[name=sn]', false);
        quantity_field.on('change', function(number_field) {
            if(!Ext.isEmpty(sn_field.getValue())) {
                if(number_field.getValue() != sn_field.getValue().split(",").length) {
                    sn_field.invalidMsg = '数量和序列号个数不一致，请检查！';
                } else {
                    sn_field.invalidMsg = '';
                }
            }
            sn_field.validate();
        }, this);
        sn_field.on('change', function(textfield) {
//            quantity_field.setValue(text.getValue().split(",").length);
//            text.invalidMsg = '';
//            text.validate();
            var text = textfield.getValue();
            if(!Ext.isEmpty(text)) {
                if(text.split(",").length != quantity) {
                    sn_field.invalidMsg = '数量和序列号个数不一致，请检查！';
                } else {
                    sn_field.invalidMsg = '';
                }
                sn_field.validate();
            }
        }, this);
    },
//    /**
//     * 懒得加上汇率计算了，汇率又不能这边改，而且极少
//     * @param number
//     * @param newValue
//     */
//    syncRmb: function(number, newValue) {
//        var currency_field = number.up('form').down('[name=buy_price] combo', false);
//        if(currency_field.getValue() === 11) {
//            var rmb_field = number.up('form').down('[name=rmb]', false);
//            rmb_field.setValue(newValue);
//        }
//    },

    submit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        var grid = Ext.ComponentQuery.query('admin_inventory_in_stock_query_grid')[0];
        var selection = grid.getSelectedItem();
        var id = selection.get('id');
        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url:"admin_inventories/save_admin_inventory",
                params: {
                    "id": id,
                    "event": "stock_in"
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridInStockQueryAdminInventories').load({
                        scope: this,
                        callback: function() {
                            if(Ext.getStore('GridInStockQueryAdminInventories').count() === 0) {
                                Ext.ComponentQuery.query('admin_inventory_in_stock_query_form')[0].close();
                            }
                        }
                    });
                },
                failure: function() {
                }
            });
        }
    }
});