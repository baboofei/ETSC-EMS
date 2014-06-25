Ext.define('EIM.view.service_log.WaitSpareForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.service_log_wait_spare_form',

    title: '等待备件',
//    iconCls: 'btn_wait_spare',
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
                        fieldLabel: '备件名称',
                        allowBlank: false,
                        name: 'name'
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '备件数量',
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