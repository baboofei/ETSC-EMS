Ext.define('EIM.controller.Customers', {
    extend: 'Ext.app.Controller',

    stores: [
        //'MiniCustomers',
//        'Customers',
        'dict.Applications',
        'GridCustomers',
        'ComboOurCompanies',
        'ComboUsers',
        'ComboGroups',
        'EmptyGridCustomers'
    ],
    models: [
        //'MiniCustomer',
//        'Customer',
        'dict.Application',
        'GridCustomer',
        'ComboOurCompany',
        'ComboUser',
        'ComboGroup'
    ],

    views: [
        'customer.AddToMiniForm',
        'customer.Panel',
        'customer.Grid',
        'customer.Form',
//        'express_sheet.Form',
//        'express_sheet.SimpleForm',
        'customer.ShareForm',
        'customer.TransferForm'
    ],

    refs: [
        {
            ref: 'sourceGrid',
            selector: 'customer_grid[name=source_grid]'
        },
        {
            ref: 'targetGrid',
            selector: 'customer_grid[name=target_grid]'
        }
    ],

    init: function() {
        var me = this;
        me.control({
            'customer_grid[name=target_grid]': {
                selectionchange: this.targetSelectionChange
            },
            'customer_grid[name=target_grid] dataview': {
                beforedrop: this.checkHoldingData
            },
            'customer_grid[name=source_grid]': {
                itemdblclick: this.editCustomer,
                selectionchange: this.sourceSelectionChange
            },
            'customer_grid button[action=addCustomer]': {
                click: this.addCustomer
            },
            'customer_grid button[action=shareCustomer]': {
                click: this.shareCustomer
            },
            'customer_grid button[action=transferCustomer]': {
                click: this.transferCustomer
            },
            'customer_grid button[action=deleteSelection]': {
                click: this.deleteSelection
            },
            'customer_form [name=email], customer_form [name=phone], customer_form [name=mobile]': {
                focus: this.clearInvalid
            },
            'customer_form combo[name=addr_combo]': {
                select: this.applyAddress
            },
            'customer_form button[action=save]': {
            	click: this.saveCustomer
            },
            'customer_share_form button[action=save]': {
                click: this.shareCustomerSubmit
            },
            'customer_transfer_form button[action=save]': {
                click: this.transCustomerSubmit
            },
            'express_sheet_form button[action=printExpressSheet]': {
                click: this.printExpressSheet
            },
            'customer_add_to_mini_form button[action=add_to]': {
                click: this.addToMiniCustomer
            },
            'customer_add_to_mini_form combo[name=customer_id]': {
                select: this.showContact
            }
        });
    },

    targetSelectionChange: function(selectionModel, selected) {
        var me = this;
        var btn_delete = Ext.ComponentQuery.query('customer_grid[name=target_grid] button[action=deleteSelection]')[0];
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
        me.checkTargetGrid();
    },

    /**
     * 检查目标表格里有无数据，以确定“打印”按钮可用/不可用
     */
    checkTargetGrid: function() {
        var target_grid = this.getTargetGrid();
        var target_data_length = target_grid.getStore().getCount();
        var print_button = target_grid.down('button[action=selectExpress]', false);
        var hidden = target_grid.down('hidden[name=customer_ids]', false);
        var customer_id_array = Ext.Array.pluck(Ext.Array.pluck(target_grid.getStore().data.items, 'data'), 'id');
        if(target_data_length > 0) {
            print_button.enable();
        }else{
            print_button.disable();
        }
        hidden.setValue(customer_id_array.join("|"));
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
        for(var i = 0; i < data.records.length; i++) {
            //地址不为空的才算数
            if(!Ext.isEmpty(data.records[i]['data']['addr'])) {
                holding_data.push(data.records[i]);
            }
        }
        var holding_id_array = Ext.Array.pluck(holding_data, 'internalId');

        var target_grid = Ext.ComponentQuery.query('customer_grid[name=target_grid]')[0];
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

    editCustomer: function(view, record) {
        //            var record = this.getSourceGrid().getSelectedCustomer();
        var view = Ext.widget('customer_form').show();
        Ext.getStore("dict.Applications").load();
        view.down('form', false).loadRecord(record);
        //boxselect里的值单独赋
        var app_ids = record.data["prod_applications>id"];
        var app_array = Ext.Array.map(app_ids.split("|"), function(value){
            return Number(value);
        });
        view.down('form', false).down('boxselect').setValue(app_array);
        //给combo做一个假的store以正确显示值
        var customer_unit_field = view.down('[name=customer_unit_id]', false);
        customer_unit_field.getStore().loadData([[record.get('customer_unit>id'), record.get('customer_unit>(name|unit_aliases>unit_alias)')]]);
        customer_unit_field.setValue(record.get('customer_unit>id'));

        var group_field = view.down('[name=group_id]', false);
        group_field.getStore().loadData([[record.get('group_id'), record.get('group_name')]]);
        group_field.setValue(record.get('group_id'));

        if(!record.get('editable')) {
            view.down('button[action=save]', false).hide();
        }
    },

    sourceSelectionChange: function(selectionModel, selected) {
        var grid = this.getSourceGrid();
        var btn_share = grid.down('button[action=shareCustomer]', false);
        var btn_trans = grid.down('button[action=transferCustomer]', false);
        if(selected.length > 0) {
            btn_share.enable();
            btn_trans.enable();
            Ext.Array.each(selected, function(item) {
//                console.log(item.get('editable'));
                if(!item.get('editable')) {
                    btn_share.disable();
                    btn_trans.disable();
                    return false;
                }
            });
        }else{
            btn_share.disable();
            btn_trans.disable();
        }
    },

    addCustomer: function() {
        Ext.widget('customer_form').show();
        Ext.getStore('dict.Applications').load();
    },

    shareCustomer: function() {
        var form = Ext.widget('customer_share_form').show();
        //先看所有选中项的already_shared_to是否相同
        var grid = Ext.ComponentQuery.query('customer_panel [name=source_grid]')[0];
        var selection = grid.getSelectionModel().getSelection();
        var already_shared_to_array = Ext.Array.merge(Ext.Array.pluck(Ext.Array.pluck(selection, "data"), "already_shared_to"));
        var integer_array = Ext.Array.map(already_shared_to_array[0].split("|"), function(item) {
            return eval(item);
        });
        if(already_shared_to_array.length === 1) {
            //只有一项，说明全部一样，则在boxselect里显示出来
            form.down('boxselect', false).setValue(integer_array);
        }
    },

    transferCustomer: function() {
        var view = Ext.widget('customer_transfer_form').show();
        view.down('[name=source_function]', false).setValue('customer');
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

    saveCustomer: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        if(Ext.isEmpty(form.down('[name=email]', false).getValue()) &&
            Ext.isEmpty(form.down('[name=mobile]', false).getValue()) &&
            Ext.isEmpty(form.down('[name=phone]', false).getValue())) {
            Ext.example.msg('不行', EIM_multi_field_invalid + '<br />“电子邮件”、“移动电话”、“固定电话”一个都没填呢！');
            form.down('[name=email]', false).markInvalid('这三项至少得填一项啊！');
            form.down('[name=mobile]', false).markInvalid('这三项至少得填一项啊！');
            form.down('[name=phone]', false).markInvalid('这三项至少得填一项啊！');
            return false;
        }

        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: "customers/save_customer",
                params: {
                    application_ids: form.down('boxselect', false).getValue().join("|"),
                    application_names: form.down('boxselect', false).getRawValue()/*,
                    detail: form.down('[name=detail]', false).getValue()*/
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    var target_by_id = form.down('[name=source_element_id]', false).getValue();
                    //如果是从小加号来的窗口(也就是source_element_id的值不为空)，则把值回填到小加号前面的combo里
                    if(!Ext.isEmpty(target_by_id)) {
                        var target = Ext.getCmp(target_by_id);
                        var target_combo = target.up('container').down("combo", false);
                        target_combo.store.load({
                            callback: function(records, operation, success) {
                                target_combo.select(msg['id']);
                            }
                        });
                    }
                    //防本地过滤后无法复原
                    form.down('boxselect', false).getStore().clearFilter();
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridCustomers').load();
                }
            });
        }
    },

    shareCustomerSubmit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var grid = Ext.ComponentQuery.query('customer_panel [name=source_grid]')[0];
        var selection = grid.getSelectionModel().getSelection();
        var customer_ids = Ext.Array.pluck(Ext.Array.pluck(selection, "data"), "id");
        var customer_ids_str = customer_ids.join("|");

//        console.log()
        if(form.form.isValid()) {
            //防双击
            button.disable();
            //去掉当前用户再提交
            var share_to = Ext.Array.remove(form.down('boxselect', false).getValue(), userId).join("|");

            form.submit({
                url: '/customers/share_to',
                params: {
                    customer_ids: customer_ids_str,
                    share_to: share_to
                },
                submitEmptyText:false,
                success: function(the_form, action){
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridCustomers').load();
                }
            });
        }
    },

    transCustomerSubmit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var source_field = form.down('[name=source_function]', false);

        if(source_field.getValue() === "inquire") {
            var source_form = Ext.ComponentQuery.query('customer_check_dup_form')[0];
            var source_win = Ext.ComponentQuery.query('customer_check_dup_form')[0];
            var inquire_id = source_form.down('[name=inquire_id]').getValue();
            if(source_form.down('[name=inquire_type]').getValue() === 'MInquires') {
                var inquire_str = 'm_inquires';
            } else if(source_form.down('[name=inquire_type]').getValue() === 'PInquires') {
                var inquire_str = 'p_inquires';
            }
            if(form.form.isValid()) {
                //防双击
                button.disable();

                form.submit({
                    url: '/' + inquire_str + '/re_trans_to',
                    params: {
                        inquire_id: inquire_id
                    },
                    submitEmptyText:false,
                    success: function(the_form, action){
                        var response = action.response;
                        var msg = Ext.decode(response.responseText);
                        win.close();
                        source_win.close();
                        Ext.example.msg('成功', msg.message);
                    }
                });
            }
        } else if(source_field.getValue() === "customer") {
            var grid = Ext.ComponentQuery.query('customer_panel [name=source_grid]')[0];
            var selection = grid.getSelectionModel().getSelection();
            var customer_ids = Ext.Array.pluck(Ext.Array.pluck(selection, "data"), "id");
            var customer_ids_str = customer_ids.join("|");

            if(form.form.isValid()) {
                //防双击
                button.disable();

                form.submit({
                    url: '/customers/trans_to',
                    params: {
                        customer_ids: customer_ids_str/*,
                         user_id: share_to*/
                    },
                    submitEmptyText:false,
                    success: function(the_form, action){
                        var response = action.response;
                        var msg = Ext.decode(response.responseText);
                        win.close();
                        Ext.example.msg('成功', msg.message);
                        Ext.getStore('GridCustomers').load();
                    }
                });
            }
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
        var target_customer_ids = Ext.Array.pluck(Ext.Array.pluck(grid.getStore().data.items, "data"), "id");
        var target_customer_ids_str = target_customer_ids.join("|");

        var express_id = form.down('[name=express_id]', false).getValue();
        var our_company_id = form.down('[name=our_company_id]', false).getValue();

        if(target_customer_ids.length === 0){
            Ext.example.msg("错误", "表格中还没有数据！");
        }else{
            if(form.form.isValid()) {
                button.disable();
                Ext.Msg.alert('好了', '去拿单子吧', function() {
                    win.close();
                });
                Ext.Ajax.request({
                    url:'servlet/ExpressPrintServlet',
                    params: {
                        customer_ids: target_customer_ids_str,
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
     * 销售日志模块中“添加客户联系人”操作时的提交
     */
    addToMiniCustomer: function(button) {
        var win = button.up("window");
        var form = win.down("form", false);
//        var values = Ext.encode(form.form.getValues());
        var salecase_id = Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id");
        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: 'customers/save_customers_salecases',
                params: {
//                    value: values,
                    salecase_id : salecase_id
                },
                success: function(response){
//                    var text = Ext.decode(response.responseText);
                    win.close();
                    Ext.getStore('MiniCustomers').load();
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
        var fax = form.down('[name=fax]',false);
        
        mobile.setValue(record[0].get("mobile"));
        phone.setValue(record[0].get("phone"));
        fax.setValue(record[0].get("fax"));
    }
});