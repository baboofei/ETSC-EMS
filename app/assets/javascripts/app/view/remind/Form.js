Ext.define('EIM.view.remind.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.remind_form',

    title: '新增提醒',
    layout: 'fit',
    width: 300,
    height: 120,
    modal: true,
    //    autoShow: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        //用于记录是哪里来的提醒：比如，如果从日志来的则加上个案编号以便回溯
                        xtype: 'hidden',
                        name: 'source',
                        hidden: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'remind_text',
                        fieldLabel: '提醒内容',
                        emptyText: '请输入提醒内容',
                        allowBlank: false
                    },
                    {
                        xtype: 'datefield',
                        name: 'remind_at',
                        allowBlank: false,
                        format: 'Y-m-d',
                        value: Ext.Date.add(new Date(), Ext.Date.DAY, 10),
                        fieldLabel: '提醒日期',
                        emptyText: '请选择需要提醒的日期'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '保存',
                //            formBind: true,
                //            disabled: true,
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