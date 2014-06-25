Ext.define('EIM.view.quote.ItemForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.quote_item_form',

    title: '新增/修改报价项',
    layout: 'fit',
    width: 500,
    height: 435,
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
                        allowBlank: false
                    },
                    {
                        xtype: 'expandable_product_combo',
                        allowBlank: false,
                        fieldLabel: '型号',
                        padding: '4 0'
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
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '关税',
                                hidden: true,
                                name: 'custom_tax'
                            }
                        ]
                    },
                    {
                        xtype: 'amount_with_currency',
                        name: 'source_price',
                        fieldLabel: '来源单价',
                        subFlex: '2|3',
                        emptyText: '选择“来源”后即定下，mark up/down的依据价格',
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
                        name: 'unit_price',
                        fieldLabel: '单价',
                        subFlex: '2|3',
                        padding: '0 0 4 0',
                        emptyText: '符合本报价币种的单价，即来源价格折算汇率后的结果',
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
                        fieldLabel: '折扣',
                        subFlex: '2|3',
                        padding: '0 0 4 0',
                        emptyText: '折扣去掉的单价',
                        minValue: -99999999.99,
                        storeHint: 4
                    },
                    {
                        xtype: 'amount_with_currency',
                        name: 'discount_to',
                        fieldLabel: '折至',
                        subFlex: '2|3',
                        padding: '0 0 4 0',
                        emptyText: '折扣剩下的单价',
                        storeHint: 4
                    },
                    {
                        xtype: 'amount_with_currency',
                        name: 'total',
                        fieldLabel: '小计',
                        subFlex: '2|3',
                        padding: '0 0 4 0',
                        emptyText: '折扣剩下的单价和数量相乘的结果',
                        itemDisabled: true,
                        storeHint: 4/*,
                        disabledCls: 'my-disabled-panel'*/
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
                text: '确定并继续',
                action: 'save_apply'
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
