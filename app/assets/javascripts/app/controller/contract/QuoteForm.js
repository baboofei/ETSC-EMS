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
            'contract_quote_form boxselect': {
                change: this.triggerNoneQuote
            },
            'contract_quote_form button[action=next]': {
                click: this.addContract
            }
        });
    },

    triggerNoneQuote: function(box, newValue, oldValue) {
        var me = this;
        var all_old_ids = (Ext.isEmpty(oldValue) ? "" : oldValue.split(", "));
        var all_new_ids = (Ext.isEmpty(newValue) ? "" : newValue.split(", "));
        if(all_new_ids.indexOf("0") != -1 && all_old_ids.indexOf("0") === -1) {
            //选了“无报价”，则把别的都清空，只留下“无报价”
            box.un('change', me.triggerNoneQuote, this);
            box.setValue(0);
            box.on('change', me.triggerNoneQuote, this);
        } else if(all_new_ids.indexOf("0") != -1 && Ext.Array.difference(all_new_ids , all_old_ids) != ["0"]) {
            //之前有“无报价”，新选了一项别的，则留下这个“别的”，清空“无报价”
            box.un('change', me.triggerNoneQuote, this);
            box.removeValue([0]);
            box.on('change', me.triggerNoneQuote, this);
        }
        if(oldValue === "0" && Ext.isEmpty(newValue)) {
            box.setValue(0);
        }
    },

    addContract: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        var me = this;
        if(form.form.isValid()) {
            var boxselect = form.down('boxselect', false);
            var quote_id = boxselect.getValue();
            var store = boxselect.getStore();
            load_uniq_controller(me, 'contract.Form');
            win.close();
            var view = Ext.widget('contract_form').show();
            console.log(quote_id);

            if(quote_id === [0]) {
                //无报价，啥也不传
            } else {
                var record = store.getById(quote_id[0]);
                view.down('[name=summary]', false).setValue(record.get('summary'));
                view.down('[name=quote_id]', false).setValue(quote_id.join("|"));

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


