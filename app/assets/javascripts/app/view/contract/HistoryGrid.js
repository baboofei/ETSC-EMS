Ext.define('EIM.view.contract.HistoryGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.contract_history_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '合同变动情况列表',
    store: 'ContractHistories',
    iconCls: 'ttl_grid',

    initComponent: function() {
        this.columns = [
            {
                header: '改动',
                dataIndex: 'natural_language',
                flex: 1,
                sortable: false
            },
            {
                header: '操作人',
                dataIndex: 'user>name',
                width: 50,
                sortable: false
            },
            {
                header: '修改时间',
                dataIndex: 'created_at',
                width: 80,
                sortable: false,
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '修改原因',
                dataIndex: 'reason',
                width: 150,
                sortable: false
            }
        ];

        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

        this.bbar = [this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});