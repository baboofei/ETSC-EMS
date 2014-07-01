Ext.define('EIM.controller.quote.ServiceForm', {
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
        'quote.ServiceForm'
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
            'quote_service_form button[action=save]': {
                click: this.validate
            }
        });
    },
    
    validate: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        
        if(form.form.isValid()) {
            button.disable();
            form.submit({
                url: 'quotes/process_workflow',
                params: {
                    "event": "support_save",//TSD新增
                    "flow_sheet_id": Ext.ComponentQuery.query('flow_sheet_grid')[0].getSelectedItem().get("id")
                },
                submitEmptyText:false,
                success: function() {
                    win.close();
                    Ext.example.msg('成功', '报价保存成功，请继续填写详细信息');
                    Ext.getStore('ServiceLogs').load();
                },
                failure: function() {
                    Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                }
            });
        }
    }
});