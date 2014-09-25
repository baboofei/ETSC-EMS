Ext.define('EIM.view.contract.MailToCustomerForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.contract_mail_to_customer_form',

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
                        name: 'id'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '描述',
                        name: 'model',
                        allowBlank: false
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 4 0',
                        items: [
                            {
                                xtype: 'combo',
                                fieldLabel: '收件人',
                                name: 'customer_id',
                                allowBlank: false,
                                store: 'MiniCustomers',
                                displayField: 'name',
                                valueField: 'id',
                                editable: false
                            },
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
                                editable: false
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 4 0',
                        items: [
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
                                displayField: 'name'
                            },
                            {
                                xtype: 'hidden',
                                hidden: true,
                                name: 'timestamp'
                            },
                            {
                                xtype: 'print_express_sheet_button'
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '快递单号',
                        name: 'tracking_number',
                        allowBlank: false
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '发送邮件给',
                        name: 'send_mail_to',
                        margin: 0,
                        columns: 2,
                        vertical: true,
                        items: [
                            { boxLabel: '仅寄件人', name: 'send_mail_target', inputValue: '1' },
                            { boxLabel: '收件人&寄件人', name: 'send_mail_target', inputValue: '2'}
                        ],
                        allowBlank: false,
                        disabled: true
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: '提醒时间',
                        format: 'Y-m-d',
                        value: Ext.Date.add(new Date(), Ext.Date.DAY, 15),
                        name: 'remind_at'
                    }
                ]
            }
        ];

        this.buttons = [
            //            {
            //                text: '打印',
            //                action: 'printExpressSheet'
            //            },
            //            {
            //                text: '邮件发送PDF',
            //                action: 'mailExpressSheet'
            //            },
            {
                text: '完成',
                action: 'complete_print'
            }
        ];

        this.callParent(arguments);
    }
});