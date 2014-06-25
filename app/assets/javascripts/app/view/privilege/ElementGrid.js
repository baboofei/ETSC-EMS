Ext.define('EIM.view.privilege.ElementGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.privilege_element_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '页面资源权限列表',
    store: 'ElementPrivileges',
    iconCls: 'ttl_form',

    initComponent: function() {
        var me = this;
        this.columns = [
            {
                header: '功能名称',
                dataIndex: 'function_name',
                width: 200,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '页面资源ID',
                dataIndex: 'element_id',
                width: 100
            },
            {
                header: '资源描述',
                dataIndex: 'description',
                width: 150
            },
            {
                header: '不可见角色',
                dataIndex: 'invisible_to_names',
                width: 150
            },
            {
                header: '可见不可用角色',
                dataIndex: 'disable_to_names',
                width: 150
            },
            {
                header: '不可用时显示为',
                dataIndex: 'default_value',
                width: 50
            }
        ];

        this.addElementPrivilegeButton = Ext.create('Ext.Button', {
            text: '新增页面资源权限',
            iconCls: 'btn_add',
            action: 'addElementPrivilege'
        });
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

        this.bbar = [this.addElementPrivilegeButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem:function () {
        return this.getSelectionModel().getSelection()[0];
    }
});