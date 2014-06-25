Ext.define('EIM.controller.quote.Form', {
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
        'quote.Form'
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
            'quote_form button[action=save]': {
                click: this.validate
            },
            'quote_form combo[name=customer_id]': {
                select: this.filterSalecase
            },
            'quote_form combo[name=case_id]': {
                beforequery: function(queryEvent, records, eOpts) {
                    delete queryEvent.combo.lastQuery;
                }
            }
        });
    },
    
    validate: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        
        if(form.form.isValid()) {
            button.disable();
            form.form.submit({
                url: 'quotes/process_workflow',
                params: {
                    "event": "sale_save"//销售新增
                },
                submitEmptyText:false,
                success: function() {
                    win.close();
                    Ext.example.msg('成功', '报价保存成功，请继续填写详细信息');
                    Ext.getStore('Quotes').load();
                },
                failure: function() {
                    Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                }
            });
        }
    },
    
    filterSalecase: function(combo, records, eOpts) {
        var form = combo.up('form');
        var case_field = form.down('[name=salelog>salecase>id]', false);
//        console.log(case_field.getValue());
        case_field.getStore().getProxy().setExtraParam('customer_id', records[0].get('id'))
    }
});