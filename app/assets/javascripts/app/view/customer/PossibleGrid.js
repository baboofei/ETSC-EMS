/**
 * 这个是用于客户比对的可能客户列表
 */
Ext.define('EIM.view.customer.PossibleGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.customer_possible_grid',

//    requires: 'Ext.ux.grid.FiltersFeature',

    iconCls: 'ttl_grid',

    initComponent: function() {
        this.store = 'GridPossibleCustomers';
        this.columns = [
            {
                header: '姓名',
                dataIndex: 'name',
                width: 75,
                sortable: false
            },
            {
                header: '客户单位',
                dataIndex: 'customer_unit_addr>customer_unit>(name|unit_aliases>unit_alias|en_name)',
                width: 150,
                sortable: false
            },
            {
                header: '英文名',
                dataIndex: 'en_name',
                width: 100,
                sortable: false
            },
            {
                header: '电子邮件',
                dataIndex: 'email',
                width: 100,
                sortable: false,
                renderer: function(value, metaData, record) {
                    var array = value.split(',');
                    var email = [];
                    Ext.Array.each(array, function(item) {
                        item = item.replace(/\s/, '');
                        var name = record.get('name');
                        email.push("<a href='mailto:" + name + "<" + item + ">'>" + item + "</a>");
                    });
                    return email.join(",");
                }
            },
            {
                header: '移动电话',
                dataIndex: 'mobile',
                width: 100,
                sortable: false
            },
            {
                header: '固定电话',
                dataIndex: 'phone',
                width: 100,
                sortable: false
            },
            {
                header: '传真',
                dataIndex: 'fax',
                width: 100,
                sortable: false
            },
            {
                header: 'QQ/MSN',
                dataIndex: 'im',
                width: 100,
                sortable: false
            },
            {
                header: '部门',
                dataIndex: 'department',
                width: 100,
                sortable: false
            },
            {
                header: '职位',
                dataIndex: 'position',
                width: 100,
                sortable: false
            },
            {
                header: '通信地址',
                dataIndex: 'addr',
                flex: 1,
                minWidth: 150,
                sortable: false
            },
            {
                header: '邮编',
                dataIndex: 'postcode',
                width: 50,
                sortable: false
            },
            {
                header: '英文地址',
                dataIndex: 'en_addr',
                flex: 1,
                minWidth: 150,
                sortable: false
            },
            {
                header: '备注',
                dataIndex: 'comment',
                width: 100,
                sortable: false
            }
        ];

//        this.addCustomerFromButton = Ext.create('Ext.Button', {
//            text: '添加联系人',
//            iconCls: 'btn_add',
//            action: 'addCustomerFrom',
//            disabled: true
//        });
//        this.deleteCustomerFromButton = Ext.create('Ext.Button', {
//            text: '删除联系人',
//            iconCls: 'btn_delete',
//            action: 'deleteCustomerFrom',
//            disabled: true
//        });
        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

//        this.features = [
//            {
//                ftype: 'filters',
//                encode: true
//            }
//        ];

        this.bbar = [this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});