/**
 * 肯定会有一个customer的大列表，信息比较全，这个只是小型的，用于维修水单里的客户信息提示
 */
Ext.define('EIM.view.customer.ServiceMiniGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.customer_service_mini_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    iconCls: 'ttl_grid',

    initComponent: function() {
        this.store = 'ServiceMiniCustomers';
        this.columns = [
            {
                header: '客户单位',
                flex: 1,
                sortable: false,
                dataIndex: 'customer_unit>name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '姓名',
                width: 50,
                sortable: false,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '移动电话',
                width: 100,
                sortable: false,
                dataIndex: 'mobile',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '固定电话',
                width: 100,
                sortable: false,
                dataIndex: 'phone',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '电子邮件',
                width: 100,
                sortable: false,
                dataIndex: 'email',
                filter: {
                    type: 'string'
                },
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
                dataIndex: 'fax',
                filter: {
                    type: 'string'
                }
            }
        ];

        this.addCustomerFromButton = Ext.create('Ext.Button', {
            text: '添加联系人',
            iconCls: 'btn_add',
            action: 'addCustomerFrom',
            disabled: true
        });
        this.deleteCustomerFromButton = Ext.create('Ext.Button', {
            text: '删除联系人',
            iconCls: 'btn_delete',
            action: 'deleteCustomerFrom',
            disabled: true
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

        this.bbar = [this.addCustomerFromButton, this.deleteCustomerFromButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});