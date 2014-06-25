/**
 * 拆开后单独加载“新增/修改寄样品”视图用的controller
 */
Ext.define('EIM.controller.salelog.mail.SampleForm', {
    extend: 'Ext.app.Controller',

    stores: [
        'ComboOurCompanies',
        'MiniCustomers'
    ],
    models: [
        'ComboOurCompany',
        'MiniCustomer'
    ],

    views: [
        'salelog.MailSampleForm',
        'express_sheet.SimpleForm'
    ],

//    refs: [{
//        ref: 'list',
//        selector: 'recommended_item_grid'
//    }],

    init: function() {
        var me = this;

        me.control({
            'mail_sample_form combo[name=customer_id]': {
                render: this.loadCustomer,
                select: this.enableExpressButton
            },
            'mail_sample_form combo[name=express_id]': {
                select: this.enableExpressButton
            },
            'mail_sample_form combo[name=our_company_id]': {
                select: this.enableExpressButton
            },
            'mail_sample_form print_express_sheet_button': {
                click: this.printExpressSheet
            },
            'mail_sample_form button[action=save]': {
                click: this.validate
            },
            'mail_sample_form button[action=update]': {
            	click: this.validate
            }
        });
    },

    /**
     * 根据选中的案子提取客户供选择收件人
     * @param combo
     */
    loadCustomer: function(combo) {
        var salecase_id = Ext.ComponentQuery.query('salecase_grid')[0].getSelectedItem().get("id");
        combo.getStore().getProxy().setExtraParam('salecase_id', salecase_id)
    },

    enableExpressButton: function(combo) {
        var form = combo.up('form');
        var customer_combo = form.down('[name=customer_id]', false);
        var express_combo = form.down('[name=express_id]', false);
        var our_company_combo = form.down('[name=our_company_id]', false);
        if(!Ext.isEmpty(customer_combo.getValue()) && !Ext.isEmpty(express_combo.getValue()) && !Ext.isEmpty(our_company_combo.getValue())) {
            var button = form.down('print_express_sheet_button', false);
            button.enable();
        }
    },

    printExpressSheet: function(button) {
        var form = button.up('form');
        var values = form.getValues();
        button.disable();
        Ext.Msg.alert('好了', '去拿单子吧', function() {
            button.enable();
        });
        Ext.Ajax.request({
            url: 'express_sheets/updated_print_express_sheet',
            params: {
                receiver_ids: values['customer_id'],
                receiver_type: 'customer',
                express_id: values['express_id'],
                our_company_id: values['our_company_id']
            },
            success: function(response) {
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg['timestamp']);
                //返回的pdf文件名存到hidden里备用
                form.down('[name=timestamp]', false).setValue(msg['timestamp']);
            },
            failure: function() {
                Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
            }
        });
    },

    validate: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var values = form.getValues();
        values['customer_name'] = form.down('[name=customer_id]', false).getRawValue();

        var store = Ext.getStore("MailedSamples");
        if(form.form.isValid()){
            if(button.action === "save") {
            	//新增
            	store.add(values);
            }else{
            	//修改，找出修改哪一条
        		var record = Ext.ComponentQuery.query("mailed_sample_grid")[0].getSelectionModel().getSelection()[0];
    			record.set(values);
            }
            win.close();
        }
    }
})