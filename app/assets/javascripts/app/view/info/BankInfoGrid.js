Ext.define('EIM.view.info.BankInfoGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.info_bank_info_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '财务信息',
    store: 'dict.OurCompanies',
//    iconCls: 'ttl_function',

    viewConfig: {enableTextSelection:true},

    initComponent: function() {

        var me = this;
        this.columns = [
            {
                header: '公司名称',
                dataIndex: 'name',
                width: 200,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '银行信息',
                dataIndex: 'bank_info',
                minWidth: 100,
                flex: 1
            },
            {
                header: '增值税信息',
                dataIndex: 'vat_info',
                minWidth: 100,
                flex: 1
            }
        ];

//        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
//            store: this.store,
//            displayInfo: true,
//            border: 0,
//            minWidth: 380
//        });
        this.callParent(arguments);
    },

    getSelectedItem:function () {
        return this.getSelectionModel().getSelection()[0];
    }
});