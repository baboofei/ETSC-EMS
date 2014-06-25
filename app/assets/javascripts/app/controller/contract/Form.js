Ext.define('EIM.controller.contract.Form', {
    extend:'Ext.app.Controller',

    stores:[
//        'dict.SendStatuses',
//        'dict.CheckAndAcceptStatuses',
//        'ComboQuoteSales'
    ],
    models:[
//        'dict.SendStatus',
//        'dict.CheckAndAcceptStatus',
//        'ComboQuoteSale'
    ],

    views:[
        'contract.Form'
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
            'contract_form button[action=save]': {
                click: this.saveContract
            }
        });
    },

    saveContract: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        if(form.form.isValid()) {
            button.disable();
//            console.log(form.down('[name=pay_mode_id]', false).getValue());
//            console.log(form.down('[name=pay_mode_id]', false).getRawValue());
            form.submit({
                url: 'contracts/process_workflow',
                params: {
                    "event": "create",
                    "buyer_customer_id": form.down('[name=buyer_customer_name] combo', false).getValue(),
                    "end_user_customer_id": form.down('[name=end_user_customer_name] combo', false).getValue()
                },
                submitEmptyText: false,
                success: function() {
                    win.close();
                    Ext.example.msg('成功', '合同保存成功，请继续填写详细信息');
                    Ext.getStore('Contracts').load();
                },
                failure: function() {
                    Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                }
            });
        }
    }
});