Ext.define('EIM.view.privilege.FunctionGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.privilege_function_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '功能权限列表',
    store: 'FunctionPrivileges',
    iconCls: 'ttl_function',

    initComponent: function() {

        var me = this;
        this.columns = [
            {
                header: '功能名称',
                dataIndex: 'name',
                width: 200,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '可见角色',
                dataIndex: 'visible_to_ids',
                minWidth: 100,
                flex: 1,
                renderer: function(value, metaData, record) {
                    return record.get('visible_to_names');
                }
            }
        ];

        this.addFunctionPrivilegeButton = Ext.create('Ext.Button', {
            text: '新增功能权限',
            iconCls: 'btn_add',
            action: 'addFunctionPrivilege',
            hidden: true
        });
        this.testPrivilegeButton = Ext.create('Ext.Button', {
            id: 'test_privilege',
            text: '可见时的值'
        });
        this.testField = Ext.create('Ext.form.field.Text', {
            id: 'test_text_field'
        })
        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

        this.features = [{
            ftype: 'filters',
            encode: true
        }];

        this.bbar = [this.addFunctionPrivilegeButton, this.testPrivilegeButton, this.testField, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem:function () {
        return this.getSelectionModel().getSelection()[0];
    }
});