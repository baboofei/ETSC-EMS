Ext.define('EIM.controller.Pops', {
    extend: 'Ext.app.Controller',

    stores: [
        //'MiniPops',
        //        'Pops',
        'GridPops',
        'ComboOurCompanies',
        'ComboUsers',
        'ComboGroups',
        'EmptyGridPops'
    ],
    models: [
        //'MiniPop',
        //        'Pop',
        'GridPop',
        'ComboOurCompany',
        'ComboUser',
        'ComboGroup'
    ],

    views: [
        'pop.Panel',
        'pop.Grid',
        'pop.Form'
        /*,
        'express_sheet.Form'*/
    ],

    refs: [{
        ref: 'sourceGrid',
        selector: 'pop_grid[name=source_grid]'
    }, {
        ref: 'targetGrid',
        selector: 'pop_grid[name=target_grid]'
    }],

    init: function() {
        var me = this;
        me.control({
            'pop_grid[name=target_grid]': {
                selectionchange: this.targetSelectionChange
            },
            'pop_grid[name=target_grid] dataview': {
                beforedrop: this.checkHoldingData
            },
            'pop_grid[name=source_grid]': {
                itemdblclick: this.editPop,
                selectionchange: this.sourceSelectionChange
            },
            'pop_grid button[action=addPop]': {
                click: this.addPop
            },
            'pop_grid button[action=sharePop]': {
                click: this.sharePop
            },
            'pop_grid button[action=transferPop]': {
                click: this.transferPop
            },
            'pop_grid button[action=deleteSelection]': {
                click: this.deleteSelection
            },
            'pop_form [name=email], pop_form [name=phone], pop_form [name=mobile]': {
                focus: this.clearInvalid
            },
            'pop_form combo[name=addr_combo]': {
                select: this.applyAddress
            },
            'pop_form button[action=save]': {
                click: this.savePop
            },
            'pop_share_form button[action=save]': {
                click: this.sharePopSubmit
            },
            'pop_transfer_form button[action=save]': {
                click: this.transPopSubmit
            },
            //            'express_sheet_form button[action=printExpressSheet]': {
            //                click: this.printExpressSheet
            //            },
            'pop_add_to_mini_form button[action=add_to]': {
                click: this.addToMiniPop
            },
            'pop_add_to_mini_form combo[name=pop_id]': {
                select: this.showContact
            }
        });
    },

    targetSelectionChange: function(selectionModel, selected) {
        var me = this;
        var btn_delete = Ext.ComponentQuery.query('pop_grid[name=target_grid] button[action=deleteSelection]')[0];
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
        var hidden = target_grid.down('hidden[name=pop_ids]', false);
        var pop_id_array = Ext.Array.pluck(Ext.Array.pluck(target_grid.getStore().data.items, 'data'), 'id');
        if (target_data_length > 0) {
            print_button.enable();
        } else {
            print_button.disable();
        }
        hidden.setValue(pop_id_array.join("|"));
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

        var target_grid = Ext.ComponentQuery.query('pop_grid[name=target_grid]')[0];
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

    editPop: function(view, record) {
        //            var record = this.getSourceGrid().getSelectedPop();
        var view = Ext.widget('pop_form').show();
        Ext.getStore("dict.Applications").load();
        view.down('form', false).loadRecord(record);
        //给combo做一个假的store以正确显示值
        var pop_unit_field = view.down('[name=pop_unit_id]', false);
        pop_unit_field.getStore().loadData([
            [record.get('pop_unit>id'), record.get('pop_unit>(name|unit_aliases>unit_alias|en_name)')]
        ]);
        pop_unit_field.setValue(record.get('pop_unit>id'));

        if (!record.get('editable')) {
            view.down('button[action=save]', false).hide();
        }
    },

    sourceSelectionChange: function(selectionModel, selected) {},

    addPop: function() {
        Ext.widget('pop_form').show();
        Ext.getStore('dict.Applications').load();
    },

    sharePop: function() {
        var form = Ext.widget('pop_share_form').show();
        //先看所有选中项的already_shared_to是否相同
        var grid = Ext.ComponentQuery.query('pop_panel [name=source_grid]')[0];
        var selection = grid.getSelectionModel().getSelection();
        var already_shared_to_array = Ext.Array.merge(Ext.Array.pluck(Ext.Array.pluck(selection, "data"), "already_shared_to"));
        var integer_array = Ext.Array.map(already_shared_to_array[0].split("|"), function(item) {
            return eval(item);
        });
        if (already_shared_to_array.length === 1) {
            //只有一项，说明全部一样，则在boxselect里显示出来
            form.down('boxselect', false).setValue(integer_array);
        }
    },

    transferPop: function() {
        Ext.widget('pop_transfer_form').show();
    },

    deleteSelection: function(button) {
        var me = this;
        var grid = button.up('grid');
        var se = grid.getSelectionModel().getSelection();
        grid.getStore().remove(se);
        me.checkTargetGrid();
    },

    /**
     * “电子邮件”、“移动电话”、“固定电话”三项，点中任意一项开始填时，清掉invalid的标记
     * @param field
     */
    clearInvalid: function(field) {
        var form = field.up('form');
        form.down('[name=email]', false).clearInvalid();
        form.down('[name=mobile]', false).markInvalid();
        form.down('[name=phone]', false).markInvalid();
    },

    /**
     * 选择一个校区时，把地址赋给后面的地址值
     * @param combo
     * @param records
     */
    applyAddress: function(combo, records) {
        var addr = records[0];
        var addr_field = combo.up('form').down('[name=addr]', false);
        addr_field.setValue(addr.get('address'));
    },

    savePop: function(button) {
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
                url: "pops/save_pop",
                params: {},
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
                    Ext.getStore('GridPops').load();
                }
            });
        }
    },

    sharePopSubmit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var grid = Ext.ComponentQuery.query('pop_panel [name=source_grid]')[0];
        var selection = grid.getSelectionModel().getSelection();
        var pop_ids = Ext.Array.pluck(Ext.Array.pluck(selection, "data"), "id");
        var pop_ids_str = pop_ids.join("|");

        //        console.log()
        if (form.form.isValid()) {
            //防双击
            button.disable();
            //去掉当前用户再提交
            var share_to = Ext.Array.remove(form.down('boxselect', false).getValue(), userId).join("|");

            form.submit({
                url: '/pops/share_to',
                params: {
                    pop_ids: pop_ids_str,
                    share_to: share_to
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridPops').load();
                }
            });
        }
    },

    transPopSubmit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var grid = Ext.ComponentQuery.query('pop_panel [name=source_grid]')[0];
        var selection = grid.getSelectionModel().getSelection();
        var pop_ids = Ext.Array.pluck(Ext.Array.pluck(selection, "data"), "id");
        var pop_ids_str = pop_ids.join("|");

        if (form.form.isValid()) {
            //防双击
            button.disable();

            form.submit({
                url: '/pops/trans_to',
                params: {
                    pop_ids: pop_ids_str
                    /*,
                    user_id: share_to*/
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridPops').load();
                }
            });
        }
    },

    /**
     * 确定打印快递单
     * @param button
     */
    printExpressSheet: function(button) {
        var me = this;
        var win = button.up('window');
        var form = win.down('form', false);
        //        console.log();
        var grid = me.getTargetGrid();
        var target_pop_ids = Ext.Array.pluck(Ext.Array.pluck(grid.getStore().data.items, "data"), "id");
        var target_pop_ids_str = target_pop_ids.join("|");

        var express_id = form.down('[name=express_id]', false).getValue();
        var our_company_id = form.down('[name=our_company_id]', false).getValue();

        if (target_pop_ids.length === 0) {
            Ext.example.msg("错误", "表格中还没有数据！");
        } else {
            if (form.form.isValid()) {
                button.disable();
                Ext.Msg.alert('好了', '去拿单子吧', function() {
                    win.close();
                });
                Ext.Ajax.request({
                    url: 'servlet/ExpressPrintServlet',
                    params: {
                        pop_ids: target_pop_ids_str,
                        express_id: express_id,
                        our_company_id: our_company_id
                    },
                    success: function(response) {

                    },
                    failure: function() {

                    }
                });
            }
        }
    },

    /**
     * 销售日志模块中“添加联系人”操作时的提交
     */
    addToMiniPop: function(button) {
        var win = button.up("window");
        var form = win.down("form", false);
        //        var values = Ext.encode(form.form.getValues());
        var salecase_id = Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id");
        if (form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: 'pops/save_pops_salecases',
                params: {
                    //                    value: values,
                    salecase_id: salecase_id
                },
                success: function(response) {
                    //                    var text = Ext.decode(response.responseText);
                    win.close();
                    Ext.getStore('MiniPops').load();
                    Ext.getStore("Salelogs").load()
                }
            });
        }
    },
    /**
     * 选联系人后把联系信息显示在下面灰框里供查看
     */
    showContact: function(combo, record, eOpts) {
        var form = combo.up('form');
        var mobile = form.down('[name=mobile]', false);
        var phone = form.down('[name=phone]', false);
        var fax = form.down('[name=fax]', false);

        mobile.setValue(record[0].get("mobile"));
        phone.setValue(record[0].get("phone"));
        fax.setValue(record[0].get("fax"));
    }
});