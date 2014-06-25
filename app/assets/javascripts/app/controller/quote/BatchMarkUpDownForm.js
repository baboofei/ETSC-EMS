Ext.define('EIM.controller.quote.BatchMarkUpDownForm', {
    extend:'Ext.app.Controller',

    stores:[
//        'dict.SendStatuses',
//        'dict.CheckAndAcceptStatuses',
//        'Terms'
    ],
    models:[
//        'dict.SendStatus',
//        'dict.CheckAndAcceptStatus',
//        'Term'
    ],

    views:[
        'quote.BatchMarkUpDownForm'
    ],

    //    refs:[
    //        {
    //            //            ref:'grid',
    //            //            selector:'recommended_item_grid'
    //            //                }, {
    //            //            ref: 'form',
    //            //            selector: 'contract_item_form'
    //            //    }, {
    //            //        ref: 'btnCreate',
    //            //        selector: 'recommend_item_form button[action=create]'
    //            //    }, {
    //            //        ref: 'btnUpdate',
    //            //        selector: 'recommend_item_form button[action=update]'
    //        }
    //    ],

    init:function () {
        var me = this;

        me.control({
            'quote_batch_mark_up_down_form button[action=save]': {
                click: function(button) {
                    var win = button.up('window');
                    var form = win.down('form', false);
                    var times = form.down('[name=times]').getValue();
                    var divide = form.down('[name=divide]').getValue();
                    if(times === 0 || times === null) times = 1;
                    if(divide === 0 || divide === null) divide = 1;
                    
                    var grid = Ext.ComponentQuery.query('quote_item_tree')[0];
                    var selection = grid.getSelectedItems();
                    Ext.Array.each(selection, function(item, index, allItems) {
//                        console.log(item.get('unit_price'));
//                        console.log(item.get('discount'));
//                        console.log(item.get('discount_to'));
//                        console.log(item.get('total'));
                        item.set('times_2', times);
                        item.set('divide_2', divide);
                        item.set('discount_to', Math.ceil((item.get('unit_price') * times / divide) / 5) * 5);
                        item.set('discount', item.get('unit_price') - item.get('discount_to'));
                        item.set('total', item.get('discount_to') * item.get('quantity'));
                    });
                    this.getController('Quotes').reCalculateTree();
                    win.close();
                }
            }
        });
    }
});