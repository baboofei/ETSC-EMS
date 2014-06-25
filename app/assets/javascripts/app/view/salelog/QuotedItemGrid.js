Ext.define('EIM.view.salelog.QuotedItemGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.salelog_quoted_item_grid',

    title: '选中报价下项目列表',
    store: 'SalelogQuotedItems',
    iconCls: 'ttl_grid',

    initComponent: function() {
        this.columns = [{
            header: '编号',
            dataIndex: 'id',
            hidden: true
        }, {
            header: '工厂名称',
            dataIndex: 'vendor_unit_id',
            width: 150,
            renderer: function() {

            }
        }, {
            header: '产品型号',
            dataIndex: 'product_id',
            width: 150,
            renderer: function() {

            }
        }, {
            header: '指标',
            dataIndex: 'parameter',
            flex: 1
        }];

        this.addQuoteItemButton = Ext.create('Ext.Button', {
            text: '新增报价项目',
            iconCls: 'btn_add',
            action: 'addQuoteItem'//,
//            visible: false
        });
        this.editQuoteItemButton = Ext.create('Ext.Button', {
            text: '修改报价项目',
            iconCls: 'btn_edit',
            action: 'editQuoteItem',
            disabled: true//,
//            visible: false
        });
        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

        this.bbar = [this.addQuoteItemButton, this.editQuoteItemButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});