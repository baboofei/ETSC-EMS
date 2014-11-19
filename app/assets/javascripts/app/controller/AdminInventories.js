/**
 * 综管库存管理页面上的controller
 */
Ext.define('EIM.controller.AdminInventories', {
    extend: 'Ext.app.Controller',

    stores: [
        'ComboVendorUnits',
        'ComboVendors',
        'ComboPurchasers',
        'GridAdminInventories',
        'GridCopyAdminInventories',
        'ComboAdminInventoryNames',
        'ComboAdminInventoryModels'
    ],
    models: [
        'ComboVendorUnit',
        'ComboVendor',
        'ComboPurchaser',
        'GridAdminInventory',
        'ComboAdminInventoryName',
        'ComboAdminInventoryModel'
    ],
    //TODO 总感觉这里的一个dict和一个combo可以优化一下？

    views: [
        'admin_inventory.Panel',
        'admin_inventory.Grid'
    ],

    refs: [{
        ref: 'sourceGrid',
        selector: 'admin_inventory_grid[name=source_grid]'
    }, {
        ref: 'targetGrid',
        selector: 'admin_inventory_grid[name=target_grid]'
    }],

    shiftStatus: 'released',
    isBlocked: false,
    tempDraggedArray: [],

    init: function() {
        var me = this;
        me.control({
            'admin_inventory_grid[name=target_grid]': {
                selectionchange: this.targetSelectionChange
            },
            'admin_inventory_grid[name=source_grid]': {
                selectionchange: this.sourceSelectionChange,
                render: function() {
                    new Ext.util.KeyMap(Ext.getBody(), [{
                        key: Ext.EventObject.SHIFT,
                        fn: function() {
                            me.shiftStatus = 'pressed';
                        }
                    }], 'keydown');
                    new Ext.util.KeyMap(Ext.getBody(), [{
                        key: Ext.EventObject.SHIFT,
                        fn: function() {
                            me.shiftStatus = 'released';
                        }
                    }], 'keyup');
                }
            },
            'admin_inventory_grid[name=target_grid] dataview': {
                beforedrop: this.checkHoldingData
            },
            'admin_inventory_grid button[action=buy]': {
                click: this.popBuyForm
            },
            'admin_inventory_grid button[action=show_history]': {
                click: this.popAdminInventoryHistoryForm
            },
            'admin_inventory_grid button[action=export_excel]': {
                click: this.popExportConditionForm
            },
            'admin_inventory_grid button[action=apply_for_use]': {
                click: this.popApplyForUseForm
                //                click: this.applyForUse
            },
            'admin_inventory_grid button[action=apply_for_loan]': {
                click: this.popApplyForLoanForm
            },
            'admin_inventory_grid button[action=apply_for_sell]': {
                click: this.popApplyForSellForm
            },
            'admin_inventory_grid button[action=apply_for_reject]': {
                click: this.popApplyForRejectForm
            },
            'admin_inventory_grid button[action=return]': {
                click: this.popReturnForm
            },
            'admin_inventory_grid [action=out_stock]': {
                click: this.popOutStockForm
            },
            'admin_inventory_grid [action=damage], admin_inventory_grid [action=scrap], admin_inventory_grid [action=charge], admin_inventory_grid [action=change_location], admin_inventory_grid [action=change_ownership]': {
                click: this.popDamageScrapChargeForm
            },
            'admin_inventory_grid [action=exchange_unit]': {
                click: this.popExchangeUnitForm
            },
            'admin_inventory_grid [action=fix]': {
                click: this.popFixForm
            },
            'admin_inventory_grid [action=modify]': {
                click: this.popModifyForm
            },
            'admin_inventory_grid[name=target_grid] button[action=deleteSelection]': {
                click: this.deleteSelection
            }
        });
    },

    targetSelectionChange: function(selectionModel, selected) {
        var me = this;
        var btn_delete = Ext.ComponentQuery.query('admin_inventory_grid[name=target_grid] button[action=deleteSelection]')[0];
        var true_select = selected;
        //有时会拖到一个空行下来，变成选中一个空行，导致判断出错，所以再过滤一下
        if (true_select.length > 0 && selected[0].internalId === undefined) {
            true_select = selected.slice(1);
        }
        if (true_select.length > 0) {
            btn_delete.enable();
        } else {
            btn_delete.disable();
        }
        me.checkTargetGrid();
    },
    /**
     * 检查目标表格里有无数据，以确定“申请领用”“申请租借”“申请售出”“归还”的按钮可用/不可用
     * TODO 好像多调用了一次，要查
     */
    checkTargetGrid: function() {
        var target_grid = this.getTargetGrid();
        var target_data_length = target_grid.getStore().getCount();
        var apply_for_use_button = target_grid.down('button[action=apply_for_use]', false);
        var apply_for_loan_button = target_grid.down('button[action=apply_for_loan]', false);
        var apply_for_sell_button = target_grid.down('button[action=apply_for_sell]', false);
        var apply_for_reject_button = target_grid.down('button[action=apply_for_reject]', false);
        var return_button = target_grid.down('button[action=return]', false);
        var hidden = target_grid.down('hidden[name=admin_inventory_ids]', false);
        var admin_inventory_id_array = Ext.Array.pluck(Ext.Array.pluck(target_grid.getStore().data.items, 'data'), 'id');
        var admin_inventory_state_array = Ext.Array.pluck(Ext.Array.pluck(target_grid.getStore().data.items, 'data'), 'state');
        apply_for_use_button.disable();
        apply_for_loan_button.disable();
        apply_for_sell_button.disable();
        apply_for_reject_button.disable();
        return_button.disable();
        if (target_data_length > 0) {
            if (Ext.Array.unique(admin_inventory_state_array).toString() === 'b_stocking') {
                //全是“库存中”则可以“申请领用”“申请租借”“申请售出”“申请退货”
                apply_for_use_button.enable();
                apply_for_loan_button.enable();
                apply_for_sell_button.enable();
                apply_for_reject_button.enable();
            } else if (Ext.Array.unique(admin_inventory_state_array).toString() === 'h_loaned') {
                //全是“租借中”则可以“申请售出”
                apply_for_sell_button.enable();
            }
            if (Ext.Array.unique(admin_inventory_state_array).indexOf('b_stocking') === -1) {
                //没有“库存中”则可以“归还”
                return_button.enable();
            }

        }
        hidden.setValue(admin_inventory_id_array.join("|"));
    },

    /**
     * 检查是否选中某条数据，以决定能否“报损”、“报废”、“充抵”等操作
     */
    sourceSelectionChange: function() {
        //        console.log();
        var source_grid = this.getSourceGrid();
        var selection = source_grid.getSelectedItems();
        var damage_button = source_grid.down('button[action=damage]', false);
        var scrap_button = source_grid.down('button[action=scrap]', false);
        var charge_button = source_grid.down('button[action=charge]', false);
        var exchange_unit_button = source_grid.down('button[action=exchange_unit]', false);
        var change_location_button = source_grid.down('button[action=change_location]', false);
        var change_ownership_button = source_grid.down('button[action=change_ownership]', false);
        var fix_button = source_grid.down('button[action=fix]', false);
        var modify_button = source_grid.down('button[action=modify]', false);

        if (selection.length === 1 && selection[0].get('state') === 'b_stocking') {
            damage_button.enable();
            scrap_button.enable();
            charge_button.enable();
            exchange_unit_button.enable();
            change_location_button.enable();
            change_ownership_button.enable();
            modify_button.enable();
        } else {
            damage_button.disable();
            scrap_button.disable();
            charge_button.disable();
            exchange_unit_button.disable();
            change_location_button.disable();
            change_ownership_button.disable();
            modify_button.enable();//TODO 将来库存整好了要改回来的
        }
        if (selection.length === 1 && selection[0].get('state') === 'x_damaged') {
            fix_button.enable();
        } else {
            fix_button.disable();
        }
    },

    checkHoldingData: function(node, data) {
        var me = this;
        var holding_data = [];
        for (var i = 0; i < data.records.length; i++) {
            //状态为“库存中”的才算
            //“已领用”、“已租借”的也算，因为可以选归还
            //但这两种情况还要判断保管人是不是自己
            if (data.records[i]['data']['state'] === 'b_stocking' ||
                (data.records[i]['data']['state'] === 'h_loaned' && data.records[i]['data']['keeper>id'] === userId) ||
                (data.records[i]['data']['state'] === 'g_using' && data.records[i]['data']['keeper>id'] === userId)) {
                holding_data.push(data.records[i]);
            }
        }
        var holding_id_array = Ext.Array.pluck(holding_data, 'internalId');

        var temp = {};
        var temp_array = [];
        var target_id_array;

        //如果按住SHIFT，则视为拆分，弹框问分多少
        if (me.shiftStatus === 'pressed') {
            //SHIFT的时候可以拖重复的id
            target_id_array = [];
            for (var i = 0; i < target_id_array.length; i++) {
                temp[target_id_array[i]] = true;
            }
            for (var i = 0; i < holding_id_array.length; i++) {
                if (!temp[holding_id_array[i]]) {
                    temp_array.push(holding_data[i]);
                }
            }
            load_uniq_controller(me, 'admin_inventory.SplitForm');
            var view = Ext.widget('admin_inventory_split_form').show();
            var split_number_field = view.down('[name=split_number]', false);
            split_number_field.setMaxValue(Ext.Array.max(Ext.Array.pluck(Ext.Array.pluck(holding_data, 'data'), 'current_quantity')));
            me.tempDraggedArray = temp_array;
            data.records = [];
            me.isBlocked = true;
        } else {
            var target_grid = Ext.ComponentQuery.query('admin_inventory_grid[name=target_grid]')[0];
            target_id_array = Ext.Array.pluck(target_grid.getStore().data.items, 'internalId');
            for (var i = 0; i < target_id_array.length; i++) {
                temp[target_id_array[i]] = true;
            }
            for (var i = 0; i < holding_id_array.length; i++) {
                if (!temp[holding_id_array[i]]) {
                    temp_array.push(holding_data[i]);
                }
            }
            data.records = temp_array;
            me.isBlocked = false;
            me.checkTargetGrid();
        }
    },

    /**
     * “申请入库”窗口
     */
    popBuyForm: function() {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.ForStockForm');
        var view = Ext.widget('admin_inventory_for_stock_form').show();
        Ext.getStore('GridForStockAdminInventories').removeAll();
        //默认RMB
        //        view.down('[name=buy_price] combo', false).setValue(11);
    },

    /**
     * “操作历史”表格
     */
    popAdminInventoryHistoryForm: function() {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.HistoryForm');
        var view = Ext.widget('admin_inventory_history_form').show();
        //        Ext.getStore('GridAdminInventoryHistories').removeAll();
    },

    /**
     * 选择导出条件的表单
     */
    popExportConditionForm: function() {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.ExportConditionForm');
        var view = Ext.widget('admin_inventory_export_condition_form').show();
    },

    /**
     * “申请领用”
     */
    submit: function(button) {
        var grid = button.up('grid');

        if (grid.getStore().count() === 0) {
            Ext.example.msg("错误", "表格中还没有数据！");
        } else {
            //防双击
            button.disable();

            var grid_data = Ext.encode(Ext.Array.pluck(grid.getStore().data.items, "data"));
            Ext.Ajax.request({
                url: 'admin_inventories/save_admin_inventory',
                params: {
                    "event": "apply_for_use",
                    "grid_data": grid_data
                },
                success: function(response) {
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    //                    Ext.getStore('GridAdminInventories').load();
                },
                failure: function() {}
            });
        }
    },

    popApplyForUseForm: function() {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.ApplyForUseForm');
        var view = Ext.widget('admin_inventory_apply_for_use_form').show();
    },

    popApplyForLoanForm: function() {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.ApplyForLoanForm');
        var view = Ext.widget('admin_inventory_apply_for_loan_form').show();
    },

    popApplyForSellForm: function() {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.ApplyForSellForm');
        var view = Ext.widget('admin_inventory_apply_for_sell_form').show();
    },

    popApplyForRejectForm: function() {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.ApplyForRejectForm');
        var view = Ext.widget('admin_inventory_apply_for_reject_form').show();
    },

    popReturnForm: function() {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.ForReturnForm');
        var view = Ext.widget('admin_inventory_for_return_form').show();
    },
    //    /**
    //     * “入库”窗口
    //     */
    //    popInStockForm: function() {
    //        var me = this;
    //        load_uniq_controller(me, 'admin_inventory.InStockForm');
    //        var view = Ext.widget('admin_inventory_in_stock_form').show();
    //        //默认RMB
    //        view.down('[name=buy_price] combo', false).setValue(11);
    //        //默认东隆
    //        var owner_field = view.down('expandable_vendor_unit_combo combo', false);
    //        owner_field.getStore().loadData([[42, 'ETSC Technologies Co.(东隆科技有限公司)']]);
    //        owner_field.setValue(42);
    //    },

    /**
     * “出库”窗口
     */
    popOutStockForm: function() {
        var me = this;
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        var target_array = [];
        //        console.log(selection);
        //        console.log(selection.get('number'));
        if (!Ext.isEmpty(selection.get('number'))) {
            Ext.Array.each(selection.get('number').split('、'), function(item, index) {
                target_array.push({
                    id: index,
                    name: item
                });
            });
        }
        load_uniq_controller(me, 'admin_inventory.OutStockForm');
        var view = Ext.widget('admin_inventory_out_stock_form').show();
        var outstock_number_field = view.down('[name=outstock_numbers]', false);
        view.down('[name=id]', false).setValue(selection.get('id'));
        outstock_number_field.getStore().loadData(target_array);
        //最大出库数量不能超过基数
        var current_quantity = selection.get('current_quantity');
        view.down('[name=outstock_count]', false).setMaxValue(current_quantity);
    },

    /**
     * “报损”、“报废”等一堆合并了的窗口
     * @param button
     */
    popDamageScrapChargeForm: function(button) {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.DamageScrapChargeForm');
        var grid = me.getSourceGrid();
        var selection = grid.getSelectedItem();
        //        console.log(grid);
        //        console.log(grid.getSelectedAdminInventory());

        var form = Ext.widget('admin_inventory_damage_scrap_charge_form');
        form.show('', function() {
            //            console.log(button.action);
            //            console.log(form.title);
            var ownership_field = form.down('expandable_vendor_unit_combo combo', false);
            ownership_field.getStore().loadData([
                [selection.get('ownership'), selection.get('ownership_name')]
            ]);
            ownership_field.setValue(selection.get('ownership'));

            //            var vendor_unit_field = form.down('expandable_vendor_unit_combo combo', false);
            //            vendor_unit_field.getStore().loadData([[selection.get('vendor_unit_id'), selection.get('vendor_unit_name')]]);
            //            vendor_unit_field.setValue(selection.get('vendor_unit_id'));
            switch (button.action) {
                case "damage":
                    form.setTitle("报损");
                    form.down('[name=keep_at]', false).hide();
                    form.down('expandable_vendor_unit_combo', false).hide();
                    me.hideAllButton();
                    form.down('[action=save_damage]', false).show();
                    return false;
                case "scrap":
                    form.setTitle("报废");
                    form.down('[name=keep_at]', false).hide();
                    form.down('expandable_vendor_unit_combo', false).hide();
                    me.hideAllButton();
                    form.down('[action=save_scrap]', false).show();
                    return false;
                case "charge":
                    form.setTitle("充抵");
                    form.down('[name=keep_at]', false).hide();
                    form.down('[name=outstock_count]', false).setMinValue('-9999.99');
                    form.down('expandable_vendor_unit_combo', false).hide();
                    me.hideAllButton();
                    form.down('[action=save_charge]', false).show();
                    return false;
                case "change_location":
                    form.setTitle("变更存放地点");
                    form.down('expandable_vendor_unit_combo', false).hide();
                    me.hideAllButton();
                    form.down('[action=save_change_location]', false).show();
                    return false;
                case "change_ownership":
                    form.setTitle("变更所有权");
                    //                    form.setHeight(204);
                    form.down('[name=keep_at]', false).hide();
                    me.hideAllButton();
                    form.down('[text=+]', false).show();
                    form.down('[action=save_change_ownership]', false).show();
                    return false;
                default:
            }
        });
        var number_array = selection.get('number').split("、");
        var sn_array = selection.get('sn').split(",");
        var combine_array = [];
        //        var id_field = selection.down('[name=id]', false);
        //        id_field.setValue(record.get('id'));
        var loop_array = (number_array.length > sn_array.length ? number_array : sn_array)
        Ext.Array.each(loop_array, function(item, index) {
            var display = [];
            if (!Ext.isEmpty(number_array[index])) display.push("资产编号：" + number_array[index]);
            if (!Ext.isEmpty(sn_array[index])) display.push("序列号：" + sn_array[index]);
            combine_array[index] = [index, display.join(" ")];
        });
        var number_field = form.down('combo[name=outstock_numbers]', false);
        if (combine_array[0][1] != "") {
            number_field.getStore().loadData(combine_array);
        }

        //最大操作数量不能超过基数
        var current_quantity = selection.get('current_quantity');
        form.down('[name=outstock_count]', false).setMaxValue(current_quantity);
        form.down('[name=id]', false).setValue(selection.get('id'));
    },

    popFixForm: function(button) {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.FixForm');
        var grid = me.getSourceGrid();
        var selection = grid.getSelectedItem();

        var form = Ext.widget('admin_inventory_fix_form');
        form.show('', function() {

        });
        var number_array = selection.get('number').split("、");
        var sn_array = selection.get('sn').split(",");
        var combine_array = [];
        var loop_array = (number_array.length > sn_array.length ? number_array : sn_array)
        Ext.Array.each(loop_array, function(item, index) {
            var display = [];
            if (!Ext.isEmpty(number_array[index])) display.push("资产编号：" + number_array[index]);
            if (!Ext.isEmpty(sn_array[index])) display.push("序列号：" + sn_array[index]);
            combine_array[index] = [index, display.join(" ")];
        });
        var number_field = form.down('combo[name=outstock_numbers]', false);
        if (combine_array[0][1] != "") {
            number_field.getStore().loadData(combine_array);
        }

        //最大操作数量不能超过基数
        var current_quantity = selection.get('current_quantity');
        form.down('[name=outstock_count]', false).setMaxValue(current_quantity);
        form.down('[name=id]', false).setValue(selection.get('id'));
    },

    popModifyForm: function() {
        var me = this;
        var record = this.getSourceGrid().getSelectedItem();
        load_uniq_controller(me, 'admin_inventory.ModifyForm');
        var view = Ext.widget('admin_inventory_modify_form').show();
        view.down('form', false).loadRecord(record);
        //给combo做一个假的store以正确显示值
        var inventory_type_field = view.down('[name=inventory_type]', false);
        inventory_type_field.getStore().loadData([
            [record.get('material_code>id'), record.get('material_code>(name|code|description)')]
        ]);
        inventory_type_field.setValue(record.get('material_code>id'));

        view.down('[name=inventory_level]', false).setValue(record.get('inventory_level') + "");
    },

    /**
     * 隐藏此form下的所有有action的button
     * @param form
     */
    hideAllButton: function() {
        var button_array = Ext.ComponentQuery.query('admin_inventory_damage_scrap_charge_form button[action!=\'\']');
        Ext.Array.each(button_array, function(item) {
            item.hide();
        });
    },

    /**
     * “单位换算”窗口
     */
    popExchangeUnitForm: function() {
        var me = this;
        load_uniq_controller(me, 'admin_inventory.ExchangeUnitForm');
        var view = Ext.widget('admin_inventory_exchange_unit_form').show();
        var grid = me.getSourceGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=id]', false).setValue(selection.get('id'));
        view.down('[name=exchange_unit_old_count]', false).setValue(selection.get('current_quantity'));
        view.down('[name=exchange_unit_old_unit]', false).setValue(selection.get('count_unit'));
        view.down('[name=exchange_unit_old_rmb]', false).setValue(selection.get('rmb'));
    },

    deleteSelection: function(button) {
        var me = this;
        var grid = button.up('grid');
        var se = grid.getSelectionModel().getSelection();
        grid.getStore().remove(se);
        me.checkTargetGrid();
    }
});