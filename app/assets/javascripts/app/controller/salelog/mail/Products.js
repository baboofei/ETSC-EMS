Ext.define('EIM.controller.salelog.mail.Products', {
    extend: 'Ext.app.Controller',

    stores: [
        'MailedProducts'
    ],
    models: [
        'MailedProduct'
    ],

    views: [
        'salelog.MailTab',
        'salelog.MailedProductGrid'
    ],

    refs: [{
        ref: 'grid',
        selector: 'mailed_product_grid'
    }],

    init: function() {
        var me = this;

        me.control({
            /**
             * 新增/修改寄产品
             */
            'button[action=addMailProduct]': {
                click: this.addMailProduct
            },
            'button[action=editMailProduct]': {
                click: this.editMailedProduct
            },
            'mailed_product_grid': {
                itemdblclick: this.editMailedProduct,
                selectionchange: this.selectionChange
            }
        })
    },

    addMailProduct: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.mail.ProductForm');
        //widget里写了autoShow，不要执行回调函数的话就不用show一下了
        var view = Ext.widget('mail_product_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.show();
        btn_update.hide();
    },
    editMailedProduct: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.mail.ProductForm');
        var record = me.getGrid().getSelectedItem();
        var view = Ext.widget('mail_product_form');
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        var btn_print = view.down('print_express_sheet_button', false);
//        var hidden = view.down('hidden[name=customer_ids]', false);
        btn_save.hide();
        btn_update.show();
        btn_print.enable();
//        hidden.setValue(record.get('customer_id'));
        view.down('form').loadRecord(record);
        if(record.get('our_company_id') === 1) view.down('radiogroup', false).enable();
    },
    selectionChange: function(selectionModel, selected) {
        var edit_btn = this.getGrid().down("[iconCls=btn_edit]");
        if(selected.length > 0){
            edit_btn.setDisabled(false);
        }else{
            edit_btn.setDisabled(true);
        }
    }
});