Ext.define('EIM.view.contract.DivideSendingForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.divide_sending_form',

    title: '分批发货',
    layout: 'fit',
    width: 250,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                trackResetOnLoad: true,
                items: [
                    {
                        xtype: 'hidden',
                        name: 'id',
                        hidden: true
                    },
                    {
                        xtype: 'numberfield',
                        name: 'divide_quantity',
                        fieldLabel: '分出数量',
                        emptyText: '请输入要分出的数量',
                        decimalPrecision: 0,
                        minValue: 1,
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