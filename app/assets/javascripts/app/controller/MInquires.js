Ext.define('EIM.controller.MInquires', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridMInquires',
        'ComboUsers'
    ],
    models: [
        'GridMInquire',
        'ComboUser'
    ],

    views: [
        'm_inquire.Grid',
        'm_inquire.Form',
        'm_inquire.TransferForm'
    ],

    refs: [
        {
            ref: 'grid',
            selector: 'm_inquire_grid'
        }
    ],

    init: function() {
        this.control({
            'm_inquire_grid': {
                itemdblclick: this.editMInquire,
                selectionchange: this.selectionChange
            },
            'm_inquire_form button[action=save]': {
                click: this.updateMInquire
            },
            'button[action=addMInquire]': {
                click: this.addMInquire
            },
            'button[action=transferMInquire]': {
                click: this.transferMInquire
            },
            'm_inquire_transfer_form button[action=save]': {
                click: this.transferSubmit
            }
        });
    },

    addMInquire: function() {
        var view = Ext.widget('m_inquire_form');
        view.show();
    },

    editMInquire: function() {
        var record = this.getGrid().getSelectedItem();
        if(record.get('transferred') === false) {
            //转走了的不能编辑
            var view = Ext.widget('m_inquire_form').show();
            view.down('form', false).loadRecord(record);
        }
    },

    updateMInquire: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: 'm_inquires/save_m_inquire',
                //                params: submit_params,
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridMInquires').load();
                }
            });
        }
    },

    selectionChange: function(selectionModel, selections) {
        var grid = this.getGrid();
        var trans_btn = grid.down('button[action=transferMInquire]', false);

        if(selections.length > 0 && selections[0].get('transferred') === false) {
            trans_btn.enable();
        } else {
            trans_btn.disable();
        }
    },

    transferMInquire: function() {
        Ext.widget('m_inquire_transfer_form').show();
    },

    transferSubmit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var grid = Ext.ComponentQuery.query('m_inquire_grid')[0];
        var selection = grid.getSelectionModel().getSelection();
        var customer_ids = Ext.Array.pluck(Ext.Array.pluck(selection, "data"), "id");
        var customer_ids_str = customer_ids.join("|");
        if(form.form.isValid()) {
            //防双击
            button.disable();

            form.submit({
                url: '/m_inquires/trans_to',
                params: {
                    customer_ids: customer_ids_str
                },
                submitEmptyText:false,
                success: function(the_form, action){
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridMInquires').load();
                }
            });
        }
    }
});
