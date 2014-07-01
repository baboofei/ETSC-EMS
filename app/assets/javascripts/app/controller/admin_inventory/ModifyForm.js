/**
 * 加载“修改信息”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.ModifyForm', {
    extend: 'Ext.app.Controller',

    stores: [
        'dict.MaterialCodes'
    ],
    models: [
        'dict.MaterialCode'
    ],

    views: [
        'admin_inventory.ModifyForm'
    ],

    //    refs: [{
    //        ref: 'list',
    //        selector: 'recommended_item_grid'
    //    }],

    init: function() {
        var me = this;

        me.control({
            'admin_inventory_modify_form textfield[name=sn]': {
                change: function(field) {
                    var grid = Ext.ComponentQuery.query('admin_inventory_grid[name=source_grid]')[0];
                    var selection = grid.getSelectedItem();
                    if(!Ext.isEmpty(field.getValue())) {
                        if(selection.get('current_quantity') != field.getValue().split(",").length) {
                            field.invalidMsg = '数量和序列号个数不一致，请检查！';
                        } else {
                            field.invalidMsg = '';
                        }
                    }
                    field.validate();
                }
            },
            'admin_inventory_modify_form button[action=save_modify]': {
                click: this.submit
            }
        });
    },
    submit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        if(form.form.isValid()) {
            form.submit({
                url: "admin_inventories/save_admin_inventory",
                params: {
                    "event": button.action,
                    "name": form.down('combo[name=name]', false).getRawValue(),
                    "model": form.down('combo[name=model]', false).getRawValue()
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridAdminInventories').load();
                },
                failure: function() {
                }
            });
        }
    }
});