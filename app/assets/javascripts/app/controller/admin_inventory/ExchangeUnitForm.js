/**
 * 拆开后单独加载“出库”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.ExchangeUnitForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'AdminInventorySNs'
    ],
    models: [
//        'AdminInventorySN'
    ],

    views: [
        'admin_inventory.ExchangeUnitForm'
    ],

    //    refs: [{
    //        ref: 'list',
    //        selector: 'recommended_item_grid'
    //    }],

    init: function() {
        var me = this;

        me.control({
            'admin_inventory_exchange_unit_form [name=exchange_unit_new_count]': {
                change: function(numberfield, newValue, oldValue) {
                    var win = numberfield.up('window');
                    var form = win.down('form', false);
                    var new_unit_price_field = form.down('[name=exchange_unit_new_rmb]', false);
                    var old_unit_price_field = form.down('[name=exchange_unit_old_rmb]', false);
                    var old_unit_price = old_unit_price_field.getValue();
                    var old_unit_count_field = form.down('[name=exchange_unit_old_count]', false);
                    var old_unit_count = old_unit_count_field.getValue();
                    new_unit_price_field.setValue(old_unit_count * old_unit_price / newValue);
                }
            },
            'admin_inventory_exchange_unit_form button[action=save]': {
                click: function(button) {
                    var win = button.up('window');
                    var form = win.down('form', false);
//                    console.log(form.isValid());
//                    console.log(form.form.isValid());

                    if(form.form.isValid()) {
                        //防双击
                        button.disable();
                        form.submit({
                            url: 'admin_inventories/save_admin_inventory',
                            params: {
                                "event": "save_exchange_unit"
                            },
                            submitEmptyText: false,
                            success: function(the_form, action) {
                                win.close();
                                var response = action.response;
                                var msg = Ext.decode(response.responseText);
                                Ext.example.msg('成功', msg.message);
                                Ext.getStore('GridAdminInventories').load();
                            }
                        });

                    }
                }
            }
        });
    }
});