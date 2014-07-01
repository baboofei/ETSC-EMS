/**
 * 拆开后单独加载“申请领用”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.ApplyForUseForm', {
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
        'admin_inventory.ApplyForUseForm'
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
            'admin_inventory_apply_for_use_form radiofield[inputValue=project]': {
                change: this.enableDetailProject
            },
            'admin_inventory_apply_for_use_form radiofield[inputValue=exhibition]': {
                change: this.enableDetailExhibition
            },
            'admin_inventory_apply_for_use_form radiofield[inputValue=other]': {
                change: this.enableDetailOther
            },
            'admin_inventory_apply_for_use_form button[action=save]': {
                click: this.applyForUse
            }
        });
    },

    enableDetailProject: function(radio, newValue) {
        var form = radio.up('form');
        var text_field = form.down('[name=project_number]', false);
        text_field.setDisabled(!newValue);
    },

    enableDetailExhibition: function(radio, newValue) {
        var form = radio.up('form');
        var text_field = form.down('[name=exhibition_name]', false);
        text_field.setDisabled(!newValue);
    },

    enableDetailOther: function(radio, newValue) {
        var form = radio.up('form');
        var text_field = form.down('[name=other_detail]', false);
        text_field.setDisabled(!newValue);
    },

    applyForUse: function(button) {
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
//                    "project": win.down('[name=project]', false).getValue(),
                    "event": "apply_for_use",
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