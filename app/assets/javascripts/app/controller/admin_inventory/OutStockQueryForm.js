/**
 * 拆开后单独加载“领用”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.OutStockQueryForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'AdminInventorySNs'
        'GridOutStockQueryAdminInventories'
    ],
    models: [
//        'AdminInventorySN'
        'GridOutStockQueryAdminInventory'
    ],

    views: [
        'admin_inventory.OutStockQueryForm',
        'admin_inventory.OutStockQueryGrid'
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
            'admin_inventory_out_stock_query_grid': {
                itemdblclick: function(grid, record) {
                    load_uniq_controller(me, 'admin_inventory.OutStockForm');
                    var view = Ext.widget('admin_inventory_out_stock_form').show();
                    var number_array = record.get('number').split("、");
                    var sn_array = record.get('sn').split(",");
                    var combine_array = [];
                    view.down('form', false).loadRecord(record);
//                    view.down('form', false).down('[name=out_stock_type]',false).setValue();
                    view.down('hidden[name=out_stock_type]', false).setValue(grid.up('window').down('hidden', false).getValue());
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
            }
        });
    }
});