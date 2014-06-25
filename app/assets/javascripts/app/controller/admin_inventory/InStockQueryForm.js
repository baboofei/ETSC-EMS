/**
 * 拆开后单独加载“批准入库”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.InStockQueryForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'AdminInventorySNs'
        'GridInStockQueryAdminInventories'
    ],
    models: [
//        'AdminInventorySN'
        'GridInStockQueryAdminInventory'
    ],

    views: [
        'admin_inventory.InStockQueryForm',
        'admin_inventory.InStockQueryGrid'
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
//            'admin_inventory_in_stock_form button[action=save]': {
//                click: this.saveItem
//            }
            'admin_inventory_in_stock_query_grid': {
                itemdblclick: function(view, record) {
                    load_uniq_controller(me, 'admin_inventory.InStockForm');
                    var view = Ext.widget('admin_inventory_in_stock_form').show();
                    var owner_field = view.down('expandable_vendor_unit_combo combo', false);
                    owner_field.getStore().loadData([[42, 'ETSC Technologies Co.(东隆科技有限公司)']]);
                    owner_field.setValue(42);
                    //备注带上
                    var comment_field = view.down('[name=comment]', false);
                    comment_field.setValue(record.get('comment'));
                    //数量带上，因为可能有出入
                    var quantity_field = view.down('[name=current_quantity]', false);
                    quantity_field.setValue(record.get('current_quantity'));
                }
            }
        });
    }

});