/**
 * “申请退货”的表单
 */
Ext.define('EIM.view.admin_inventory.ApplyForRejectForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_apply_for_reject_form',

    title: '申请退货',
    layout: 'fit',
    width: 400,
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
                        fieldLabel: '理由',
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