/**
 * 拆开后单独加载“领用审批”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.AuditingQueryForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'AdminInventorySNs'
        'GridAuditingQueryAdminInventories'
    ],
    models: [
//        'AdminInventorySN'
        'GridAuditingQueryAdminInventory'
    ],

    views: [
        'admin_inventory.AuditingQueryForm',
        'admin_inventory.AuditingQueryGrid'
    ],

    //    refs: [{
    //        ref: 'list',
    //        selector: 'recommended_item_grid'
    //    }],

    init: function() {
        var me = this;

        me.control({
//            'admin_inventory_in_stock_form': {
//                afterrender: this.allowTrigger
//            },
            'admin_inventory_auditing_query_form button[action=pass_auditing]': {
                click: this.passAuditing
            },
            'admin_inventory_auditing_query_form button[action=refuse_auditing]': {
                click: this.refuseAuditing
            }
//            'admin_inventory_in_stock_query_grid': {
//                itemdblclick: function(view, record) {
//                    load_uniq_controller(me, 'admin_inventory.InStockForm');
//                    var view = Ext.widget('admin_inventory_in_stock_form').show();
//                    var owner_field = view.down('expandable_vendor_unit_combo combo', false);
//                    owner_field.getStore().loadData([[42, 'ETSC Technologies Co.(东隆科技有限公司)']]);
//                    owner_field.setValue(42);
//                    //备注带上
//                    var comment_field = view.down('[name=comment]', false);
//                    comment_field.setValue(record.get('comment'));
//                }
//            }
        });
    },

    passAuditing: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var grid = form.down('grid', false);
        var apply_for_sn = grid.getStore().getAt(0).get('apply_for_sn');//当前批次
        button.disable();
        form.submit({
            url: 'admin_inventories/save_admin_inventory',
            params: {
                "event": "agree",
                "apply_for_sn": apply_for_sn
            },
            submitEmptyText: false,
            success: function(the_form, action) {
                win.close();
                var response = action.response;
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);
                grid.getStore().load();
            }
        })
    },

    refuseAuditing: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var grid = form.down('grid', false);
        var apply_for_sn = grid.getStore().getAt(0).get('apply_for_sn');//当前批次
        button.disable();
        form.submit({
            url: 'admin_inventories/save_admin_inventory',
            params: {
                "event": "refuse",
                "apply_for_sn": apply_for_sn
            },
            submitEmptyText: false,
            success: function(the_form, action) {
                win.close();
                var response = action.response;
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);
                grid.getStore().load();
            }
        })
    }
});