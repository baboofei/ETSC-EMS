/**
 * “申请租借”的表单
 */
Ext.define('EIM.view.admin_inventory.ApplyForLoanForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_apply_for_loan_form',

    title: '申请租借',
    layout: 'fit',
    width: 300,
//    height: 205,
    border: 0,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'textfield',
                        //TODO 将来要换成combo
                        fieldLabel: '合同号',
                        allowBlank: false,
                        name: 'project'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定',
                action: 'save'
            },
            {
                text: '取消',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});