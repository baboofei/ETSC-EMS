Ext.define('EIM.view.purchase.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.purchase_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '新增/修改采购信息',
    layout: 'fit',
    width: 450,
    height: 474,
    maximizable: true,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                defaults: {
                    xtype: 'container',
                    layout: 'hbox',
                    padding: '0 0 5',
                    defaults: {
                        xtype: 'textfield'
                    }
                },
                items: [
                    {
                        xtype: 'hidden',
                        name: 'id',
                        hidden: true
                    },
                    {
                        items: [
                            {
                                name: 'contract_project',
                                fieldLabel: '合同项目',
                                allowBlank: false
                            },
                            {
                                name: 'contract_number',
                                fieldLabel: '合同编号'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'datefield',
                                name: 'sign_at',
                                fieldLabel: '签署时间',
                                format: 'Y-m-d'
                            },
                            {
                                name: 'seller',
                                fieldLabel: '卖方'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                name: 'name',
                                fieldLabel: '名称'
                            },
                            {
                                name: 'model',
                                fieldLabel: '型号'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'quantity',
                                fieldLabel: '数量'
                            },
                            {
                                name: 'unit',
                                fieldLabel: '单位',
                                emptyText: '件/毫升/米之类的'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'combo',
                                name: 'quoted_currency_id',
                                fieldLabel: '报价币种',
                                allowBlank: false,
                                editable: false,
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_currency(4),
                                    model: 'EIM.model.dict.Currency',
                                    proxy:  'memory'
                                }),
                                valueField: 'id',
                                displayField: 'name',
                                value: 11,
                                triggerAction: 'all'
                            },
                            {
                                xtype: 'numberfield',
                                name: 'first_quoted',
                                fieldLabel: '首次报价'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'combo',
                                name: 'purchase_currency_id',
                                fieldLabel: '成交币种',
                                allowBlank: false,
                                editable: false,
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_currency(4),
                                    model: 'EIM.model.dict.Currency',
                                    proxy:  'memory'
                                }),
                                valueField: 'id',
                                displayField: 'name',
                                value: 11,
                                triggerAction: 'all'
                            },
                            {
                                xtype: 'numberfield',
                                name: 'unit_price',
                                fieldLabel: '成交单价'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'price',
                                fieldLabel: '金额'
                            },
                            {
                                xtype: 'numberfield',
                                name: 'discount',
                                fieldLabel: '折扣'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                name: 'invoice',
                                fieldLabel: '发票'
                            },
                            {
                                name: 'pay_method',
                                fieldLabel: '付款方式'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'datefield',
                                name: 'expected_pay_at',
                                fieldLabel: '付款计划于',
                                format: 'Y-m-d'
                            },
                            {
                                name: 'pay_status',
                                fieldLabel: '付款情况'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                name: 'invoice_status',
                                fieldLabel: '开票情况'
                            },
                            {
                                name: 'warranty',
                                fieldLabel: '质保'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'datefield',
                                name: 'expected_deliver_at',
                                fieldLabel: '预交货时间',
                                format: 'Y-m-d'
                            },
                            {
                                xtype: 'datefield',
                                name: 'actually_deliver_at',
                                fieldLabel: '实交货时间',
                                format: 'Y-m-d'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                name: 'deliver_place',
                                fieldLabel: '交货地点'
                            },
                            {
                                name: 'vendor_unit',
                                fieldLabel: '生产商'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                name: 'end_user',
                                fieldLabel: '最终用户'
                            },
                            {
                                name: 'user',
                                fieldLabel: '负责人'
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        padding: '0 0 0',
                        name: 'description',
                        fieldLabel: '说明'
                    },
                    {
                        xtype: 'textfield',
                                                padding: '0 0 0',
                        name: 'comment',
                        fieldLabel: '备注'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '保存',
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