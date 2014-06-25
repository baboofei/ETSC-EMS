/**
 * 拆开后单独加载“归还”视图用的controller
 * 虽然没什么要的填，不过就当确认用了吧，难说以后不会有啥要填的
 */
Ext.define('EIM.controller.admin_inventory.ForReturnForm', {
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
        'admin_inventory.ForReturnForm'
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
            'admin_inventory_for_return_form button[action=save]': {
                click: this.forStock
            }
        });
    },

    forStock: function(button) {
        var me = this;
        var win = button.up('window');
        var form = win.down('form', false);

        var grid = this.getTargetGrid();
        var src_grid = this.getSourceGrid();
        var grid_data = Ext.encode(Ext.pluck(grid.getStore().data.items, "data"));

        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: 'admin_inventories/save_admin_inventory',
                params: {
                    "event": "return",
                    "grid_data": grid_data
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    src_grid.getStore().load();
                    grid.getStore().removeAll();
                    me.getController('AdminInventories').checkTargetGrid();
                }
            });
        }
    }
});