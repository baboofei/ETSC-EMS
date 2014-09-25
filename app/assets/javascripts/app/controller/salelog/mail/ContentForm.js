/**
 * 拆开后单独加载“新增/修改寄目录”视图用的controller
 */
Ext.define('EIM.controller.salelog.mail.ContentForm', {
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
        'salelog.MailContentForm',
        'express_sheet.Form',
        'express_sheet.SimpleForm'
    ],

//    refs: [{
//        ref: 'list',
//        selector: 'recommended_item_grid'
//    }],

    init: function() {
        var me = this;

        me.control({
            'mail_content_form combo[name=customer_id]': {
                render: this.loadCustomer,
                select: this.enableExpressButton
//                select: this.modifyCustomerIds
            },
            'mail_content_form combo[name=express_id]': {
                select: this.enableExpressButton
            },
            'mail_content_form combo[name=our_company_id]': {
                select: this.enableExpressButtonAndRadio
            },
            'mail_content_form print_express_sheet_button': {
                click: this.printExpressSheet
            },
            'mail_content_form button[action=save]': {
                click: this.validate
            },
            'mail_content_form button[action=update]': {
            	click: this.validate
            }
        });
    },

    /**
     * 根据选中的案子提取客户供选择收件人
     * @param combo
     */
    loadCustomer: function(combo) {
        var salecase_id;
        salecase_id = Ext.ComponentQuery.query('salecase_grid')[0].getSelectedItem().get("id");
        combo.getStore().getProxy().setExtraParam('salecase_id', salecase_id)
    },

    /**
     * 选择客户的时候把id传给hidden域，供打印按钮调用
     * @param combo
     * @param records
     */
//    modifyCustomerIds: function(combo, records) {
//        var record = records[0];
//        var hidden = combo.up('form').down('hidden[name=customer_ids]', false);
//        var button = combo.up('form').down('print_express_sheet_button', false);
//        hidden.setValue(record.get('id'));
//        button.enable();
//    },

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

    enableExpressButtonAndRadio: function(combo) {
        var me = this;
        var form = combo.up('form');
        var radio = form.down('radiogroup', false);
        if(combo.getValue() != 1) {
            radio.setValue({send_mail_target: '1'});
        } else {
            radio.reset();
        }
        radio.setDisabled(combo.getValue() != 1);
        me.enableExpressButton(combo);
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
                our_company_id: values['our_company_id'],
                item_description: values['model']
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
        values['send_mail_target'] = form.down('[name=send_mail_to]', false).getValue()['send_mail_target'];

        var store = Ext.getStore("MailedContents");

        if(Ext.isEmpty(values["timestamp"])) {
            Ext.example.msg("错误", "你还没打印呢！");
            return false;
        }
        if(form.form.isValid()){
            if(button.action === "save") {
            	//新增
            	store.add(values);
            }else{
            	//修改，找出修改哪一条
        		var record = Ext.ComponentQuery.query("mailed_content_grid")[0].getSelectionModel().getSelection()[0];
    			record.set(values);
            }
            win.close();
        }
    }
});