Ext.define('EIM.view.user.Grid', {
    extend: 'Ext.grid.Panel',
    alias : 'widget.user_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title : '用户列表',
    store: 'GridUsers',
    iconCls: 'ttl_grid',
    viewConfig: {enableTextSelection:true},
//    autoRender: true,

    initComponent: function() {
        this.columns = [
            {
                header: '姓名',
                dataIndex: 'name',
                width: 50,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '登录名',
                dataIndex: 'reg_name',
                width: 50,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '英文名',
                dataIndex: 'en_name',
                width: 80,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '分机号',
                dataIndex: 'extension',
                width: 80,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '手机号',
                dataIndex: 'mobile',
                width: 100,
                filter: {
                    type: 'string'
                }
            },
            {
                header: 'QQ',
                dataIndex: 'qq',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: 'MSN',
                dataIndex: 'msn',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '公司邮箱',
                dataIndex: 'etsc_email',
                flex: 1,
                minWidth: 150,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '私人邮箱',
                dataIndex: 'email',
                flex: 1,
                minWidth: 150,
                filter: {
                    type: 'string'
                }
            }
        ];

        this.addUserButton = new Ext.Button({
            text: '新增用户',
            action: 'addUser',
            id: 'privilege_button_add_user',
            allowPrivilege: true,
            iconCls: 'btn_add'
        });

        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

        this.features = [
            {
                ftype: 'filters',
                encode: true
            }
        ];
        this.bbar = [this.addUserButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});
