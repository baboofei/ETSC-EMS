Ext.define('EIM.controller.salelog.Cancel', {
    extend: 'Ext.app.Controller',

    stores: [
        'dict.SalecaseCancelReasons'
    ],
    models: [
        'dict.SalecaseCancelReason'
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