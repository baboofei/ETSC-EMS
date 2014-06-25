/**
 * 拆开后单独加载“批准归还”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.ReturnQueryForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'AdminInventorySNs'
        'GridReturnQueryAdminInventories'
    ],
    models: [
//        'AdminInventorySN'
        'GridReturnQueryAdminInventory'
    ],

    views: [
        'admin_inventory.ReturnQueryForm',
        'admin_inventory.ReturnQueryGrid'
    ],

    refs: [
        {
            ref: 'grid',
            selector: 'admin_inventory_return_query_grid'
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
            'admin_inventory_return_query_grid': {
                itemdblclick: this.returnStockInByDblclick,
                selectionchange: this.gridSelectionChange
            },
            'admin_inventory_return_query_grid button[action=returnStockInItem]': {
                click: this.returnStockInByButton
            },
            'admin_inventory_return_query_grid button[action=damageItem]': {
                click: this.damage
            },
            'admin_inventory_return_query_grid button[action=scrapItem]': {
                click: this.scrap
            }
        });
    },

    returnStockInByDblclick: function(grid, record) {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.ReturnForm');
        var view = Ext.widget('admin_inventory_return_form').show();

        me.returnStockIn(record, view);

    },

    returnStockInByButton: function(button) {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.ReturnForm');
        var view = Ext.widget('admin_inventory_return_form').show();

        var record = button.up('grid').getSelectedItem();
        me.returnStockIn(record, view);

    },
    returnStockIn: function(record, view) {
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
    },

    gridSelectionChange: function(selectionModel, selected) {
        var grid = this.getGrid();
        var btn_return = grid.down('button[action=returnStockInItem]', false);
        var btn_damage = grid.down('button[action=damageItem]', false);
        var btn_scrap = grid.down('button[action=scrapItem]', false);

        if (selected.length > 0) {
            btn_return.setDisabled(false);
            btn_damage.setDisabled(false);
            btn_scrap.setDisabled(false);
        } else {
            btn_return.setDisabled(true);
            btn_damage.setDisabled(true);
            btn_scrap.setDisabled(true);
        }
    },

    damage: function(button) {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.DamageScrapChargeForm');
        var view = Ext.widget('admin_inventory_damage_scrap_charge_form');

        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.show('', function() {
            view.setTitle("报损");
            view.down('[name=keep_at]', false).hide();
            view.down('expandable_vendor_unit_combo', false).hide();
            var button_array = Ext.ComponentQuery.query('admin_inventory_damage_scrap_charge_form button[action!=\'\']');
            Ext.Array.each(button_array, function(item) {
                item.hide();
            });
            view.down('[action=save_damage]', false).show();
//            view.down('expandable_vendor_unit_combo combo', false).show();
            view.down('[name=id]', false).setValue(selection.get("id"));
            view.down('expandable_vendor_unit_combo combo', false).getStore().loadData([[42, 'ETSC']]);
            view.down('expandable_vendor_unit_combo combo', false).setValue(42);//默认所有权为ETSC
            view.down('expandable_vendor_unit_combo combo', false).isValid();

            var number_array = selection.get('number').split("、");
            var sn_array = selection.get('sn').split(",");
            var combine_array = [];
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
        })
    },

    scrap: function(button) {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.DamageScrapChargeForm');
        var view = Ext.widget('admin_inventory_damage_scrap_charge_form');

        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.show('', function() {
            view.setTitle("报废");
            view.down('[name=keep_at]', false).hide();
            view.down('expandable_vendor_unit_combo', false).hide();
            var button_array = Ext.ComponentQuery.query('admin_inventory_damage_scrap_charge_form button[action!=\'\']');
            Ext.Array.each(button_array, function(item) {
                item.hide();
            });
            view.down('[action=save_scrap]', false).show();

//            view.down('expandable_vendor_unit_combo combo', false).show();
            view.down('[name=id]', false).setValue(selection.get("id"));
            view.down('expandable_vendor_unit_combo combo', false).getStore().loadData([[42, 'ETSC']]);
            view.down('expandable_vendor_unit_combo combo', false).setValue(42);//默认所有权为ETSC
            view.down('expandable_vendor_unit_combo combo', false).isValid();

            var number_array = selection.get('number').split("、");
            var sn_array = selection.get('sn').split(",");
            var combine_array = [];
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
        })
    }
});