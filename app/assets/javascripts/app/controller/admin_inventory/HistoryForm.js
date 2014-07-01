/**
 * 拆开后单独加载“操作历史”(含表格)视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.HistoryForm', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridAdminInventoryHistories'
    ],
    models: [
        'GridAdminInventoryHistory'
    ],

    views: [
        'admin_inventory.HistoryForm',
        'admin_inventory.HistoryGrid'
    ],

    refs: [
        {
            ref: 'grid',
            selector: 'admin_inventory_history_grid'
        }
    ],

    init: function() {
        var me = this;

        me.control({
//            'admin_inventory_in_stock_form': {
//                afterrender: this.allowTrigger
//            },
//            'admin_inventory_for_stock_grid button[action=addItem]': {
//                click: this.addBuyForm
//            },
//            'admin_inventory_for_stock_grid': {
//                itemdblclick: this.editBuyForm,
//                selectionchange: this.forStockSelectionChange
//            },
//            'admin_inventory_for_stock_grid button[action=deleteSelection]': {
//                click: this.deleteSelection
//            },
//            'admin_inventory_for_stock_form button[action=save]': {
//                click: this.submit
//            }
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

        if(selected.length > 0) {
            btn_delete.enable();
        } else {
            btn_delete.disable();
        }
    },

    deleteSelection: function(button) {
        var me = this;
        var grid = button.up('grid');
        var se = grid.getSelectionModel().getSelection();
        grid.getStore().remove(se);
    },

    submit: function(button) {
        var me = this;
        var win = button.up('window');
        var form = win.down('form', false);

        var grid = me.getGrid();
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