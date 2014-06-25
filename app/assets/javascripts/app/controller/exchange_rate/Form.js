Ext.define('EIM.controller.exchange_rate.Form', {
    extend:'Ext.app.Controller',

    stores:[
                'dict.Currencies'
        //        'dict.CheckAndAcceptStatuses',
        //        'Terms'
    ],
    models:[
                'dict.Currency'
        //        'dict.CheckAndAcceptStatus',
        //        'Term'
    ],

    views:[
        'exchange_rate.Form'
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
            'exchange_rate_form combo': {
                select: this.toggleExchangeRateEnable
            },
            'exchange_rate_form button[action=save]': {
                click: this.saveExchangeRate
            },
            'exchange_rate_form button[action=apply]': {
                click: this.applyExchangeRate
            }
        });
    },

    /**
     * 币种是RMB的时候，汇率固定成100不能改
     * @param combo
     * @param records
     * @param eOpts
     */
    toggleExchangeRateEnable: function(combo, records, eOpts) {
        var form = combo.up('form');
        var win = form.up('window');
        var numberfield = form.down('numberfield', false);
        var save_btn = win.down('button[action=save]', false);
        var apply_btn = win.down('button[action=apply]', false);
        if(combo.getValue() === 11) {
            numberfield.setValue(100);
            numberfield.disable();
            save_btn.disable();
            apply_btn.disable();
        }else{
            numberfield.setValue(records[0].get('exchange_rate'));
            numberfield.enable();
            save_btn.enable();
            apply_btn.enable();
        }
    },

    /**
     * “确定”=“应用”+关闭窗口
     * “应用”=发出Ajax请求，
     * 并在其下层的form(可能是ItemForm也可能是BlockForm)里查找是否用到了此币种的汇率，
     * 如果用到了就要更新对应的hidden以便计算和提交
     * @param button
     */
    saveExchangeRate: function(button) {
        var win = button.up('window');
        this.applyExchangeRate(button);
        win.close();
    },
    applyExchangeRate: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var currency_field = form.down('combo', false);
        var exchange_rate_field = form.down('numberfield', false);
        form.submit({
            url:'currencies/update_exchange_rate',
            params: {
                currency_id: currency_field.getValue(),
                exchange_rate: exchange_rate_field.getValue()
            },
            success: function(the_form, action) {
                var response = action.response;
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);
            },
            failure: function() {

            }
        });

        var exchange_rate_hash = Ext.ComponentQuery.query('functree')[0].allCurrency;

        Ext.Array.each(exchange_rate_hash, function(item, index, allItems) {
            if(item['id'] === currency_field.getValue()) {
                allItems[index]['exchange_rate'] = exchange_rate_field.getValue();
                return false;
            }
        });

        var target_exchange_rate_field = Ext.ComponentQuery.query('[name=original_exchange_rate]')[0];
        var target_exchange_rate_field_2 = target_exchange_rate_field.nextSibling();
        var target_form = target_exchange_rate_field.up('form');
        var target_currency_field = target_form.down('combo[name=source_price_currency_id]', false);
        var target_currency_field_2 = target_form.down('combo[name=unit_price_currency_id]', false);
        if(target_currency_field.getValue() === currency_field.getValue()) {
            target_exchange_rate_field.setValue(exchange_rate_field.getValue());
        }
        if(target_currency_field_2.getValue() === currency_field.getValue()) {
            target_exchange_rate_field_2.setValue(exchange_rate_field.getValue());
        }
    }
});