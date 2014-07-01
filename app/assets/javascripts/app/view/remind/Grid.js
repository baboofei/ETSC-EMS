Ext.define('EIM.view.remind.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.remind_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '提醒列表',
    store: 'GridReminds',
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

        this.columns = [
            {
                header: '提醒时间',
                dataIndex: 'remind_at',
                width: 100,
                sortable: true,
                renderer: Ext.util.Format.dateRenderer("Y-m-d"),
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                }
            },
            {
                header: '提醒内容',
                dataIndex: 'remind_text',
                flex: 1,
                sortable: true,
                filter: {
                    type: 'string'
                }
            }
        ];

        this.addRemindButton = Ext.create('Ext.Button', {
            text: '新增提醒',
            iconCls: 'btn_add',
            action: 'addRemind'
        });
        this.markAsReadButton = Ext.create('Ext.Button', {
            text: '标为已读',
            iconCls: 'btn_mark',
            action: 'markAsRead',
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
        this.bbar = [this.addRemindButton, this.markAsReadButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    },

    getSelectedItems: function() {
        return this.getSelectionModel().getSelection();
    }
});