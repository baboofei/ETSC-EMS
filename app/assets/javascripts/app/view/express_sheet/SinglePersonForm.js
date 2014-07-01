Ext.define('EIM.view.express_sheet.SinglePersonForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.express_sheet_single_person_form',

    title: '请填写单号',
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
                        xtype: 'textfield',
                        name: 'receiver_name',
                        fieldLabel: '收件人姓名',
                        disabled: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'tracking_number',
                        fieldLabel: '单号',
                        allowBlank: false
                    },
                    {
                        xtype: 'datefield',
                        name: 'remind_at',
                        fieldLabel: '提醒时间',
                        format: 'Y-m-d'
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
