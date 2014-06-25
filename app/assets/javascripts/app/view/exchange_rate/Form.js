Ext.define('EIM.view.exchange_rate.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.exchange_rate_form',

    title: '修改汇率',
    layout: 'fit',
    width: 350,
    height: 126,
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
                        xtype: 'combo',
                        name: 'currency',
                        fieldLabel: '币种',
                        store: Ext.create('Ext.data.Store', {
                            data: filter_currency(4),
                            model: 'EIM.model.dict.Currency',
                            proxy:  'memory'
                        }),
                        displayField: 'name',
                        valueField: 'id',
                        allowBlank: false,
                        editable: false,
                        triggerAction: 'all'
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '汇率',
                        minValue: 0.01,
                        emptyText: '每100该单位币种可折合多少人民币',
                        allowBlank: false
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定',
                action: 'save',
                disabled: true
            },
            {
                text: '应用',
                action: 'apply',
                disabled: true
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
