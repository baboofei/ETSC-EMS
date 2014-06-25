Ext.define('EIM.view.express_sheet.CostForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.express_sheet_cost_form',

    title: '费用',
    layout: 'fit',
    width: 350,
    maximizable: true,
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
                        xtype: 'amount_with_currency',
                        name: 'cost',
                        fieldLabel: '费用',
                        storeHint: 4
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
