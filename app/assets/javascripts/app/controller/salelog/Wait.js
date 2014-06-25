Ext.define('EIM.controller.salelog.Wait', {
    extend: 'Ext.app.Controller',

    stores: [
        'dict.SalecaseWaitReasons'
    ],
    models: [
        'dict.SalecaseWaitReason'
    ],

    views: [
//        'salelog.QuoteTab',
//        'salelog.QuotedItemGrid',
//        'salelog.NewQuoteForm',
//        'salelog.QuoteItemForm'
    ],

//    refs: [{
//        ref: 'grid',
//        selector: 'salelog_quote_grid'
//    }],

    init: function() {
        var me = this;

        me.control({

        });
    }
});