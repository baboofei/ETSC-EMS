/**
 * 打印页面上的controller
 */
Ext.define('EIM.controller.ExpressSheets', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridExpressSheets',
        'TempGridExpressPeople'
//        'dict.Applications',
//        'dict.Areas',
//        'ComboOurCompanies'
    ],
    models: [
//        'ExpressCustomer',
//        'dict.Application',
//        'dict.Area',
        'GridExpressSheet',
        'TempGridExpressPerson'
    ],

    views: [
        'express_sheet.Panel',
        'express_sheet.Grid',
        'express_sheet.SearchGrid',
        'express_sheet.SinglePersonForm',
        'express_sheet.CostForm'
    ],

    init: function() {
        var me = this;
        me.control({
//            'express_sheet_search_grid[name=source_grid]': {
//                beforeselect: this.filterDrag
//            },
//            'express_sheet_search_grid[name=source_grid] > gridview': {
//            },
//            'express_sheet_search_grid[name=target_grid]': {
//                selectionchange: this.selectionChange
//            },
//            'button[action=deleteSelection]': {
//                click: this.deleteSelection
//            },
//            'express_sheet_simple_form button[action=printExpressSheet]': {
//                click: this.printExpressSheet
//            },
            'express_sheet_complex_form combo[name=express_id]': {
                select: this.enableExpressButton
            },
            'express_sheet_complex_form combo[name=our_company_id]': {
                select: this.enableExpressButton
            },
            'express_sheet_complex_form button[action=grid_print]': {
                click: this.gridPrintExpressSheet
            },
            'express_sheet_complex_form grid': {
                itemdblclick: this.editTempExpressPerson
            },
            'express_sheet_single_person_form button[action=save]': {
                click: this.updateTempExpressPerson
            },
            'express_sheet_complex_form button[action=complete_print]': {
                click: this.saveExpress
            },
            'express_sheet_grid': {
                itemdblclick: this.addExpressCost
            },
            'express_sheet_cost_form button[action=save]': {
                click: this.updateExpressCost
            }
        });
    },

//    /**
//     * 选择的时候过滤一下，如果下面store里已经有了就不让选，避免拖拽的时候产生ID重复的问题
//     * 如果地址为空也不让选，避免打印没地址
//     * @param rowModel
//     * @param record
//     * @param index
//     * @param eOpts
//     * @return {Boolean}
//     */
//    filterDrag: function(rowModel, record, index, eOpts) {
//        var target_grid = Ext.ComponentQuery.query('express_sheet_search_grid[name=target_grid]')[0];
//        var target_id_array = Ext.Array.pluck(target_grid.getStore().data.items, 'internalId');
//
//        for(var i = 0; i < target_id_array.length; i ++) {
//            if(record.get('id') === target_id_array[i] || Ext.isEmpty(record.get('addr'))) {
//                return false;
//            }
//        }
//        if(Ext.isEmpty(record.get('addr'))) {
//            return false;
//        }
//    },
//
//    selectionChange: function(selectionModel, selected, eOpts) {
//        var btn_delete = Ext.ComponentQuery.query('express_sheet_panel button[action=deleteSelection]')[0];
//        if(selected.length > 0) {
//            btn_delete.enable();
//        }else{
//            btn_delete.disable();
//        }
//    },
//
//    deleteSelection: function(button) {
//        var grid = button.up('grid');
//        var se = grid.getSelectionModel().getSelection();
//        grid.getStore().remove(se);
//    },
//
//    printExpressSheet: function(button) {
//        var win = button.up('window');
//        var form = win.down('form', false);
//        if(form.form.isValid()) {
//            button.disable();
//            Ext.Msg.alert('好了', '去拿单子吧', function() {
//                button.enable();
//            });
//            form.submit({
//                url: 'express_sheets/print_express_sheet'
//            });
//        }
//
////        var grid = form.up('panel').down('[name=target_grid]', false);
////        var target_customer_ids = Ext.Array.pluck(Ext.Array.pluck(grid.getStore().data.items, "data"), "id");
////        var target_customer_ids_str = target_customer_ids.join("|");
////
////        var express_id = form.down('[name=express_id]', false).getValue();
////        var our_company_id = form.down('[name=our_company_id]', false).getValue();
////
////        if(target_customer_ids.length === 0){
////            Ext.example.msg("错误", "表格中还没有数据！");
////        }else{
////            if(form.form.isValid()) {
////                button.disable();
////                Ext.Msg.alert('好了', '去拿单子吧', function() {
////                    button.enable();
////                });
////                Ext.Ajax.request({
////                    url:'servlet/ExpressPrintServlet',
////                    params: {
////                        customer_ids: target_customer_ids_str,
////                        express_id: express_id,
////                        our_company_id: our_company_id
////                    },
////                    success: function(response) {
////
////                    },
////                    failure: function() {
////
////                    }
////                });
////            }
////        }
//    },
//
    enableExpressButton: function(combo) {
        var form = combo.up('form');
        var express_combo = form.down('[name=express_id]', false);
        var our_company_combo = form.down('[name=our_company_id]', false);
        if(!Ext.isEmpty(express_combo.getValue()) && !Ext.isEmpty(our_company_combo.getValue())) {
            var button = form.down('button[action=grid_print]', false);
            button.enable();
        }
    },

    gridPrintExpressSheet: function(button) {
        var form = button.up('form');
        var values = form.getValues();
        var grid = form.down('grid', false);
        button.disable();
        Ext.Msg.alert('好了', '去拿单子吧', function() {
            button.enable();
        });
        Ext.Ajax.request({
            url: 'express_sheets/updated_print_express_sheet',
            params: {
                receiver_ids: Ext.Array.map(grid.getStore().data.items, function(item) {return item.get("receiver_id");}).join("|"),
                receiver_type: values['receiver_type'],
                express_id: values['express_id'],
                our_company_id: values['our_company_id']
            },
            success: function(response) {
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg['timestamp']);
                //返回的pdf文件名存到hidden里备用
                form.down('[name=timestamp]', false).setValue(msg['timestamp']);
            },
            failure: function() {
                Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
            }
        });
    },

    editTempExpressPerson: function(view, record) {
        var view = Ext.widget('express_sheet_single_person_form').show();
        view.down('form', false).loadRecord(record);
    },

    updateTempExpressPerson: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var values = form.getValues();

        if(form.form.isValid()) {
            var record = Ext.ComponentQuery.query("[name=temp_express_people_grid]")[0].getSelectionModel().getSelection()[0];
            record.set(values);
            win.close();
        }
    },

    saveExpress: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var grid = form.down('grid', false);

        if(Ext.isEmpty(form.down('[name=timestamp]', false).getValue())) {
            Ext.example.msg('错误', '你还没打印呢！');
            return false;
        }
        if(Ext.Array.unique(Ext.Array.map(Ext.getStore("TempGridExpressPeople").data.items, function(item) {return item.get("tracking_number");}))[0] === "") {
            Ext.example.msg('错误', '请填写每个收件人的快递单号！');
            return false;
        }

        if(form.form.isValid()) {
            var grid_data = Ext.encode(Ext.pluck(grid.getStore().data.items, "data"));;
            form.submit({
                url: 'express_sheets/add_from_grid',
                params: {
                    "grid_data": grid_data
                },
                submitEmptyText:false,
                success: function(the_form, action){
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    win.close();
                    Ext.example.msg('成功', msg.message);
//                    Ext.getStore('Contracts').load();
                },
                failure: function() {
                    Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                }
            });
        }
    },

    addExpressCost: function(view, record) {
        console.log(record.get('editable'));
        if(record.get('editable')) {
        var view = Ext.widget('express_sheet_cost_form').show();
//        view.down('form', false).loadRecord(record);
        view.down('combo').setValue(11);
        }
    },

    updateExpressCost: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
//        console.log(form.isValid());
        form.submit({
            url: "express_sheets/update_cost",
            params: {
                express_sheet_id: Ext.ComponentQuery.query('express_sheet_grid')[0].getSelectedItem().get("id")
            },
            submitEmptyText: false,
            success: function(the_form, action) {
                var response = action.response;
                var msg = Ext.decode(response.responseText);
                win.close();
                Ext.example.msg('成功', msg.message);
                Ext.getStore('GridExpressSheets').load();
            }
        });
    }
});