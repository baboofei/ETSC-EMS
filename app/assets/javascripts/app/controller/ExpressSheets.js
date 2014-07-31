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
            'express_sheet_complex_form': {
                beforeclose: this.checkPrintFlag
            },
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

    /**
     * 如果已经打印过了，则不能直接关闭，要填完单号才能关闭
     * @param win
     * @return {Boolean}
     */
    checkPrintFlag: function(win) {
        var print_flag_field = win.down('[name=print_flag]', false);
        if(print_flag_field.getValue() != "false") {
            Ext.example.msg("错误", "请点击“完成”来关闭此窗口！")
            return false;
        }
    },

    enableExpressButton: function(combo) {
        var form = combo.up('form');
        var express_combo = form.down('[name=express_id]', false);
        var our_company_combo = form.down('[name=our_company_id]', false);
        if (!Ext.isEmpty(express_combo.getValue()) && !Ext.isEmpty(our_company_combo.getValue())) {
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
                receiver_ids: Ext.Array.map(grid.getStore().data.items, function(item) {
                    return item.get("receiver_id");
                }).join("|"),
                receiver_type: values['receiver_type'],
                express_id: values['express_id'],
                our_company_id: values['our_company_id']
            },
            success: function(response) {
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg['timestamp']);
                //返回的pdf文件名存到hidden里备用
                form.down('[name=timestamp]', false).setValue(msg['timestamp']);
                //同时给hidden_flag赋值，表示“已经打印过了”
                form.down('[name=print_flag]', false).setValue('true');
            },
            failure: function() {
                Ext.Msg.alert('错误', '可能是网络问题，请找Terry处理');
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

        if (form.form.isValid()) {
            var record = Ext.ComponentQuery.query("[name=temp_express_people_grid]")[0].getSelectionModel().getSelection()[0];
            record.set(values);
            win.close();
        }
    },

    saveExpress: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var grid = form.down('grid', false);

        if (Ext.isEmpty(form.down('[name=timestamp]', false).getValue())) {
            Ext.example.msg('错误', '你还没打印呢！');
            return false;
        }
        if (Ext.Array.unique(Ext.Array.map(Ext.getStore("TempGridExpressPeople").data.items, function(item) {
            return item.get("tracking_number");
        }))[0] === "") {
            Ext.example.msg('错误', '请填写每个收件人的快递单号！');
            return false;
        }

        if (form.form.isValid()) {
            var grid_data = Ext.encode(Ext.pluck(grid.getStore().data.items, "data"));;
            form.submit({
                url: 'express_sheets/add_from_grid',
                params: {
                    "grid_data": grid_data
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    win.close();
                    Ext.example.msg('成功', msg.message);
//                    Ext.getStore('Contracts').load();
                },
                failure: function() {
                    Ext.Msg.alert('错误', '可能是网络问题，请找Terry处理');
                }
            });
        }
    },

    addExpressCost: function(view, record) {
        console.log(record.get('editable'));
        if (record.get('editable')) {
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