Ext.define('EIM.controller.salelog.Recommend', {
    extend: 'Ext.app.Controller',

    stores: [
        'RecommendedItems',
        'MailedSamples',
        'MailedContents',
        'MailedProcessingPieceToCustomers',
        'MailedProcessingPieceToVendors',
        'MailedProducts',
//        'SalelogQuotedItems',
//        'SalelogQuotes',
        'dict.SalecaseCancelReasons',
        'dict.SalecaseWaitReasons'
    ],
    models: [
        'RecommendedItem',
        'MailedSample',
        'MailedContent',
        'MailedProcessingPieceToCustomer',
        'MailedProcessingPieceToVendor',
        'MailedProduct',
//        'SalelogQuotedItem',
//        'SalelogQuote',
        'dict.SalecaseCancelReason',
        'dict.SalecaseWaitReason'
    ],

    views: [
        'salelog.Form',
        'salelog.RecommendTab',
        'salelog.RecommendedItemGrid',
        'salelog.MailTab',
        'salelog.MailedSampleGrid',
        'salelog.MailedContentGrid',
        'salelog.MailedProcessingPieceToCustomerGrid',
        'salelog.MailedProcessingPieceToVendorGrid',
        'salelog.MailedProductGrid',
        'salelog.QuoteTab',
//        'salelog.QuotedItemGrid',
//        'salelog.QuoteGrid',
        'salelog.ContractTab',
//        'salelog.ProblemTab',
        'salelog.WaitTab',
//        'salelog.ChangeTab',
        'salelog.CancelTab',
        'salelog.OtherTab'
    ],

    refs: [{
        ref: 'grid',
        selector: 'recommended_item_grid'
//    }, {
//        ref: 'form',
//        selector: 'recommend_item_form'
//    }, {
//        ref: 'btnCreate',
//        selector: 'recommend_item_form button[action=create]'
//    }, {
//        ref: 'btnUpdate',
//        selector: 'recommend_item_form button[action=update]'
    }],

    init: function() {
        var me = this;

        me.control({
            'button[action=addRecommendItem]': {
                click: this.addRecommendItem
            },
            'button[action=deleteRecommendedItem]': {
                click: this.deleteRecommendedItem
            },
            'button[action=batchAddRecommendItem]': {
                click: this.batchRecommendItem
            },
            'recommended_item_grid': {
                // 表格被渲染时加载相应store
                // 如果是“编辑”操作，只会激活一个标签，那么别的数据就都不用加载
//                render: this.activeRecommend,
                itemdblclick: this.editRecommendedItem,
                selectionchange: this.selectionChange//(grid, selected, eOpts)这参数不用传，下面定义时直接写即可
            }
        });
    },

    /**
     * 新增/修改推荐产品
     */
    addRecommendItem: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.RecommendForm');
        //widget里写了autoShow，不要执行回调函数的话就不用show一下了
        var view = Ext.widget('recommend_item_form');//.show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.show();
        btn_update.hide();
    },
    editRecommendedItem: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.RecommendForm');
        var record = me.getGrid().getSelectedItem();
        var view = Ext.widget('recommend_item_form');
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.hide();
        btn_update.show();
        view.down('form').loadRecord(record);
        //如果product_id为0，说明是没推荐产品的，这时把“仅推荐工厂”勾选上
        if(record["data"]["product_id"] === 0) {
            view.down("checkbox").setValue(1);
        }
//        //给combo做一个假的store以正确显示值
//        var vendor_unit_field = view.down('[name=vendor_unit_id]', false);
////        console.log(record);
////        vendor_unit_field.getStore().loadData([[record.get('customer_unit|id'), record.get('customer_unit|name')]]);
////        vendor_unit_field.setValue(record.get('customer_unit|id'));
    },
    deleteRecommendedItem: function() {
        var me = this;
        Ext.Msg.confirm('确认删除', '真的要删除选中的所有推荐项目？', function(button){
            if (button === 'yes') {
                var grid = me.getGrid();
                var se = grid.getSelectedItems();
                grid.getStore().remove(se);
//                Ext.Array.each(me.getGrid().getSelectedItems(), function(item, index, allItems) {
//                    item.remove();
//                });
            } else {
                return false;
            }
        });
    },

    batchRecommendItem: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.BatchRecommendForm');
        var view = Ext.widget('batch_recommend_item_form');
        view.show();
    },

//    activeRecommend: function() {
//        Ext.getStore("RecommendedItems").load();
//    },
    selectionChange: function(selectionModel, selected, eOpts) {
        var edit_btn = this.getGrid().down("[action=deleteRecommendedItem]");
        if(selected.length > 0){
            edit_btn.setDisabled(false);
        }else{
            edit_btn.setDisabled(true);
        }
    }
});