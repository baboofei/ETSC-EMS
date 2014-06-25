Ext.define('EIM.view.p_inquire.Grid', {
    extend: 'Ext.grid.Panel',
    alias : 'widget.p_inquire_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title : '市场需求列表',
    store: 'GridPInquires',
    iconCls: 'ttl_grid',
    viewConfig: {enableTextSelection:true},
    multiSelect: true,

    initComponent: function() {
        this.columns = [
//            {
//                xtype: 'actioncolumn',
//                width: 20,
//                renderer: function(value, metaData, record) {
//                    var str = "";
//                    if(record.get('transferred') === true) {
//                        str += "<p class='act_transferred' title='已转'></p>";
//                    }
//                    return str;
//                }
//            },
            {
                header: '姓名',
                dataIndex: 'name',
                width: 75,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '客户单位',
                dataIndex: 'customer_unit_name',
                width: 150,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '英文名',
                dataIndex: 'en_name',
                width: 100,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '电子邮件',
                dataIndex: 'email',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '移动电话',
                dataIndex: 'mobile',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '固定电话',
                dataIndex: 'phone',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '传真',
                dataIndex: 'fax',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: 'QQ/MSN',
                dataIndex: 'im',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '部门',
                dataIndex: 'department',
                width: 100,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '职位',
                dataIndex: 'position',
                width: 100,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '通信地址',
                dataIndex: 'addr',
                width: 150,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '邮编',
                dataIndex: 'postcode',
                width: 50,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '英文地址',
                dataIndex: 'en_addr',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                },
                renderer: function(value) {
                    return value
                }
            },
            {
                header: '备注',
                dataIndex: 'comment',
                minWidth: 150,
                flex: 1,
                sortable: false,
                filter: {
                    type: 'string'
                }
            }
        ];

        this.addPInquireButton = new Ext.Button({
            text: '新增客户',
            action: 'addPInquire',
            id: 'privilege_button_add_p_inquire',
//            allowPrivilege: true,
            iconCls: 'btn_add'
        });
        this.transferPInquireButton = new Ext.Button({
            text: '转让客户',
            action: 'transferPInquire',
            iconCls: 'btn_transfer',
            disabled: true
        })

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
        this.bbar = [this.addPInquireButton, this.transferPInquireButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});
