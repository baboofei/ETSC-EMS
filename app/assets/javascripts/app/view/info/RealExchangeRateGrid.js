Ext.define('EIM.view.info.RealExchangeRateGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.real_exchange_rate_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '汇率查询',
    store: 'RealExchangeRates',
//    iconCls: 'ttl_function',

    viewConfig: {enableTextSelection:true},

    initComponent: function() {

        var me = this;
        this.columns = [
            {
                header: '日期',
                dataIndex: 'date',
                width: 100,
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                },
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: 'EUR',
                dataIndex: 'eur',
                width: 100
            },
            {
                header: 'GBP',
                dataIndex: 'gbp',
                width: 100
            },
            {
                header: 'USD',
                dataIndex: 'usd',
                width: 100
            },
            {
                header: 'CAD',
                dataIndex: 'cad',
                width: 100
            },
            {
                header: 'JPY',
                dataIndex: 'jpy',
                width: 100
            },
            {
                header: 'HKD',
                dataIndex: 'hkd',
                width: 100
            },
            {
                header: 'NTD',
                dataIndex: 'ntd',
                width: 100
            }
        ];

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

        this.bbar = [this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem:function () {
        return this.getSelectionModel().getSelection()[0];
    }
});