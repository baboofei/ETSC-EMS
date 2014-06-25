Ext.define('EIM.view.quote.BatchMarkUpDownForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.quote_batch_mark_up_down_form',

    title: '批量加/减价',
    layout: 'fit',
    width: 400,
    height: 126,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                autoScroll: true,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'times',
                        fieldLabel: '×',
                        minValue: 0.01
                    },
                    {
                        xtype: 'numberfield',
                        name: 'divide',
                        fieldLabel: '÷',
                        minValue: 0.01
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
