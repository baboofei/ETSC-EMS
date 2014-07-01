Ext.define('EIM.view.service_log.FactorySupportDoneForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.service_log_factory_support_done_form',

    title: '原厂支持就绪',
//    iconCls: 'btn_factory_support_done',
    layout: 'fit',
    width: 300,
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
                        name: 'flow_sheet_id',
                        hidden: true
                    },
                    {
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        name: 'act_date',
                        value: new Date(),
                        fieldLabel: '日期'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '备注',
                        name: 'comment'
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