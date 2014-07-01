Ext.define('EIM.controller.contract.DivideSendingForm', {
    extend:'Ext.app.Controller',

    stores:[
    ],
    models:[
    ],

    views:[
        'contract.DivideSendingForm'
    ],

    init:function () {
        var me = this;

        me.control({
            'divide_sending_form button[action=save]': {
                click: this.divideSendingSubmit
            }
        });
    },

    divideSendingSubmit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        if(form.form.isValid()) {
            form.submit({
                url: 'contract_items/divide_contract_item',
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('ContractItems').load();
                },
                failure: function() {
                    Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                }
            })
        }
    }
});