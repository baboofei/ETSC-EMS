/**
 * 拆开后单独加载“批准归还”退货用的controller
 */
Ext.define('EIM.controller.admin_inventory.RejectQueryForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'AdminInventorySNs'
        'GridRejectQueryAdminInventories'
    ],
    models: [
//        'AdminInventorySN'
        'GridRejectQueryAdminInventory'
    ],

    views: [
        'admin_inventory.RejectQueryForm',
        'admin_inventory.RejectQueryGrid'
    ],

    refs: [
        {
            ref: 'grid',
            selector: 'admin_inventory_reject_query_grid'
        }
    ],

    init: function() {
        var me = this;

        me.control({
//            'admin_inventory_in_stock_form': {
//                afterrender: this.allowTrigger
//            },
//            'admin_inventory_in_stock_form button[action=save]': {
//                click: this.saveItem
//            }
            'admin_inventory_reject_query_grid': {
                itemdblclick: this.reject
            }
        });
    },

    reject: function(grid, record) {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.RejectForm');
        var view = Ext.widget('admin_inventory_reject_form').show();

        me.rejectStockIn(record, view);

    },

    rejectStockIn: function(record, view) {
        var number_array = record.get('number').split("、");
        var sn_array = record.get('sn').split(",");
        var combine_array = [];

        var id_field = view.down('[name=id]', false);
        id_field.setValue(record.get('id'));
        var loop_array = (number_array.length > sn_array.length ? number_array : sn_array)
        Ext.Array.each(loop_array, function(item, index) {
            var display = [];
            if(!Ext.isEmpty(number_array[index])) display.push("资产编号：" + number_array[index]);
            if(!Ext.isEmpty(sn_array[index])) display.push("序列号：" + sn_array[index]);
            combine_array[index] = [index, display.join(" ")];
        });
        var number_field = view.down('combo[name=outstock_numbers]', false);
        if(combine_array[0][1] != "") {
            number_field.getStore().loadData(combine_array);
        }
    }
});