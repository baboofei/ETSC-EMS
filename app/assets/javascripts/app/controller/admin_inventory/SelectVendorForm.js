/**
 * 单独加载“选择供方联系人”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.SelectVendorForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'GridForStockAdminInventories'
    ],
    models: [
//        'GridForStockAdminInventory'
    ],

    views: [
//        'admin_inventory.ForStockForm',
//        'admin_inventory.ForStockGrid',
        'admin_inventory.SelectVendorForm'
    ],

    refs: [
//        {
//            ref: 'grid',
//            selector: 'admin_inventory_for_stock_grid'
//        }
    ],

    init: function() {
        var me = this;

        me.control({
            'admin_inventory_select_vendor_form button[action=save]': {
                click: this.updateVendor
            }
        });
    },

    updateVendor: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var values = form.getValues();
        values['vendor_unit_name'] = form.down('expandable_vendor_unit_combo combo', false).getRawValue();
        values['vendor_name'] = form.down('expandable_vendor_combo combo', false).getRawValue();

        var grid = Ext.ComponentQuery.query("admin_inventory_for_stock_form admin_inventory_for_stock_grid")[0];

        var records = grid.getSelectedItems();
        Ext.Array.each(records, function(item, index) {
            item.set(values);
        });
        win.close();
    }
});