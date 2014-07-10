Ext.define('EIM.controller.BusinessContacts', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridBusinessContacts',
        'BusinessContacts',
        'EmptyGridBusinessContacts'
    ],
    models: [
        'GridBusinessContact',
        'BusinessContact'
    ],

    views: [
        'business_contact.AddToMiniForm',
        'business_contact.Panel',
        'business_contact.Grid',
        'business_contact.Form'
    ],

    refs: [
        {
            ref: 'sourceGrid',
            selector: 'business_contact_grid[name=source_grid]'
        },
        {
            ref: 'targetGrid',
            selector: 'business_contact_grid[name=target_grid]'
        }
    ],

    init: function() {
        var me = this;
        me.control({
            'business_contact_grid[name=target_grid]': {
                selectionchange: this.targetSelectionChange
            },
            'business_contact_grid[name=target_grid] dataview': {
                beforedrop: this.checkHoldingData
            },
            'business_contact_grid[name=source_grid]': {
                //                render: this.loadBusinessContacts,
                itemdblclick: this.editBusinessContact,
                selectionchange: this.sourceSelectionChange
            },
            'business_contact_grid button[action=addBusinessContact]': {
                click: this.addBusinessContact
            },
            'business_contact_grid button[action=deleteSelection]': {
                click: this.deleteSelection
            },
            'business_contact_form button[action=save]': {
                click: this.saveBusinessContact
            },
            'business_contact_add_to_mini_form button[action=add_to]': {
                click: this.addToMiniBusinessContact
            },
            'business_contact_add_to_mini_form combo[name=business_contact_id]': {
                select: this.showContact
            }
        });
    },

    targetSelectionChange: function(selectionModel, selected) {
        var me = this;
        var btn_delete = Ext.ComponentQuery.query('business_contact_grid[name=target_grid] button[action=deleteSelection]')[0];
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
        var hidden = target_grid.down('hidden[name=business_contact_ids]', false);
        var business_contact_id_array = Ext.Array.pluck(Ext.Array.pluck(target_grid.getStore().data.items, 'data'), 'id');
        if(target_data_length > 0) {
            print_button.enable();
        }else{
            print_button.disable();
        }
        hidden.setValue(business_contact_id_array.join("|"));
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

        var target_grid = Ext.ComponentQuery.query('business_contact_grid[name=target_grid]')[0];
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

    editBusinessContact: function(view, record) {
        var view = Ext.widget('business_contact_form').show();
        view.down('form', false).loadRecord(record);
        //给combo做一个假的store以正确显示值
        var business_unit_field = view.down('[name=business_unit_id]', false);
        business_unit_field.getStore().loadData([
            [record.get('business_unit>id'), record.get('business_unit>(name|en_name|unit_aliases>unit_alias)')]
        ]);
        business_unit_field.setValue(record.get('business_unit>id'));

        if(!record.get('editable')) {
            view.down('button[action=save]', false).hide();
        }
    },

    sourceSelectionChange: function() {

    },

    addBusinessContact: function() {
        Ext.widget('business_contact_form').show();
    },

    deleteSelection: function(button) {
        var me = this;
        var grid = button.up('grid');
        var se = grid.getSelectionModel().getSelection();
        grid.getStore().remove(se);
        me.checkTargetGrid();
    },

    saveBusinessContact: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: "business_contacts/save_business_contact",
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
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridBusinessContacts').load();
                }
            });
        }
    },

    /**
     * 销售日志模块中“添加商务相关联系人”操作时的提交
     */
    addToMiniBusinessContact: function(button) {
        var win = button.up("window");
        var form = win.down("form", false);
        //        var values = Ext.encode(form.form.getValues());
        var salecase_id = Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id");
        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: 'business_contacts/save_business_contacts_salecases',
                params: {
                    //                    value: values,
                    salecase_id : salecase_id
                },
                success: function(response){
                    //                    var text = Ext.decode(response.responseText);
                    win.close();
                    Ext.getStore('MiniBusinessContacts').load();
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