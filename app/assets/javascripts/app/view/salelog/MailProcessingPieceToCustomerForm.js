Ext.define('EIM.view.salelog.MailProcessingPieceToCustomerForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.mail_processing_piece_to_customer_form',

    title: '新增/修改寄出加工件(往客户)',
    layout: 'anchor',
    width: 400,
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
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 4 0',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '型号',
                                name: 'model',
                                allowBlank: false,
                                flex: 2
                            },
                            {
                                xtype: 'numberfield',
                                fieldLabel: '数量',
                                name: 'quantity',
                                allowBlank: false,
                                minValue: 0,
                                decimalPrecision: 0,
                                flex: 1
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