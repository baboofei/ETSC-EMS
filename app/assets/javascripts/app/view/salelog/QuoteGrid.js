Ext.define('EIM.view.salelog.QuoteGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.salelog_quote_grid',

    title: '已有报价列表',
    store: 'SalelogQuotes',
    iconCls: 'ttl_grid',

    initComponent: function() {
        this.columns = [{
            dataIndex: 'id',
            hidden: true
        }, {
            header: '编号',
            dataIndex: 'quote_number',
            width: 100
        }, {
            header: '报价要求',
            dataIndex: 'requirement',
            width: 100
        }];

        this.addQuoteButton = Ext.create('Ext.Button', {
            text: '新增报价',
            iconCls: 'btn_add',
            action: 'addQuote'
        });
        this.editQuoteButton = Ext.create('Ext.Button', {
            text: '修改报价',
            iconCls: 'btn_edit',
            action: 'editQuote',
            disabled: true
        });
        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

        this.bbar = [this.addQuoteButton, this.editQuoteButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});