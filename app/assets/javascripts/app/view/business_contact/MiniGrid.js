/**
 * 小型的business_contact，用于个案里的商务相关联系人提示
 */
Ext.define('EIM.view.business_contact.MiniGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.business_contact_mini_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    iconCls: 'ttl_grid',

    initComponent: function() {
        this.store = 'MiniBusinessContacts';
        this.columns = [
            {
                header: '商务相关单位',
                flex: 1,
                sortable: false,
                dataIndex: 'business_unit>name',
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

        this.addBusinessContactFromButton = Ext.create('Ext.Button', {
            text: '添加联系人',
            iconCls: 'btn_add',
            action: 'addBusinessContactFrom',
            disabled: true
        });
        this.deleteBusinessContactFromButton = Ext.create('Ext.Button', {
            text: '删除联系人',
            iconCls: 'btn_delete',
            action: 'deleteBusinessContactFrom',
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

        this.bbar = [this.addBusinessContactFromButton, this.deleteBusinessContactFromButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});