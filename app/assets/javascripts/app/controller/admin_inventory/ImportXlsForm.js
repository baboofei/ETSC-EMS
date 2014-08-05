/**
 * 单独加载“选择.xls文件”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.ImportXlsForm', {
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
        'admin_inventory.ImportXlsForm'
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
            'admin_inventory_import_xls_form button[action=upload]': {
                click: this.uploadXls
            }
        });
    },

    uploadXls: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        if(form.form.isValid()){
            form.submit({
                url: 'admin_inventories/upload_xls',
                waitMsg: '上传中，请稍候……',
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    console.log(msg.grid_data);
                    Ext.getStore('GridForStockAdminInventories').loadData(msg.grid_data);
                }
            });
        }
    }
});