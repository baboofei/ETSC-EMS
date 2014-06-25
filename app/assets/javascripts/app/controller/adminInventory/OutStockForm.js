/**
 * 拆开后单独加载“出库”视图用的controller
 */
Ext.define('EIM.controller.adminInventory.OutStockForm', {
    extend: 'Ext.app.Controller',

    stores: [
        'AdminInventorySNs'
    ],
    models: [
        'AdminInventorySN'
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
        });
    }
});