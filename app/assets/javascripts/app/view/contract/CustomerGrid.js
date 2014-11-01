Ext.define('EIM.view.contract.CustomerGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.contract_customer_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '客户联系人列表',
    store: 'GridContractMiniCustomers',
    iconCls: 'ttl_grid',
    multiSelect: true,

    initComponent: function() {
        this.columns = [
            {
                header: '单位',
                dataIndex: 'customer_unit_name',
                flex: 1,
                minWidth: 150
            },
            {
                header: '姓名',
                dataIndex: 'name',
                width: 100,
                sortable: false
            },
            {
                header: '移动电话',
                width: 100,
                sortable: false,
                dataIndex: 'mobile'
            },
            {
                header: '固定电话',
                width: 100,
                sortable: false,
                dataIndex: 'phone'
            },
            {
                header: '电子邮件',
                width: 100,
                sortable: false,
                dataIndex: 'email',
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
                header: '传真',
                width: 100,
                sortable: false,
                dataIndex: 'fax'
            }
        ];

        this.addCustomerFromButton = Ext.create('Ext.Button', {
            text: '添加联系人',
            iconCls: 'btn_add',
            action: 'addCustomerFrom'
        });
        this.deleteCustomerFromButton = Ext.create('Ext.Button', {
            text: '删除联系人',
            iconCls: 'btn_delete',
            action: 'deleteCustomerFrom'
        });
        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

        this.bbar = [
            this.addCustomerFromButton,
            this.deleteCustomerFromButton,
            '-',
            this.pagingToolbar
        ];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    },

    //可多选，加一个“s”的项
    getSelectedItems: function() {
        return this.getSelectionModel().getSelection();
    }
});