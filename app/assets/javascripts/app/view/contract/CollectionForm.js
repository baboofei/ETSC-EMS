Ext.define('EIM.view.contract.CollectionForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.collection_form',

    title: '新增/修改实收款项',
    layout: 'fit',
    width: 300,
    maximizable: false,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                trackResetOnLoad: true,
                defaults: {
                    xtype: 'numberfield'
                },
                items: [
                    {
                        xtype: 'hidden',
                        name: 'id',
                        hidden: true
                    },
                    {
                        xtype: 'datefield',
                        name: 'received_at',
                        fieldLabel: '实收时间',
                        format: 'Y-m-d',
                        allowBlank: false
                    },
                    {
                        name: 'amount',
                        fieldLabel: '实收金额',
                        allowBlank: false,
                        minValue: 0.01
                    },
                    {
                        name: 'compensation_amount',
                        fieldLabel: '补偿金额',
                        minValue: 0
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
                text: '确定',
                action: 'update',
                hidden: true
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