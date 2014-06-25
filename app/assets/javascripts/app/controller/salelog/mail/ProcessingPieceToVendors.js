Ext.define('EIM.controller.salelog.mail.ProcessingPieceToVendors', {
    extend: 'Ext.app.Controller',

    stores: [
        'MailedProcessingPieceToVendors'
    ],
    models: [
        'MailedProcessingPieceToVendor'
    ],

    views: [
        'salelog.MailTab',
        'salelog.MailedProcessingPieceToVendorGrid'
    ],

    refs: [{
        ref: 'grid',
        selector: 'mailed_processing_piece_to_vendor_grid'
    }],

    init: function() {
        var me = this;

        me.control({
            /**
             * 新增/修改寄加工件(给工厂)
             */
            'button[action=addMailProcessingPieceToVendor]': {
                click: this.addMailProcessingPieceToVendor
            },
            'button[action=editMailProcessingPieceToVendor]': {
                click: this.editMailedProcessingPieceToVendor
            },
            'mailed_processing_piece_to_vendor_grid': {
                itemdblclick: this.editMailedProcessingPieceToVendor,
                selectionchange: this.selectionChange
            }
        });
    },

    addMailProcessingPieceToVendor: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.mail.ProcessingPieceToVendorForm');
        //widget里写了autoShow，不要执行回调函数的话就不用show一下了
        var view = Ext.widget('mail_processing_piece_to_vendor_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.show();
        btn_update.hide();
    },
    editMailedProcessingPieceToVendor: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.mail.ProcessingPieceToVendorForm');
        var record = me.getGrid().getSelectedItem();
        var view = Ext.widget('mail_processing_piece_to_vendor_form');
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        var btn_print = view.down('print_express_sheet_button', false);
//        var hidden = view.down('hidden[name=customer_ids]', false);
        btn_save.hide();
        btn_update.show();
        btn_print.enable();
        console.log(record);
//        hidden.setValue(record.get('customer_id'));
        view.down('form').loadRecord(record);
        //给combo做一个假的store以正确显示值
        var vendor_unit_field = view.down('[name=vendor_unit_id]', false);
        vendor_unit_field.getStore().loadData([
            [record.get('vendor_unit_id'), record.get('vendor_unit_name')]
        ]);
        vendor_unit_field.setValue(record.get('vendor_unit_id'));
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