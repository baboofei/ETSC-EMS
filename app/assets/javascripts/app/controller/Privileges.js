/**
 * 权限管理页面上的controller
 */
Ext.define('EIM.controller.Privileges', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridRoles',
        'FunctionPrivileges',
        'ElementPrivileges',
        'DataPrivileges'
    ],
    models: [
        'GridRole',
        'FunctionPrivilege',
        'ElementPrivilege',
        'DataPrivilege'
    ],

    views: [
        'privilege.Panel',
        'privilege.FunctionGrid',
        'privilege.FunctionForm',
        'privilege.ElementGrid',
        'privilege.ElementForm',
        'privilege.DataGrid',
        'privilege.DataForm'
    ],

    refs: [{
        ref: 'functiongrid',
        selector: 'privilege_function_grid'
    }, {
        ref: 'elementgrid',
        selector: 'privilege_element_grid'
    }, {
        ref: 'datagrid',
        selector: 'privilege_data_grid'
    }],

    init: function() {
        var me = this;
        me.control({
            'privilege_panel': {
                render: function() {
                    Ext.getStore('GridRoles').load();
                }
            },
            '#test_privilege, #test_text_field, #function_name': {
                //                beforerender: this.applyPrivilege
            },

            'privilege_function_form [action=save]': {
                click: this.saveFunctionPrivilege
            },
            'privilege_element_form [action=save]': {
                click: this.saveElementPrivilege
            },
            'privilege_data_form [action=save]': {
                click: this.saveDataPrivilege
            },
            'privilege_function_grid': {
                itemdblclick: this.editFunctionPrivilege
            },
            'privilege_function_grid [action=addFunctionPrivilege]': {
                click: this.addFunctionPrivilege
            },
            'privilege_element_grid': {
                itemdblclick: this.editElementPrivilege
            },
            'privilege_element_grid [action=addElementPrivilege]': {
                click: this.addElementPrivilege
            },
            'privilege_data_grid': {
                itemdblclick: this.editDataPrivilege
            },
            'privilege_data_grid [action=addDataPrivilege]': {
                click: this.addDataPrivilege
            }
        });
    },

    /**
     * 根据id来设定页面元素的权限
     * @param component
     */
    applyPrivilege: function(component) {
        var all_elements = Ext.ComponentQuery.query('functree')[0].allElement;
        var invisible_array = all_elements["elements"]["invisible"];
        var invisible_elements = Ext.Array.pluck(invisible_array, "element_id");
        var disabled_array = all_elements["elements"]["disabled"];
        var disabled_elements = Ext.Array.pluck(disabled_array, "element_id");
        var default_value_array = Ext.Array.map(disabled_array, function(item, index) {
            return {
                "element_id": item.element_id,
                "default_value": item.default_value
            };
        });

        Ext.Array.each(default_value_array, function(item) {
            if (item["element_id"] === component["id"]) {
                //                console.log(Ext.isEmpty(item["default_value"]));
                if (!Ext.isEmpty(item["default_value"])) {
                    var text = item["default_value"];
                    //不同xtype的组件，对“值”的定义不同
                    switch (component.xtype) {
                        case "button":
                            component.setText(text);
                            break;
                        case "textfield":
                            component.setValue(text);
                            break;
                    }
                }
                return false;
            }
        });

        component.setVisible(invisible_elements.indexOf(component["id"]) === -1);
        component.setDisabled(disabled_elements.indexOf(component["id"]) != -1);
    },

    /**
     * 功能权限页面的保存Ajax提交
     * @param button
     */
    saveFunctionPrivilege: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        var role_ids = form.down('[name=visible_to_ids]', false).getValue();
        button.disable();
        form.submit({
            url: '/functions/function_privileges',
            method: 'POST',
            submitEmptyText: false,
            params: {
                role_ids: role_ids.join("|")
            },
            success: function(form, action) {
                var return_message = Ext.decode(action.response.responseText);
                Ext.example.msg('成功', return_message.message);
                win.close();
                Ext.getStore("FunctionPrivileges").load();
            },
            failure: function() {
                Ext.Msg.alert('错误', '可能是网络问题，请找Terry处理');
            }
        });
    },

    /**
     * 页面资源权限页面的保存Ajax提交
     * @param button
     */
    saveElementPrivilege: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        var invisible_role_ids = Ext.Array.pluck(Ext.Array.pluck(form.down('[name=invisible_to]', false).getStore().data.items, "data"), "id");
        var disable_role_ids = Ext.Array.pluck(Ext.Array.pluck(form.down('[name=disable_to]', false).getStore().data.items, "data"), "id");
        button.disable();
        form.submit({
            url: '/privileges/element_privileges',
            method: 'POST',
            submitEmptyText: false,
            params: {
                invisible_role_ids: invisible_role_ids.join("|"),
                disable_role_ids: disable_role_ids.join("|")
            },
            success: function(form, action) {
                var return_message = Ext.decode(action.response.responseText);
                Ext.example.msg('成功', return_message.message);
                win.close();
                Ext.getStore("ElementPrivileges").load();
                //                Ext.getStore('Quotes').load();
            },
            failure: function() {
                Ext.Msg.alert('错误', '可能是网络问题，请找Terry处理');
            }
        });
    },

    /**
     * 数据权限页面的保存Ajax提交
     * @param button
     */
    saveDataPrivilege: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        var visible_role_ids = Ext.Array.pluck(Ext.Array.pluck(form.down('[name=visible_to]', false).getStore().data.items, "data"), "id");
        var editable_role_ids = Ext.Array.pluck(Ext.Array.pluck(form.down('[name=editable_to]', false).getStore().data.items, "data"), "id");
        var partial_editable_role_ids = Ext.Array.pluck(Ext.Array.pluck(form.down('[name=partial_editable_to]', false).getStore().data.items, "data"), "id");
        button.disable();
        form.submit({
            url: '/stores/store_privileges',
            submitEmptyText: false,
            params: {
                visible_role_ids: visible_role_ids.join("|"),
                editable_role_ids: editable_role_ids.join("|"),
                partial_editable_role_ids: partial_editable_role_ids.join("|")
            },
            success: function(response) {
                Ext.example.msg('成功', '权限修改成功');
                win.close();
                Ext.getStore("DataPrivileges").load();
            },
            failure: function() {
                Ext.Msg.alert('错误', '可能是网络问题，请找Terry处理');
            }
        });
    },

    editFunctionPrivilege: function() {
        var record = this.getFunctiongrid().getSelectedItem();
        var view = Ext.widget('privilege_function_form').show();
        //view.down('form', false).loadRecord(record);
        //先loadRecord的话会造成boxselect里的值回填不正常，反正就两个域，不loadRecord了
        var role_array = Ext.Array.map(record.get('visible_to_ids').split("|"), function(value) {
            return Number(value);
        });
        view.down('form', false).down('boxselect').setValue(role_array);
        view.down('form', false).down('[name=id]').setValue(record.get('id'));
        view.down('form', false).down('[name=name]').setValue(record.get('name'));
    },
    addFunctionPrivilege: function() {
        Ext.widget('privilege_function_form').show();
    },

    editElementPrivilege: function() {
        var record = this.getElementgrid().getSelectedItem();
        var view = Ext.widget('privilege_element_form').show();
        view.down('form', false).loadRecord(record);
        Ext.getStore('GridRoles').load();

        //先给invisible_to赋值
        var invisible_id_array = record.get('invisible_to_ids').split('|');
        var invisible_name_array = record.get('invisible_to_names').split('、');
        var invisible_grid_array = [];
        if (!Ext.isEmpty(invisible_id_array[0])) {
            Ext.Array.each(invisible_id_array, function(item, index) {
                invisible_grid_array.push({
                    id: item,
                    name: invisible_name_array[index]
                });
                Ext.getStore('GridRoles').remove(Ext.getStore('GridRoles').getById(Number(item)));
            });
        }
        view.down('[name=invisible_to]', false).getStore().loadData(invisible_grid_array);
        //再给disable_to赋值
        var disable_id_array = record.get('disable_to_ids').split('|');
        var disable_name_array = record.get('disable_to_names').split('、');
        var disable_grid_array = [];
        if (!Ext.isEmpty(disable_id_array[0])) {
            Ext.Array.each(disable_id_array, function(item, index) {
                disable_grid_array.push({
                    id: item,
                    name: disable_name_array[index]
                });
                Ext.getStore('GridRoles').remove(Ext.getStore('GridRoles').getById(Number(item)));
            });
        }
        view.down('[name=disable_to]', false).getStore().loadData(disable_grid_array);

        //最后给左边剩下的赋值
        var remaining_array = Ext.Array.pluck(Ext.getStore('GridRoles')['data']['items'], 'data');
        view.down('[name=all]', false).getStore().loadData(remaining_array);
    },
    addElementPrivilege: function() {
        Ext.widget('privilege_element_form').show();
        //view里没写store了，不能直接getStore('GridRoles').load
        var remaining_array = Ext.Array.pluck(Ext.getStore('GridRoles')['data']['items'], 'data');
        Ext.ComponentQuery.query('privilege_element_form [name=all]')[0].getStore().loadData(remaining_array);
    },

    editDataPrivilege: function() {
        var record = this.getDatagrid().getSelectedItem();
        var view = Ext.widget('privilege_data_form').show();
        view.down('form', false).loadRecord(record);
        Ext.getStore('GridRoles').load();

        //先给visible_to赋值
        var visible_id_array = record.get('visible_to_roles>visible_role_id').split('|');
        var visible_name_array = record.get('visible_to_roles>visible_role_name').split('、');
        var visible_grid_array = [];
        if (!Ext.isEmpty(visible_id_array[0])) {
            Ext.Array.each(visible_id_array, function(item, index) {
                visible_grid_array.push({
                    id: item,
                    name: visible_name_array[index]
                });
                Ext.getStore('GridRoles').remove(Ext.getStore('GridRoles').getById(Number(item)));
            });
        }
        view.down('[name=visible_to]', false).getStore().loadData(visible_grid_array);
        //再给editable_to赋值
        var editable_id_array = record.get('editable_to_ids').split('|');
        var editable_name_array = record.get('editable_to_names').split('、');
        var editable_grid_array = [];
        if (!Ext.isEmpty(editable_id_array[0])) {
            Ext.Array.each(editable_id_array, function(item, index) {
                editable_grid_array.push({
                    id: item,
                    name: editable_name_array[index]
                });
                Ext.getStore('GridRoles').remove(Ext.getStore('GridRoles').getById(Number(item)));
            });
        }
        view.down('[name=editable_to]', false).getStore().loadData(editable_grid_array);
        //再给partial_editable_to赋值
        var partial_editable_id_array = record.get('partial_editable_to_ids').split('|');
        var partial_editable_name_array = record.get('partial_editable_to_names').split('、');
        var partial_editable_grid_array = [];
        if (!Ext.isEmpty(partial_editable_id_array[0])) {
            Ext.Array.each(partial_editable_id_array, function(item, index) {
                partial_editable_grid_array.push({
                    id: item,
                    name: partial_editable_name_array[index]
                });
                Ext.getStore('GridRoles').remove(Ext.getStore('GridRoles').getById(Number(item)));
            });
        }
        view.down('[name=partial_editable_to]', false).getStore().loadData(partial_editable_grid_array);

        //最后给左边剩下的赋值
        var remaining_array = Ext.Array.pluck(Ext.getStore('GridRoles')['data']['items'], 'data');
        console.log(remaining_array);
        view.down('[name=all]', false).getStore().loadData(remaining_array);
    },
    addDataPrivilege: function() {
        var view = Ext.widget('privilege_data_form').show();
        //view里没写store了，不能直接getStore('GridRoles').load
        var remaining_array = Ext.Array.pluck(Ext.getStore('GridRoles')['data']['items'], 'data');
        view.down('[name=all]', false).getStore().loadData(remaining_array);
    }
});