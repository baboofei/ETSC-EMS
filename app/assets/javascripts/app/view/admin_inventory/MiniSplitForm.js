/**
 * 维修水单领用零部件“拆分”的表单
 */
Ext.define('EIM.view.admin_inventory.MiniSplitForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_mini_split_form',


    title: '拆分',
    layout: 'fit',
    width: 250,
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
                        xtype: 'numberfield',
                        fieldLabel: '拆分数量',
                        name: 'split_number',
                        value: 1,
                        minValue: 0.01,
                        minText: '这也太少了吧，多领点行吗……',
                        allowBlank: false
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