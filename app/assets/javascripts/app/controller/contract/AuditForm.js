/**
 * 拆开后单独加载“单合同预览”视图用的controller
 */
Ext.define('EIM.controller.contract.AuditForm', {
    extend: 'Ext.app.Controller',

    stores: [
        'SingleContracts',
        'Terms',
        'PayModes',
        'ContractItems',
        'ContractHistories',
        'Collections',
        'Receivables',
        'ComboQuoteSales'
    ],
    models: [
        'Contract',
        'Term',
        'ContractItem',
        'ContractHistory',
        'Collection',
        'Receivable',
        'ComboQuoteSale',
        'ComboUser'
    ],

    views: [
        'contract.Panel',
        'contract.Grid',
        'contract.Detail',
        'contract.Content',
        'contract.ItemGrid',
        'contract.HistoryGrid',
        'contract.CollectionPanel',
        'contract.CollectionGrid',
        'contract.ReceivableGrid',
        'contract.TransferForm',
        'contract.AuditForm'
    ],
    //    refs: [{
    //        ref: 'list',
    //        selector: 'recommended_item_grid'
    //    }],

    init: function() {
        var me = this;

        me.control({
//            'contract_in_stock_form': {
//                afterrender: this.allowTrigger
//            },
//            'contract_in_stock_form button[action=save]': {
//                click: this.saveItem
//            }
            'contract_audit_form button[action=pass_auditing]': {
                click: this.passAuditing
            },
            'contract_audit_form button[action=refuse_auditing]': {
                click: this.refuseAuditing
            }
        });
    },

    passAuditing: function(button) {
        var panel = button.up('panel');
        var id_field = panel.down('hidden[name=id]', false);
        Ext.Ajax.request({
            url: 'contracts/process_workflow',
            params: {
                id: id_field.getValue(),
                event: 'audit_agree'
            },
            success: function() {
                Ext.example.msg('成功', '合同审批已通过');
                panel.close();
            },
            failure: function() {

            }
        });
    },

    refuseAuditing: function(button) {
        var panel = button.up('panel');
        var id_field = panel.down('hidden[name=id]', false);
        Ext.Ajax.request({
            url: 'contracts/process_workflow',
            params: {
                id: id_field.getValue(),
                event: 'audit_refuse'
            },
            success: function() {
                Ext.example.msg('成功', '合同审批已驳回');
                panel.close();
            },
            failure: function() {

            }
        });
    }
});