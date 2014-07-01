Ext.define('EIM.view.contract.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.contract_panel',

    layout: 'border',
    items: [
        {
            xtype: 'contract_grid',
            height: 300,
            minHeight: 200,
            maxHeight: 400,
            region: 'north',
            padding: "4 4 0 4",
            //        border: 0,
            split: true
        },
        {
            xtype: 'contract_detail',
            region: 'center',
            padding: "0 4 4 4",
            //        title: 'bb',
            split: true
        }
    ],

    buttons: [
        {
            text: '流程继续',
            action: 'update',
            id: 'privilege_button_contract_update',
            allowPrivilege: true,
            isInWorkflow: true,
            tempDisabled: true
        },
        {
            text: '审批通过',
            action: 'audit_agree',
            id: 'privilege_button_contract_audit_agree',
            allowPrivilege: true,
            isInWorkflow: true,
            tempDisabled: true
        },
        {
            text: '审批驳回',
            action: 'audit_refuse',
            id: 'privilege_button_contract_audit_refuse',
            allowPrivilege: true,
            isInWorkflow: true,
            tempDisabled: true
        },
        {
            text: '签署',
            action: 'sign',
            id: 'privilege_button_contract_sign',
            allowPrivilege: true,
            isInWorkflow: true,
            tempDisabled: true
        },
        {
            text: '合同完结',
            action: 'complete',
            id: 'privilege_button_contract_complete',
            allowPrivilege: true,
            isInWorkflow: true,
            tempDisabled: true
        },
        {
            text: '合同取消',
            action: 'cancel',
            id: 'privilege_button_contract_cancel',
            allowPrivilege: true,
            isInWorkflow: true,
            tempDisabled: true
        },
        {
            text: '保存为新合同',
            action: 'save_as',
            iconCls: 'btn_save_as',
            disabled: true
        }
    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});