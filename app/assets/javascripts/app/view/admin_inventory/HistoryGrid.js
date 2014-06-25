Ext.define('EIM.view.admin_inventory.HistoryGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.admin_inventory_history_grid',

    requires:'Ext.ux.grid.FiltersFeature',

    store: 'GridAdminInventoryHistories',
    iconCls: 'ttl_grid',

    initComponent: function() {
        this.columns = [
            {
                header: '操作日期',
                dataIndex: 'act_at',
                width: 100,
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                },
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '操作明细',
                dataIndex: 'natural_language',
                flex: 1,
                filter: {
                    type: 'string'
                }
            }
        ];

        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store:this.store,
            displayInfo:true,
            border:0,
            width: 400
        });

        this.features = [
            {
                ftype:'filters',
                encode:true
            }
        ];

        this.bbar = [this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});