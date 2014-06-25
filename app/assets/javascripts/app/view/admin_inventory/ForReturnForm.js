/**
 * “归还”的表单
 */
Ext.define('EIM.view.admin_inventory.ForReturnForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_for_return_form',

    title: '归还',
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
                        name: 'project',
                        fieldLabel: '备注'
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