Ext.define('EIM.controller.salelog.mail.ProcessingPieceToCustomers', {
    extend: 'Ext.app.Controller',

    stores: [
        'MailedProcessingPieceToCustomers'
    ],
    models: [
        'MailedProcessingPieceToCustomer'
    ],

    views: [
        'salelog.MailTab',
        'salelog.MailedProcessingPieceToCustomerGrid'
    ],

    refs: [{
        ref: 'grid',
        selector: 'mailed_processing_piece_to_customer_grid'
    }],

    init: function() {
        var me = this;

        me.control({
            /**
             * 新增/修改寄加工件(给客户)
             */
            'button[action=addMailProcessingPieceToCustomer]': {
                click: this.addMailProcessingPieceToCustomer
            },
            'button[action=editMailProcessingPieceToCustomer]': {
                click: this.editMailedProcessingPieceToCustomer
            },
            'mailed_processing_piece_to_customer_grid': {
                itemdblclick: this.editMailedProcessingPieceToCustomer,
                selectionchange: this.selectionChange
            }
        })
    },

    addMailProcessingPieceToCustomer: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.mail.ProcessingPieceToCustomerForm');
        //widget里写了autoShow，不要执行回调函数的话就不用show一下了
        var view = Ext.widget('mail_processing_piece_to_customer_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.show();
        btn_update.hide();
    },
    editMailedProcessingPieceToCustomer: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.mail.ProcessingPieceToCustomerForm');
        var record = me.getGrid().getSelectedItem();
        var view = Ext.widget('mail_processing_piece_to_customer_form');
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        var btn_print = view.down('print_express_sheet_button', false);
//        var hidden = view.down('hidden[name=customer_ids]', false);
        btn_save.hide();
        btn_update.show();
        btn_print.enable();
//        hidden.setValue(record.get('customer_id'));
        view.down('form').loadRecord(record);
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