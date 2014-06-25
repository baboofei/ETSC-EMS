Ext.define('EIM.view.service_log.WaitFactorySupportForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.service_log_wait_factory_support_form',

    title: '等待原厂支持',
//    iconCls: 'btn_wait_factory_support',
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
                        xtype: 'textfield',
                        fieldLabel: '何种支持',
                        allowBlank: false,
                        emptyText: '人/备件/设备/技术等',
                        name: 'name'
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '数量',
                        allowBlank: false,
                        name: 'quantity'
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