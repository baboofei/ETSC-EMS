/**
 * 拆开后单独加载“归还”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.RejectForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'AdminInventorySNs',
//        'ComboUsers'
    ],
    models: [
//        'AdminInventorySN',
//        'ComboUser'
    ],

    views: [
        'admin_inventory.RejectForm'
    ],

    refs: [
        {
            ref: 'sourceGrid',
            selector: 'admin_inventory_grid[name=source_grid]'
        },
        {
            ref: 'targetGrid',
            selector: 'admin_inventory_grid[name=target_grid]'
        }
    ],

    init: function() {
        var me = this;

        me.control({
            'admin_inventory_reject_form [name=reject_numbers]': {
                select: this.validateNumberByNumber
            },
            'admin_inventory_reject_form button[action=save]': {
                click: this.submit
            }
        });
    },

    validateNumberByNumber: function(combo, records) {
        //        var win = combo.up('window');
        //        var quantity_field = win.down('[name=reject_count]', false);

        var grid = Ext.ComponentQuery.query('admin_inventory_reject_query_grid')[0];
        var expected_quantity = grid.getSelectedItem().get('current_quantity');

        //        quantity_field.setValue(records.length);
        //        //比如先把这里选上3个，然后把数量改成2，再把这里去掉1个变成2个，这时候数量未变，所以不触发change事件，标记仍在。
        //        //故手动校验一次
        if(records.length === expected_quantity) {
            combo.invalidMsg = '';
            combo.validate();
        } else {
            combo.invalidMsg = '需要退货的数量为 ' + expected_quantity + '，请检查输入数量！';
            combo.validate();
        }
    },

    submit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var combo = form.down('combo[name=reject_numbers]', false);
        if(combo.getStore().count() > 0 && Ext.isEmpty(combo.getValue())) {
            combo.invalidMsg = '请选择需要退货的物品！';
            combo.validate();
        }
//        console.log(combo.getValue());
        if(form.form.isValid()) {
            var store_data = Ext.Array.pluck(Ext.ComponentQuery.query('boxselect')[0].getStore()["data"]["items"], "data");
            form.submit({
                url:"admin_inventories/save_admin_inventory",
                params: {
                    "items": combo.getValue().join("|"),
                    "store": Ext.encode(store_data),
                    "event": "reject"
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridRejectQueryAdminInventories').load({
                        scope: this,
                        callback: function() {
                            if(Ext.getStore('GridRejectQueryAdminInventories').count() === 0) {
                                Ext.ComponentQuery.query('admin_inventory_reject_query_form')[0].close();
                            }
                        }
                    });
                },
                failure: function() {
                }
            })
        }
        //                    combo.getStore().loadData([[1,"a"], [2,"xx"]]);
    }
});