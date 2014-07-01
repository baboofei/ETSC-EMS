Ext.define('EIM.view.salelog.RecommendedItemGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.recommended_item_grid',

    title: '已推荐项目列表',
    store: 'RecommendedItems',
    iconCls: 'ttl_grid',
    multiSelect: true,

    initComponent: function() {
        this.columns = [
            {
                header: '编号',
                dataIndex: 'id',
                hidden: true
            },
            {
                header: '工厂名称',
                dataIndex: 'vendor_unit_name',
                width: 150
            },
            {
                header: '产品型号',
                dataIndex: 'product_model',
                width: 150
                //        }, {
                //            header: '指标',
                //            dataIndex: 'parameter',
                //            flex: 1
            },
            {
                header: '中文简述',
                dataIndex: 'simple_description_cn',
                flex: 1
            },
            {
                header: '客户需求',
                dataIndex: 'customer_requirement',
                width: 150
            }
        ];

        this.addQuotedItemButton = Ext.create('Ext.Button', {
            text: '新增推荐项目',
            iconCls: 'btn_add',
            action: 'addRecommendItem'
        });
        this.deleteQuotedItemButton = Ext.create('Ext.Button', {
            text: '删除推荐项目',
            iconCls: 'btn_delete',
            action: 'deleteRecommendedItem',
            disabled: true
        });
        this.batchAddRecommendItemButton = Ext.create('Ext.Button', {
            text: '批量新增推荐产品',
            iconCls: 'btn_batch_add',
            action: 'batchAddRecommendItem'
        });
        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

        this.bbar = [this.addQuotedItemButton, this.deleteQuotedItemButton, this.batchAddRecommendItemButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    },

    //可多选，加一个“s”的项
    getSelectedItems:function () {
        return this.getSelectionModel().getSelection();
    },

    enableRecordButtons: function() {
        this.deleteQuotedItemButton.enable();
    },
    disableRecordButtons: function() {
        this.deleteQuotedItemButton.disabled();
    }
});