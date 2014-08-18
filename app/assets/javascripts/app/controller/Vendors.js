Ext.define('EIM.controller.Vendors', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridVendors',
        'ComboVendorUnits',
        'EmptyGridVendors'
        //        'dict.Applications'
        //        'GridVendors'
    ],
    models: [
        'GridVendor',
        'ComboVendorUnit'
        //        'dict.Application'
        //        'GridVendor'
    ],

    views: [
        'vendor.Panel',
        'vendor.Grid',
        'vendor.Form',
        'vendor.MiniAddForm'
        /*,
        'express_sheet.Form'*/
        //        'vendor.Grid',
        //        'vendor.Detail',
        //        'vendor.VendorInfoForm',
        //        'vendor.VendorPriceForm',
        //        'vendor.VendorDescriptionForm'
    ],

    refs: [{
        ref: 'sourceGrid',
        selector: 'vendor_grid[name=source_grid]'
    }, {
        ref: 'targetGrid',
        selector: 'vendor_grid[name=target_grid]'
    }, {
        ref: 'form',
        selector: 'vendor_mini_add_form'
    }],

    init: function() {
        var me = this;
        me.control({
            //            '[allowPrivilege=true]': {
            //                click: this.editVendor
            //            },
            'vendor_grid[name=target_grid]': {
                selectionchange: this.targetSelectionChange
            },
            'vendor_grid[name=target_grid] dataview': {
                beforedrop: this.checkHoldingData
            },
            'vendor_grid[name=source_grid]': {
                itemdblclick: this.editVendor,
                selectionchange: this.sourceSelectionChange
            },
            'vendor_grid button[action=addVendor]': {
                click: this.addVendor
            },
            'vendor_grid button[action=deleteSelection]': {
                click: this.deleteSelection
            },
            'vendor_form button[action=save]': {
                click: this.saveVendor
            },
            'vendor_mini_add_form button[action=save]': {
                click: this.miniSaveVendor
            }
        });
    },

    editVendor: function(button) {
        var me = this;
        var form = button.up('form');
        if (form.form.isValid()) {
            form.submit({
                url: 'vendors/save_vendor',
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    var grid = me.getGrid();
                    var last_selected = grid.getSelectedItem();
                    Ext.getStore('GridVendors').load({
                        callback: function() {
                            var rowIndex = this.find('id', last_selected.getId());
                            grid.getView().select(rowIndex);
                        }
                    });
                },
                failure: function() {

                }
            });
        }
    },

    saveAsNewVendor: function(button) {
        var panel = button.up('panel');
        var info_form = panel.down('vendor_info_form', false);
        var price_form = panel.down('vendor_price_form', false);
        var description_form = panel.down('vendor_description_form', false);
        var submit_params = Ext.Object.merge(
            info_form.getValues(),
            price_form.getValues(),
            description_form.getValues()
        );
        submit_params['producer_vendor_unit_id'] = panel.down('[name=producer>(name|short_name|short_code|en_name)] combo', false).getValue();
        submit_params['seller_vendor_unit_id'] = panel.down('[name=seller>(name|short_name|short_code|en_name)] combo', false).getValue();
        if (info_form.form.isValid() && price_form.form.isValid() && description_form.form.isValid()) {
            //防双击
            button.disable();
            info_form.submit({
                url: 'vendors/save_as_new_vendor',
                params: submit_params,
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridVendors').load();
                    button.enable();
                }
            });
        }
    },

    targetSelectionChange: function(selectionModel, selected) {
        var me = this;
        var btn_delete = Ext.ComponentQuery.query('vendor_grid[name=target_grid] button[action=deleteSelection]')[0];
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
     * 检查目标表格里有无数据，以确定“打印”按钮可用/不可用
     */
    checkTargetGrid: function() {
        var target_grid = this.getTargetGrid();
        var target_data_length = target_grid.getStore().getCount();
        var print_button = target_grid.down('button[action=selectExpress]', false);
        var hidden = target_grid.down('hidden[name=vendor_ids]', false);
        var vendor_id_array = Ext.Array.pluck(Ext.Array.pluck(target_grid.getStore().data.items, 'data'), 'id');
        if (target_data_length > 0) {
            print_button.enable();
        } else {
            print_button.disable();
        }
        hidden.setValue(vendor_id_array.join("|"));
    },

    /**
     * 选择的时候过滤一下，如果下面store里已经有了就不让选，避免拖拽的时候产生ID重复的问题
     * 如果地址为空也不让选，避免打印没地址
     * 用了略微高效一点的方法
     * @param node
     * @param data
     */
    checkHoldingData: function(node, data) {
        var holding_data = [];
        for (var i = 0; i < data.records.length; i++) {
            //地址不为空的才算数
            if (!Ext.isEmpty(data.records[i]['data']['addr'])) {
                holding_data.push(data.records[i]);
            }
        }
        var holding_id_array = Ext.Array.pluck(holding_data, 'internalId');

        var target_grid = Ext.ComponentQuery.query('vendor_grid[name=target_grid]')[0];
        var target_id_array = Ext.Array.pluck(target_grid.getStore().data.items, 'internalId');

        var temp = {};
        var temp_array = [];
        for (var i = 0; i < target_id_array.length; i++) {
            temp[target_id_array[i]] = true;
        }
        for (var i = 0; i < holding_id_array.length; i++) {
            if (!temp[holding_id_array[i]]) {
                temp_array.push(holding_data[i]);
            }
        }
        data.records = temp_array;
    },

    editVendor: function(view, record) {
        if (record.get('editable')) {
            //            var record = this.getSourceGrid().getSelectedVendor();
            var view = Ext.widget('vendor_form').show();
            view.down('form', false).loadRecord(record);
            //给combo做一个假的store以正确显示值
            var vendor_unit_field = view.down('[name=vendor_unit_id]', false);
            vendor_unit_field.getStore().loadData([
                [record.get('vendor_unit>id'), record.get('vendor_unit>(name|en_name|unit_aliases>unit_alias|short_code)')]
            ]);
            vendor_unit_field.setValue(record.get('vendor_unit>id'));
        }
    },

    sourceSelectionChange: function(selectionModel, selected) {
        //        var grid = this.getSourceGrid();
        //        var btn_share = grid.down('button[action=shareCustomer]', false);
        //        var btn_trans = grid.down('button[action=transferCustomer]', false);
        //        if(selected.length > 0) {
        //            btn_share.enable();
        //            btn_trans.enable();
        //            Ext.Array.each(selected, function(item) {
        //                //                console.log(item.get('editable'));
        //                if(!item.get('editable')) {
        //                    btn_share.disable();
        //                    btn_trans.disable();
        //                    return false;
        //                }
        //            });
        //        }else{
        //            btn_share.disable();
        //            btn_trans.disable();
        //        }
    },

    addVendor: function() {
        Ext.widget('vendor_form').show();
    },

    deleteSelection: function(button) {
        var me = this;
        var grid = button.up('grid');
        var se = grid.getSelectionModel().getSelection();
        grid.getStore().remove(se);
        me.checkTargetGrid();
    },

    saveVendor: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        if (Ext.isEmpty(form.down('[name=email]', false).getValue()) &&
            Ext.isEmpty(form.down('[name=mobile]', false).getValue()) &&
            Ext.isEmpty(form.down('[name=phone]', false).getValue())) {
            Ext.example.msg('不行', EIM_multi_field_invalid + '<br />“电子邮件”、“移动电话”、“固定电话”一个都没填呢！');
            form.down('[name=email]', false).markInvalid('这三项至少得填一项啊！');
            form.down('[name=mobile]', false).markInvalid('这三项至少得填一项啊！');
            form.down('[name=phone]', false).markInvalid('这三项至少得填一项啊！');
            return false;
        }

        if (form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: "vendors/save_vendor",
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    var target_by_id = form.down('[name=source_element_id]', false).getValue();
                    //如果是从小加号来的窗口(也就是source_element_id的值不为空)，则把值回填到小加号前面的combo里
                    if (!Ext.isEmpty(target_by_id)) {
                        var target = Ext.getCmp(target_by_id);
                        var target_combo = target.up('container').down("combo", false);
                        target_combo.store.load({
                            callback: function(records, operation, success) {
                                target_combo.select(msg['id']);
                            }
                        });
                    }
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridVendors').load();
                }
            });
        }
    },

    miniSaveVendor: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var vendor_unit_id = form.down('[name=vendor_unit_id] textfield', false);
        if (form.form.isValid() &&
            (vendor_unit_id.getValue() != vendor_unit_id.getRawValue())) {
            //防双击
            button.disable();
            form.submit({
                url: "vendors/save_vendor_mini",
                submitEmptyText: false,
                success: function(the_form, action) {
                    //TODO
                    //现在没有把新填的选上，死活有BUG的样子。以后再加吧……
                    //                    console.log(form.down('[name=source_element_id]', false));
                    //                    console.log(form.items.items);
                    //                    console.log("C");
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    //                    var target_by_id = form.down('[name=source_element_id]', false).getValue();
                    //                    //如果是从小加号来的窗口(也就是source_element_id的值不为空)，则把值回填到小加号前面的combo里
                    //                    if(!Ext.isEmpty(target_by_id)) {
                    //                        var target = Ext.getCmp(target_by_id);
                    //                        var target_combo = target.up('container').down("combo", false);
                    //                        target_combo.store.load({
                    //                            callback: function(records, operation, success) {
                    //                                target_combo.select(msg['id']);
                    //                                console.log(msg['id']);
                    //                            }
                    //                        });
                    //                    }
                    win.close();
                    Ext.example.msg('成功', msg.message);
                }
            });
            win.close();
        }
    }
});