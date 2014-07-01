Ext.define('EIM.view.salelog.MailContentForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.mail_content_form',

    title: '新增/修改寄出目录/文件',
    layout: 'anchor',
    width: 400,
//    height: 180,
    modal: true,
    autoShow: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                border: 0,
                fieldDefaults: EIM_field_defaults,
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