/**
 * 装“待审批合同列表”的表单
 */
Ext.define('EIM.view.contract.InStockQueryForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.contract_audit_form',

    title: '待审批合同',
    layout: 'fit',
    width: 900,
    border: 0,
    modal: true,
    maximizable: true,
    closeAction: 'hide',

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'contract_detail',
                        height: 400
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '审批通过',
                action: 'pass_auditing'
            },
            {
                text: '审批驳回',
                action: 'refuse_auditing'
            }
        ];

        this.callParent(arguments);
    }
});