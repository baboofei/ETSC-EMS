Ext.define('EIM.view.quote.BlockForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.quote_block_form',

    title: '新增/修改系统/子系统',
    layout: 'fit',
    width: 700,
    height: 515,
    maximizable: true,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                autoScroll: true,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'expandable_vendor_unit_combo',
                        padding: '0 0 4 0',
                        allowBlank: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'product_model',
                        allowBlank: false,
                        fieldLabel: '型号'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 4 0',
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'quantity',
                                fieldLabel: '数量',
                                decimalPrecision: 0,
                                minValue: 1,
                                allowBlank: false
                            },
                            {
                                xtype: 'numberfield',
                                name: 'quantity_2',
                                fieldLabel: '数量二',
                                decimalPrecision: 0,
                                minValue: 1,
                                emptyText: '阶梯报价才用到的值'
                            }
                        ]
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: '描述',
                        name: 'description',
                        allowBlank: false,
                        emptyText: '产品的“中/英文简述”那个字段'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 4 0',
                        items: [
                            {
                                xtype: 'combo',
                                fieldLabel: '来源',
                                name: 'source',
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('quote_source'),
                                    model: 'EIM.model.AllDict',
                                    proxy:  'memory'
                                }),
                                displayField: 'display',
                                valueField: 'value',
                                triggerAction: 'all',
                                editable: false
                            },
                            {
                                xtype: 'button',
                                text: '汇率管理...',
                                action: 'exchange_rate_manage'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '来源汇率',
                                hidden: true,
                                name: 'original_exchange_rate'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '汇率',
                                hidden: true,
                                name: 'exchange_rate'
                            }
                        ]
                    },
                    {
                        xtype: 'amount_with_currency',
                        name: 'source_price',
                        subFlex: '1|3',
                        fieldLabel: '系统来源价',
                        padding: '0 0 4 0',
                        emptyText: '选择“来源”后即定下，mark up/down的依据价格',
                        storeHint: 4
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 4 0',
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'times_1',
                                fieldLabel: '×',
                                minValue: 0.01
                            },
                            {
                                xtype: 'numberfield',
                                name: 'divide_1',
                                fieldLabel: '÷',
                                minValue: 0.01
                            }
                        ]
                    },
                    {
                        xtype: 'amount_with_currency',
                        name: 'system_price',
                        subFlex: '1|3',
                        fieldLabel: '系统价',
                        padding: '0 0 4 0',
                        allowBlank: true,
                        value: 0,
                        emptyText: '符合本报价币种的系统单价，即系统来源价折算汇率后的结果',
                        storeHint: 4
                    },
                    {
                        xtype: 'amount_with_currency',
                        name: 'system_discount',
                        subFlex: '1|3',
                        fieldLabel: '系统折扣',
                        padding: '0 0 4 0',
                        allowBlank: true,
                        value: 0,
                        emptyText: '系统下的项目整合成系统后，折扣去掉的价格',
                        storeHint: 4
                    },
                    {
                        xtype: 'container',
                        padding: '0 0 4 0',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: '累加价',
                                name: 'item_total_currency_id',
                                flex: 1,
                                value: '币种'
                            },
                            {
                                xtype: 'displayfield',
                                name: 'item_total_amount',
                                flex: 3,
                                value: '系统下所有项目累加后的价格'
                            }
                        ]
                    },
                    {
                        xtype: 'amount_with_currency',
                        name: 'unit_price',
                        subFlex: '1|3',
                        fieldLabel: '系统单价',
                        padding: '0 0 4 0',
                        storeHint: 4
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 4 0',
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'times_2',
                                fieldLabel: '×',
                                minValue: 0.01
                            },
                            {
                                xtype: 'numberfield',
                                name: 'divide_2',
                                fieldLabel: '÷',
                                minValue: 0.01
                            }
                        ]
                    },
                    {
                        xtype: 'amount_with_currency',
                        name: 'discount',
                        subFlex: '1|3',
                        fieldLabel: '折扣',
                        padding: '0 0 4 0',
                        minValue: -99999999.99,
                        storeHint: 4
                    },
                    {
                        xtype: 'amount_with_currency',
                        name: 'discount_to',
                        subFlex: '1|3',
                        fieldLabel: '折至',
                        padding: '0 0 4 0',
                        storeHint: 4
                    },
                    {
                        xtype: 'amount_with_currency',
                        name: 'total',
                        subFlex: '1|3',
                        fieldLabel: '小计',
                        padding: '0 0 4 0',
                        itemDisabled: true,
                        storeHint: 4
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
                text: '确定u',
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
