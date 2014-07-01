Ext.define('EIM.view.express_sheet.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.express_sheet_form',

    title: '打印快递单',
    iconCls: 'btn_print',
    layout: 'fit',
    width: 600,
    modal: true,
    autoShow: false,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'form',
                fieldDefaults: EIM_field_defaults,
                trackResetOnLoad: true,
                items: [
                    {
                        xtype: 'hidden',
                        hidden: true,
                        name: 'customer_ids'
                    },
                    {
                        xtype: 'textfield',
                        name: 'description',
                        fieldLabel: '描述'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'combo',
                                fieldLabel: '快递公司',
                                name: 'express_id',
                                allowBlank: false,
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('express', true),
                                    model: 'EIM.model.AllDict',
                                    proxy:  'memory'
                                }),
                                displayField: 'display',
                                valueField: 'value',
                                editable: false,
                                flex: 3
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: '发件公司',
                                name: 'our_company_id',
                                allowBlank: false,
                                editable: false,
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_our_company(),
                                    model: 'EIM.model.dict.OurCompany',
                                    proxy:  'memory'
                                }),
                                valueField: 'id',
                                displayField: 'name',
                                flex: 3
                            },
                            {
                                xtype: 'button',
                                text: '打印',
                                iconCls: 'btn_print',
                                flex: 1
                            }
                        ]
                    },
                    {
                        xtype: 'grid',
                        padding: '4 0 0 0',
                        store: 'TempGridExpressPeople',
                        columns: [
                            {
                                header: '收件人',
                                dataIndex: 'receiver',
                                width: 75
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        padding: '0 0 4 0',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'checkbox',
                                fieldLabel: '提醒',
                                boxLabel: '需要提醒？',
                                flex: 2
                            },
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                name: 'remind_time',
                                value: new Date(),
                                fieldLabel: '提醒日期',
                                flex: 3
                            }
                        ]
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '打印',
                action: 'printExpressSheet'
            },
//            {
//                text: '邮件发送PDF',
//                action: 'mailExpressSheet'
//            },
            {
                text: '取消',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});