/**
 * 拆开后单独加载“申请租借”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.ApplyForLoanForm', {
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
        'admin_inventory.ApplyForLoanForm'
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
            'admin_inventory_apply_for_loan_form button[action=save]': {
                click: this.applyForLoan
            }
        });
    },

    applyForLoan: function(button) {
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
                    "event": "apply_for_loan",
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