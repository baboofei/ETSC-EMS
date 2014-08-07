/**
 * 拆开后单独加载“申请入库商品表单”(含表格)视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.ForStockForm', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridForStockAdminInventories'
    ],
    models: [
        'GridForStockAdminInventory'
    ],

    views: [
        'admin_inventory.ForStockForm',
        'admin_inventory.ForStockGrid'
    ],

    refs: [
        {
            ref: 'grid',
            selector: 'admin_inventory_for_stock_grid'
        }
    ],

    init: function() {
        var me = this;

        me.control({
//            'admin_inventory_in_stock_form': {
//                afterrender: this.allowTrigger
//            },
            'admin_inventory_for_stock_grid button[action=addItem]': {
                click: this.addBuyForm
            },
            'admin_inventory_for_stock_grid': {
                itemdblclick: this.editBuyForm,
                selectionchange: this.forStockSelectionChange
            },
            'admin_inventory_for_stock_grid button[action=deleteSelection]': {
                click: this.deleteSelection
            },
            'admin_inventory_for_stock_grid button[action=importXls]': {
                click: this.selectXlsFile
            },
            'admin_inventory_for_stock_grid button[action=batchEditVendor]': {
                click: this.selectVendor
            },
            'admin_inventory_for_stock_form button[action=save]': {
                click: this.submit
            }
        });
    },

    /**
     * 弹出“入库商品信息”的表单
     */
    addBuyForm: function() {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.BuyForm');
        var view = Ext.widget('admin_inventory_buy_form').show();
        //默认RMB
        view.down('[name=buy_price] combo', false).setValue(11);
    },

    /**
     * 弹出“入库商品信息”的表单
     */
    editBuyForm: function() {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.BuyForm');
        var record = this.getGrid().getSelectedItem();
        var view = Ext.widget('admin_inventory_buy_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        var btn_save_apply = view.down('button[action=save_apply]', false);

//        console.log(record['data']['currency_id']);
        view.down('[name=buy_price] combo', false).setValue(record['data']['currency_id']);
        view.down('[name=buy_price] numberfield', false).setValue(record['data']['buy_price']);
        //给combo做一个假的store以正确显示值
        var vendor_unit_field = view.down('expandable_vendor_unit_combo combo', false);
        vendor_unit_field.getStore().loadData([[record.get('vendor_unit_id'), record.get('vendor_unit_name')]]);
        vendor_unit_field.setValue(record.get('vendor_unit_id'));

        btn_save.hide();
        btn_update.show();
        btn_save_apply.show();

        view.down('form', false).loadRecord(record);
    },

    forStockSelectionChange: function(selectionModel, selected) {
        var me = this;
        var grid = me.getGrid();
        var btn_delete = grid.down('button[action=deleteSelection]', false);
        var btn_batch_edit_vendor = grid.down('button[action=batchEditVendor]', false);

        if(selected.length > 0) {
            btn_delete.enable();
            btn_batch_edit_vendor.enable();
        } else {
            btn_delete.disable();
            btn_batch_edit_vendor.disable();
        }
    },

    deleteSelection: function(button) {
        var me = this;
        var grid = button.up('grid');
        var se = grid.getSelectionModel().getSelection();
        grid.getStore().remove(se);
    },

    selectXlsFile: function() {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.ImportXlsForm');
        var view = Ext.widget('admin_inventory_import_xls_form').show();
    },

    selectVendor: function() {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.SelectVendorForm');
        var view = Ext.widget('admin_inventory_select_vendor_form').show();
    },

    submit: function(button) {
        var me = this;
        var win = button.up('window');
        var form = win.down('form', false);

        var grid = me.getGrid();
        if(grid.getStore().count() === 0) {
            Ext.example.msg("错误", "表格中还没有数据！");
            return false;
        }
        var vendor_unit_id_array = Ext.Array.pluck(Ext.Array.pluck(grid.getStore().data.items, "data"), "vendor_unit_id");
        var vendor_unit_id_str = vendor_unit_id_array.join("|");
        if(vendor_unit_id_str.indexOf("0|0") != -1 || vendor_unit_id_str === "0") {
            Ext.example.msg("错误", "表格中还有供应商信息不完整！");
            return false;
        }
        var vendor_id_array = Ext.Array.pluck(Ext.Array.pluck(grid.getStore().data.items, "data"), "vendor_id");
        var vendor_id_str = vendor_id_array.join("|");
        if(vendor_id_str.indexOf("0|0") != -1 || vendor_id_str === "0") {
            Ext.example.msg("错误", "表格中还有供应商信息不完整！");
            return false;
        }
        if(grid.getStore().count() === 0) {
            Ext.example.msg("错误", "表格中还没有数据！");
        } else {
            //防双击
            button.disable();

            var grid_data = Ext.encode(Ext.pluck(grid.getStore().data.items, "data"));
            form.submit({
                url: 'admin_inventories/save_admin_inventory',
                params: {
                    "event": "buy_in",
                    "grid_data": grid_data
                },
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridAdminInventories').load();
                },
                failure: function() {
                }
            });
        }
    }
});