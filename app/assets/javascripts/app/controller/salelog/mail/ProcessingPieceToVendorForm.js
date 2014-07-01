/**
 * 拆开后单独加载“新增/修改寄加工件(往工厂)”视图用的controller
 */
Ext.define('EIM.controller.salelog.mail.ProcessingPieceToVendorForm', {
    extend: 'Ext.app.Controller',

    stores: [
        'ComboOurCompanies',
        'ComboVendors'
    ],
    models: [
        'ComboOurCompany',
        'ComboVendor'
    ],

    views: [
        'salelog.MailProcessingPieceToVendorForm',
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
            'mail_processing_piece_to_vendor_form expandable_vendor_unit_combo combo': {
                select: this.updateVendorCombo
            },
            'mail_processing_piece_to_vendor_form expandable_vendor_combo combo': {
                select: this.enableExpressButton
            },
            'mail_processing_piece_to_vendor_form combo[name=express_id]': {
                select: this.enableExpressButton
            },
            'mail_processing_piece_to_vendor_form combo[name=our_company_id]': {
                select: this.enableExpressButton
            },
            'mail_processing_piece_to_vendor_form print_express_sheet_button': {
                click: this.printExpressSheet
            },
            'mail_processing_piece_to_vendor_form button[action=save]': {
                click: this.validate
            },
            'mail_processing_piece_to_vendor_form button[action=update]': {
            	click: this.validate
            }
        });
    },

    updateVendorCombo: function(combo, records) {
        var form = combo.up('form');
        var vendor_combo = form.down('expandable_vendor_combo combo', false);
        vendor_combo.getStore().getProxy().extraParams['vendor_unit_id'] = records[0].get("id");
        vendor_combo.reset();

    },

    enableExpressButton: function(combo) {
        var form = combo.up('form');
        var vendor_combo = form.down('[name=vendor_id]', false);
        var express_combo = form.down('[name=express_id]', false);
        var our_company_combo = form.down('[name=our_company_id]', false);
        if(!Ext.isEmpty(vendor_combo.getValue()) && !Ext.isEmpty(express_combo.getValue()) && !Ext.isEmpty(our_company_combo.getValue())) {
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
                receiver_ids: values['vendor_id'],
                receiver_type: 'vendor',
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
        values['vendor_unit_name'] = form.down('[name=vendor_unit_id]', false).getRawValue();
        values['vendor_name'] = form.down('[name=vendor_id]', false).getRawValue();

        var store = Ext.getStore("MailedProcessingPieceToVendors");
        if(form.form.isValid()){
            if(button.action === "save") {
            	//新增
            	store.add(values);
            }else{
            	//修改，找出修改哪一条
        		var record = Ext.ComponentQuery.query("mailed_processing_piece_to_vendor_grid")[0].getSelectionModel().getSelection()[0];
    			record.set(values);
            }
            win.close();
        }
    }
});