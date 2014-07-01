/**
 * 单独加载一个选择已有个案Grid用的controller
 */
Ext.define('EIM.controller.customer.ConfirmSalecaseForm', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridPossibleSalecases'
    ],

    models: [
        'GridSalecase'
    ],

    views: [
        'customer.ConfirmSalecaseForm'/*,
        'etscux.ExpandableCustomerUnitCombo'*/
    ],

    init: function() {
        var me = this;

        me.control({
            'customer_confirm_salecase_form grid': {
                selectionchange: this.selectionChange
            },
            'customer_confirm_salecase_form button[action=save_into]': {
                click: this.saveIntoSelection
            },
            'customer_confirm_salecase_form button[action=save_new]': {
                click: this.saveToNew
            }
        });
    },

    selectionChange: function(selectionModel, selected) {
        var me = this;
        var btn_save_into = Ext.ComponentQuery.query('customer_confirm_salecase_form button[action=save_into]')[0];

        if(selected.length > 0) {
            btn_save_into.enable();
        }else{
            btn_save_into.disable();
        }
    },

    saveIntoSelection: function(button) {
        var check_dup_win = Ext.ComponentQuery.query('customer_check_dup_form')[0];
        var grid = check_dup_win.down('grid', false);
        var selection = grid.getSelectedItem();

        var inquire_type_field = check_dup_win.down('[name=inquire_type]', false);
        var inquire_id_field = check_dup_win.down('[name=inquire_id]', false);
        var detail_field = check_dup_win.down('[name=detail]', false);
        var params = check_dup_win.down('[name=out]', false).getValues();
        params['id'] = selection.get('id');
        params['application_names'] = "";
        params['inquire_type'] = inquire_type_field.getValue();
        params['inquire_id'] = inquire_id_field.getValue();
        params['detail'] = detail_field.getValue();

        var salecase_win = button.up('window');
        var grid = salecase_win.down('grid', false);
        var selected_id = grid.getSelectionModel().getSelection()[0].get("id");
        params['selected_salecase_id'] = selected_id;

        Ext.Ajax.request({
            url: 'customers/save_customer',
            params: params,
            success: function(response) {
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);
                check_dup_win.close();
                salecase_win.close();
            },
            failure: function() {
                Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
            }
        });
    },

    saveToNew: function(button) {
        var check_dup_win = Ext.ComponentQuery.query('customer_check_dup_form')[0];
        var grid = check_dup_win.down('grid', false);
        var selection = grid.getSelectedItem();

        var inquire_type_field = check_dup_win.down('[name=inquire_type]', false);
        var inquire_id_field = check_dup_win.down('[name=inquire_id]', false);
        var detail_field = check_dup_win.down('[name=detail]', false);
        var params = check_dup_win.down('[name=out]', false).getValues();
        params['id'] = selection.get('id');
        params['application_names'] = "";
        params['inquire_type'] = inquire_type_field.getValue();
        params['inquire_id'] = inquire_id_field.getValue();
        params['detail'] = detail_field.getValue();

        var salecase_win = button.up('window');

        Ext.Ajax.request({
            url: 'customers/save_customer',
            params: params,
            success: function(response) {
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);
                check_dup_win.close();
                salecase_win.close();
            },
            failure: function() {
                Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
            }
        });
    }
});