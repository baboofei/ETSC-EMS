Ext.define('EIM.controller.salelog.mail.Samples', {
    extend: 'Ext.app.Controller',

    stores: [
        'MailedSamples'
    ],
    models: [
        'MailedSample'
    ],

    views: [
        'salelog.MailTab',
        'salelog.MailedSampleGrid'
    ],

    refs: [{
        ref: 'grid',
        selector: 'mailed_sample_grid'
    }],

    init: function() {
        var me = this;

        me.control({
            /**
             * 新增/修改寄样品
             */
            'button[action=addMailSample]': {
            	click: this.addMailSample
	        },
	        'button[action=editMailSample]': {
	            click: this.editMailedSample
	        },
            'mailed_sample_grid': {
                itemdblclick: this.editMailedSample,
                selectionchange: this.selectionChange
            },
            /**
             * 标签激活时加载相应store
             * 如果是“编辑”操作，只会激活一个标签，那么别的数据就都不用加载
             */
            'salelog_form mailed_sample_grid': {
                render: this.activeMailedSamples
            },
            'salelog_form mailed_content_grid': {
                render: this.activeMailedContents
            },
            'salelog_form mailed_processing_piece_to_vendor_grid': {
                render: this.activeMailedProcessingPieceToVendors
            },
            'salelog_form mailed_processing_piece_to_customer_grid': {
                render: this.activeMailedProcessingPieceToCustomers
            },
            'salelog_form mailed_product_grid': {
                render: this.activeMailedProducts
            }
        })
    },

    addMailSample: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.mail.SampleForm');
        //widget里写了autoShow，不要执行回调函数的话就不用show一下了
        var view = Ext.widget('mail_sample_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.show();
        btn_update.hide();
    },
    editMailedSample: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.mail.SampleForm');
        var record = me.getGrid().getSelectedItem();
        var view = Ext.widget('mail_sample_form');
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
    selectionChange: function(selectionModel, selected, eOpts) {
        var edit_btn = this.getGrid().down("[iconCls=btn_edit]");
        if(selected.length > 0){
            edit_btn.setDisabled(false);
        }else{
            edit_btn.setDisabled(true);
        }
    },

    activeMailedSamples: function() {
        Ext.getStore("MailedSamples").load();
    },
    activeMailedContents: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.mail.Contents');
        Ext.getStore("MailedContents").load();
    },
    activeMailedProcessingPieceToVendors: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.mail.ProcessingPieceToVendors');
        Ext.getStore("MailedProcessingPieceToVendors").load();
    },
    activeMailedProcessingPieceToCustomers: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.mail.ProcessingPieceToCustomers');
        Ext.getStore("MailedProcessingPieceToCustomers").load();
    },
    activeMailedProducts: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.mail.Products');
        Ext.getStore("MailedProducts").load();
    }
});