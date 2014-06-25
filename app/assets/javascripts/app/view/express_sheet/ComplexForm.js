Ext.define('EIM.view.express_sheet.ComplexForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.express_sheet_complex_form',

    title: '打印快递单',
    iconCls: 'btn_print',
    layout: 'fit',
    width: 600,
    height: 262,
    modal: true,
    autoShow: false,
    closable: false,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'form',
                fieldDefaults: EIM_field_defaults,
                trackResetOnLoad: true,
                items: [
//                    {
//                        xtype: 'hidden',
//                        hidden: true,
//                        name: 'receiver_ids'
//                    },
                    {
                        xtype: 'hidden',
                        hidden: true,
                        name: 'receiver_type'
                    },
                    {
                        xtype: 'textfield',
                        hidden: true,
                        name: 'timestamp'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
//                        padding: '0 0 4 0',
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'description',
                                fieldLabel: '寄件描述',
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
                                disabled: true,
                                action:'grid_print'/*,
                                flex: 1*/
                            }
                        ]
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '拿回单子后请填写↓',
                        labelWidth: 150,
                        value:''
                    },
                    {
                        xtype: 'grid',
                        padding: '4 0 0 0',
                        store: 'TempGridExpressPeople',
                        name: 'temp_express_people_grid',
                        height: 112,
                        columns: [
                            {
                                header: '收件人',
                                dataIndex: 'receiver_name',
                                width: 75
                            },
                            {
                                header: '快递单号',
                                dataIndex: 'tracking_number',
                                minWidth: 120,
                                flex: 1
                            },
                            {
                                header: '提醒时间',
                                dataIndex: 'remind_at',
                                width: 100,
                                renderer: Ext.util.Format.dateRenderer("Y-m-d")
                            }
                        ]
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