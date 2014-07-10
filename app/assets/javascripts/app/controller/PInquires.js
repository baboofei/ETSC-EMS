Ext.define('EIM.controller.PInquires', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridPInquires',
        'VendorUnits',
        'ComboUsers'
    ],
    models: [
        'GridPInquire',
        'VendorUnit',
        'ComboUser'
    ],

    views: [
        'p_inquire.Grid',
        'p_inquire.Form',
        'p_inquire.TransferForm'
    ],

    refs: [{
        ref: 'grid',
        selector: 'p_inquire_grid'
    }],

    init: function() {
        this.control({
            'p_inquire_grid': {
                itemdblclick: this.editPInquire,
                selectionchange: this.selectionChange
            },
            'p_inquire_form button[action=save]': {
                click: this.updatePInquire
            },
            'button[action=addPInquire]': {
                click: this.addPInquire
            },
            'button[action=transferPInquire]': {
                click: this.transferPInquire
            },
            'p_inquire_transfer_form button[action=save]': {
                click: this.transferSubmit
            }
        });
    },

    addPInquire: function() {
        var view = Ext.widget('p_inquire_form');
        view.show();
    },

    editPInquire: function() {
        var record = this.getGrid().getSelectedItem();
        if (record.get('transferred') === false) {
            //转走了的不能编辑
            var view = Ext.widget('p_inquire_form').show();
            view.down('form', false).loadRecord(record);
        }
    },

    updatePInquire: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        if (form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: 'p_inquires/save_p_inquire',
                //                params: submit_params,
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridPInquires').load();
                }
            });
        }
    },

    selectionChange: function(selectionModel, selections) {
        var grid = this.getGrid();
        var trans_btn = grid.down('button[action=transferPInquire]', false);

        if (selections.length > 0 && selections[0].get('transferred') === false) {
            trans_btn.enable();
        } else {
            trans_btn.disable();
        }
    },

    transferPInquire: function() {
        Ext.widget('p_inquire_transfer_form').show();
    },

    transferSubmit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var grid = Ext.ComponentQuery.query('p_inquire_grid')[0];
        var selection = grid.getSelectionModel().getSelection();
        var customer_ids = Ext.Array.pluck(Ext.Array.pluck(selection, "data"), "id");
        var customer_ids_str = customer_ids.join("|");
        if (form.form.isValid()) {
            //防双击
            button.disable();

            form.submit({
                url: '/p_inquires/trans_to',
                params: {
                    customer_ids: customer_ids_str
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridPInquires').load();
                }
            });
        }
    }
});