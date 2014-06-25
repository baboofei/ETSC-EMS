Ext.define('EIM.controller.contract.QuoteForm', {
    extend:'Ext.app.Controller',

    stores:[
        'ComboContractQuotes'
//        'dict.SendStatuses',
//        'dict.CheckAndAcceptStatuses',
//        'Terms'
    ],
    models:[
        'ComboContractQuote'
//        'dict.SendStatus',
//        'dict.CheckAndAcceptStatus',
//        'Term'
    ],

    views:[
        'contract.QuoteForm'
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
            'contract_quote_form button[action=next]': {
                click: this.addContract
            }
        });
    },

    addContract: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        var me = this;
        if(form.form.isValid()) {
            var combo = form.down('combo', false);
            var quote_id = combo.getValue();
            var store = combo.getStore();
            load_uniq_controller(me, 'contract.Form');
            win.close();
            var view = Ext.widget('contract_form').show();
            if(quote_id != 0) {
                var record = store.getById(quote_id);
                view.down('[name=summary]', false).setValue(record.get('summary'));
                view.down('[name=quote_id]', false).setValue(quote_id);

                //给combo做一个假的store以正确显示值
                var customer_unit_field = view.down('expandable_customer_unit_combo combo', false);
                customer_unit_field.getStore().loadData([[record.get('customer_unit_id'), record.get('customer_unit_name')]]);
                customer_unit_field.setValue(record.get('customer_unit_id'));

                var buyer_field = view.down('expandable_customer_combo[name=buyer_customer_name] combo', false);
                buyer_field.getStore().loadData([[record.get('customer_id'), record.get('customer_name')]]);
                buyer_field.setValue(record.get('customer_id'));
                var end_user_field = view.down('expandable_customer_combo[name=end_user_customer_name] combo', false);
                end_user_field.getStore().loadData([[record.get('customer_id'), record.get('customer_name')]]);
                end_user_field.setValue(record.get('customer_id'));

                var our_company_field = view.down('[name=our_company_id]', false);
                our_company_field.setValue(record.get('our_company_id'));

                var signer_field = view.down('[name=signer_user_id]', false);
                signer_field.setValue(record.get('sale_user_id'));

                //币种和金额
                var currency_field = view.down('amount_with_currency combo', false);
                currency_field.setValue(record.get('currency_id'));
                var amount_field = view.down('amount_with_currency numberfield', false);
                amount_field.setValue(record.get('final_price'));
            }
        }
    }
});


