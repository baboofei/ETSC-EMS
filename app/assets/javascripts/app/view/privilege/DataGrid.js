Ext.define('EIM.view.privilege.DataGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.privilege_data_grid',

    requires: ['Ext.ux.grid.FiltersFeature'],

    title: '数据权限列表',
    store: 'DataPrivileges',
    iconCls: 'ttl_database',

    initComponent: function() {
        var me = this;
        //“角色”的伪字典项，供表格中显示和表头筛选用
        var roleArray = filter_all_role();

        this.columns = [
            {
                header: 'store名称',
                dataIndex: 'name',
                width: 100,
                filter: {
                    type: 'string'
                }
            },
            {
                header: 'store描述',
                dataIndex: 'description',
                width: 150,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '全部数据对其可见但不可改',
                dataIndex: 'visible_to_roles>visible_role_id',
                width: 250,
                renderer: function(value, metaData, record) {
                    return record.get('visible_to_roles>visible_role_name')
                },
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(roleArray, function (record) {
//                        console.log(record);
                        return [record["id"], record["name"]];
                    })
                }
            },
            {
                header: '全部数据对其可见可改',
                dataIndex: 'editable_to_names',
                width: 250
            },
            {
                header: '部分数据对其可见可改',
                dataIndex: 'partial_editable_to_names',
                width: 250
            },
            {
                header: '按等级？',
                dataIndex: 'is_hierarchy',
                width: 50,
                renderer: function(value) {
                    return value ? "是" : "否"
                }
            },
            {
                header: '继承组？',
                dataIndex: 'is_group_hierarchy',
                width: 50,
                renderer: function(value) {
                    return value ? "是" : "否"
                }
            }
        ];

        this.addDataPrivilegeButton = Ext.create('Ext.Button', {
            text: '新增页面资源权限',
            iconCls: 'btn_add',
            action: 'addDataPrivilege'
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

        this.bbar = [this.addDataPrivilegeButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem:function () {
        return this.getSelectionModel().getSelection()[0];
    }
});