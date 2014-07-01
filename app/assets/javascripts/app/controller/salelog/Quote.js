/**
 * 报价标签页上的controller
 * TODO 很多事件应该用on来加载，但先这么用着吧，以后有空改……
 */
Ext.define('EIM.controller.salelog.Quote', {
    extend:'Ext.app.Controller',

    stores:[
//        'Quotes',
//        'QuoteItems',
//        'ComboSalecases',
//        'ComboOurCompanies',
//        'ComboSales',
//        'dict.QuoteTypes',
//        'dict.QuoteLanguages',
//        'dict.QuoteFormats'
    ],
    models:[
//        'Quote',
//        'QuoteItem',
//        'ComboSalecase',
//        'ComboOurCompany',
//        'ComboSale',
//        'dict.QuoteType',
//        'dict.QuoteLanguage',
//        'dict.QuoteFormat'
    ],

    views:[
//        'etscux.AmountWithCurrency',
//        'quote.Panel',
//        'quote.Grid',
//        'quote.Detail',
//        'quote.Info',
//        'quote.ItemPanel',
//        'quote.ItemConfig',
//        'quote.ItemTree',
//        'quote.ItemFoot',
//        'quote.ItemFee',
//        'quote.Term'
    ],

    refs:[
//        {
//            ref: 'grid',
//            selector: 'quote_grid'
//        },
//        {
//            ref: 'itemgrid',
//            selector: 'quote_item_tree'
//        }
    ],

    init:function () {
        var me = this;
        me.control({
        });
    },

    quoteSelectionChange:function (selectionModel, selected, eOpts) {
    }
});