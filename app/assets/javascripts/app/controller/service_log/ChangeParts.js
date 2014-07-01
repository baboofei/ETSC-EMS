Ext.define('EIM.controller.service_log.ChangeParts', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridMiniAdminInventories',
        'GridCopyMiniAdminInventories'
    ],
    models: [
        'GridAdminInventory'
    ],

    views: [
//        'admin_inventory.Panel',
        'admin_inventory.MiniGrid',
        'service_log.ChangePartsForm'/*,
        'service_log.SelectInsertLocationForm'*/
//        'salelog.QuoteTab',
//        'salelog.QuotedItemGrid',
//        'salelog.NewQuoteForm',
//        'salelog.QuoteItemForm'
    ],

    refs: [
        {
            ref: 'sourceGrid',
            selector: 'admin_inventory_mini_grid[name=source_grid]'
        },
        {
            ref: 'targetGrid',
            selector: 'admin_inventory_mini_grid[name=target_grid]'
        }
    ],

    shiftStatus: 'released',
    isBlocked: false,
    tempDraggedArray: [],

    init: function() {
        var me = this;

        me.control({
            'admin_inventory_mini_grid[name=target_grid]': {
                selectionchange: this.targetSelectionChange
            },
            'admin_inventory_mini_grid[name=source_grid]': {
//                selectionchange: this.sourceSelectionChange,
                render: function() {
                    new Ext.util.KeyMap(Ext.getBody(), [
                        {
                            key: Ext.EventObject.SHIFT,
                            fn: function(){ me.shiftStatus = 'pressed'; }
                        }
                    ], 'keydown');
                    new Ext.util.KeyMap(Ext.getBody(), [
                        {
                            key: Ext.EventObject.SHIFT,
                            fn: function(){ me.shiftStatus = 'released'; }
                        }
                    ], 'keyup');
                }
            },
            'admin_inventory_mini_grid[name=target_grid] dataview': {
                beforedrop: this.checkHoldingData
            },
            'admin_inventory_mini_grid[name=target_grid] button[action=deleteSelection]': {
                click: this.deleteSelection
            },
            'service_log_change_parts_form button[action=save]': {
                click: this.submit
            }
        });
    },

    targetSelectionChange: function(selectionModel, selected) {
        var me = this;
        var btn_delete = Ext.ComponentQuery.query('admin_inventory_mini_grid[name=target_grid] button[action=deleteSelection]')[0];
        var true_select = selected;
        //有时会拖到一个空行下来，变成选中一个空行，导致判断出错，所以再过滤一下
        if(true_select.length > 0 && selected[0].internalId === undefined) {
            true_select = selected.slice(1);
        }
        if(true_select.length > 0) {
            btn_delete.enable();
        }else{
            btn_delete.disable();
        }
    },

    checkHoldingData: function(node, data) {
        var me = this;
        var holding_data = [];
        for(var i = 0; i < data.records.length; i++) {
            //状态为“库存中”的才算
            if(data.records[i]['data']['state'] === 'b_stocking') {
                holding_data.push(data.records[i]);
            }
        }
        var holding_id_array = Ext.Array.pluck(holding_data, 'internalId');

        var temp = {};
        var temp_array = [];
        var target_id_array;

        //如果按住SHIFT，则视为拆分，弹框问分多少
        if(me.shiftStatus === 'pressed') {
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
            load_uniq_controller(me, 'admin_inventory.MiniSplitForm');
            var view = Ext.widget('admin_inventory_mini_split_form').show();
            var split_number_field = view.down('[name=split_number]', false);
            split_number_field.setMaxValue(Ext.Array.max(Ext.Array.pluck(Ext.Array.pluck(holding_data, 'data'), 'current_quantity')));
            me.tempDraggedArray = temp_array;
            data.records = [];
            me.isBlocked = true;
        } else {
            var target_grid = Ext.ComponentQuery.query('admin_inventory_mini_grid[name=target_grid]')[0];
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
        var dragged_items_grid = form.down('admin_inventory_mini_grid[name=target_grid]', false);
        var item_grid_data = Ext.encode(Ext.pluck(dragged_items_grid.getStore().data.items, "data"));

        if(dragged_items_grid.getStore().count() === 0) {
            Ext.example.msg("错误", "表格中还没有数据！");
        } else {
            //防双击
            button.disable();
            //提交的同时把表格内容“备份”一个，因为此提交操作的特殊性
            Ext.ComponentQuery.query('functree')[0].serviceLogCache = {"change_parts": item_grid_data};

            form.submit({
                url: 'service_logs/add_service_log',
                params: {
                    "type": "change_parts",
                    "item_grid_data": item_grid_data
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);

                    var grid = Ext.ComponentQuery.query('flow_sheet_grid')[0];
                    var last_selected = grid.getSelectedItem();
                    grid.getStore().load({
                        callback: function() {
                            var rowIndex = this.find('id', last_selected.getId(), 0, false, false, true);
                            grid.getView().select(rowIndex);
                        }
                    });
                },
                failure: function(the_form, action) {
                    //TODO 可以用Ext.JSON.decode()来写，有空改
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);

                    var dup_log_list_array = msg['dup_log_list'].substring(1, msg['dup_log_list'].length - 1).split("}, {");
                    var dup_log_list_obj_array = [];
                    Ext.Array.each(dup_log_list_array, function(item, index, array) {
                        var str = item.replace("{", "").replace("}", "");
                        var dup_log_info_array = str.split(", ");
                        var dup_log_info_obj = {};
                        Ext.Array.each(dup_log_info_array, function(info_item) {
                            //                            console.log(info_item);
                            var info_str = info_item.replace(/"/g, "");
                            dup_log_info_obj[info_str.split("=>")[0]] = info_str.split("=>")[1].replace(/"/g, "");
                        });
                        dup_log_list_obj_array.push(dup_log_info_obj);
                    });


                    var to_be_inserted_array = msg['to_be_inserted'].split(", ");
                    var to_be_inserted_obj = {};
                    Ext.Array.each(to_be_inserted_array, function(item, index, array) {
                        var str = item.replace("{", "").replace("}", "").replace(/"/g, "").replace(/:/, "");
                        to_be_inserted_obj[str.split("=>")[0]] = str.split("=>")[1];
                    });
                    //                    console.log(to_be_inserted_obj);
                    load_uniq_controller(me, 'service_log.SelectInsertLocationForm');
                    Ext.widget('service_log_select_insert_location_form').show('', function() {
                        //                        console.log(Ext.ComponentQuery.query('grid[name=to_be_inserted]')[0]);
                        //                        console.log(Ext.ComponentQuery.query('grid[name=to_be_inserted]')[0].getStore());
                        Ext.ComponentQuery.query('grid[name=to_be_inserted]')[0].getStore().loadData([to_be_inserted_obj]);
                        Ext.ComponentQuery.query('grid[name=insert_location]')[0].getStore().loadData(dup_log_list_obj_array);
                    });
                }
            });
        }
    }
});