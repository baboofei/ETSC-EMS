Ext.define('EIM.view.personal_message.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.personal_message_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '消息列表',
    store: 'GridPersonalMessages',
    iconCls: 'ttl_grid',
    multiSelect: true,
    viewConfig: {
        getRowClass: function(record) {
            if(!record.get('flag')) {
                return 'undone'
            }
        }
    },

    initComponent: function() {
//        var me = this;
        //“所属用户”的伪字典项，供表格中显示和表头筛选用
        var userArray = filter_all_user();

        this.columns = [
            {
                header: '发送时间',
                dataIndex: 'send_at',
                width: 150,
                sortable: true,
                renderer: Ext.util.Format.dateRenderer("Y-m-d H:i:s"),
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                }
            },
            {
                header: '发送人',
                dataIndex: 'sender>id',
                width: 70,
                sortable: true,
                renderer: function(value, metaData, record) {
                    return record.get('sender>name');
                },
                filter: {
                    type:'list',
                    phpMode:true,
                    options:  Ext.Array.map(userArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                }
            },

            {
                header: '消息内容',
                dataIndex: 'content',
                flex: 1,
                sortable: true,
                filter: {
                    type: 'string'
                }
            }
        ];

        this.addPersonalMessageButton = Ext.create('Ext.Button', {
            text: '发送消息',
            iconCls: 'btn_add',
            action: 'addPersonalMessageButton'
        });
        this.markAsReadButton = Ext.create('Ext.Button', {
            text: '标为已读',
            iconCls: 'btn_mark',
            action: 'markAsRead',
            disabled: true
        });
        this.markAsUnreadButton = Ext.create('Ext.Button', {
            text: '标为未读',
            iconCls: 'btn_mark_alt',
            action: 'markAsUnread',
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
        this.bbar = [
//            this.addPersonalMessageButton,
            this.markAsReadButton,
            this.markAsUnreadButton,
            '-',
            this.pagingToolbar
        ];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    },

    getSelectedItems: function() {
        return this.getSelectionModel().getSelection();
    }
});