Ext.define('EIM.view.quote.Term', {
    extend: 'Ext.form.Panel',
    alias: 'widget.quote_term',

    title: '报价条款',
//    iconCls: 'lbl_term',

    bodyPadding: 4,
    autoScroll: true,
    width: 300,
    layout: 'anchor',
    fieldDefaults: {
        labelWidth:80,
        labelAlign:'right',
        labelSeparator:'：',
        anchor:'100%',
        msgTarget:'side'
    },

    items: [
        {
            xtype: 'fieldcontainer',
            fieldLabel: '价格条款<span class="req" style="color:#ff0000">*</span>',
            layout: 'hbox',
            items: [
                {
                    xtype: 'textfield',
                    name: 'city_of_term',
                    emptyText: '城市',
                    width: 50
                },
//                {
//                    xtype: 'hidden',
//                    name: 'quote_city'
//                },
                {
                    xtype: 'combo',
                    name: 'price_type_of_term',
                    width: 100,
                    store: Ext.create('Ext.data.Store', {
                        data: filter_all_dict('price_type_of_term'),
                        model: 'EIM.model.AllDict',
                        proxy:  'memory'
                    }),
                    value: '1',
                    displayField: 'display',
                    valueField: 'value',
                    triggerAction: 'all',
                    editable: false,
                    emptyText: '请选择',
                    allowBlank: false
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: '付款方式<span class="req" style="color:#ff0000">*</span>',
            layout: 'vbox',
            padding: '20 0',
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'displayfield'
                    },
                    items: [
                        {
                            value: '签合同后&nbsp;'
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            name: 'flag_1',
//                            disabled: true,
                            items: [
                                {
                                    xtype: 'combo',
                                    name: 'pay_time1',
                                    store: Ext.create('Ext.data.Store', {
                                        data: filter_all_dict('pay_time'),
                                        model: 'EIM.model.AllDict',
                                        proxy:  'memory'
                                    }),
                                    displayField: 'display',
                                    valueField: 'value',
                                    triggerAction: 'all',
                                    editable: false,
                                    emptyText: '请选择',
                                    width: 50
                                },
                                {
                                    xtype: 'displayfield',
                                    value: '&nbsp;天内&nbsp;'
                                }
                            ]
                        },
                        {
                            xtype: 'combo',
                            id: 'pay_way1',
                            name: 'pay_way1',
                            store: Ext.create('Ext.data.Store', {
                                data: filter_all_dict('pay_way'),
                                model: 'EIM.model.AllDict',
                                proxy:  'memory'
                            }),
                            displayField: 'display',
                            valueField: 'value',
                            triggerAction: 'all',
                            editable: false,
                            emptyText: '请选择',
                            width: 80
                        },
                        {
                            value: '&nbsp;付'
                        },
                        {
                            xtype: 'amount_with_currency',
                            name: 'pay_count1',
                            storeHint: 6,
                            subFlex: '2|3',
                            fieldLabel: '\n',
                            labelSeparator: '\n',
                            labelWidth: 1,
                            allQuery: '4',
                            width: 120
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            name: 'flag_2',
                            defaults: {
                                xtype: 'displayfield'
                            },
                            items: [
                                {
                                    value: '&nbsp;，其中'
                                },
                                {
                                    xtype: 'amount_with_currency',
                                    name: 'cad_count',
                                    storeHint: 6,
                                    subFlex: '2|3',
                                    fieldLabel: '\n',
                                    labelSeparator: '\n',
                                    labelWidth: 1,
                                    allQuery: '4',
                                    width: 120
                                },
                                {
                                    value: '&nbsp;见单即付，其余'
                                },
                                {
                                    xtype: 'amount_with_currency',
                                    name: 'cad_left_count',
                                    storeHint: 6,
                                    subFlex: '2|3',
                                    fieldLabel: '\n',
                                    labelSeparator: '\n',
                                    labelWidth: 1,
                                    allQuery: '4',
                                    width: 120
                                },
                                {
                                    value: '&nbsp;凭&nbsp;'
                                },
                                {
                                    xtype: 'combo',
                                    name: 'cad_left_via',
                                    store: Ext.create('Ext.data.Store', {
                                        data: filter_all_dict('cad_left_via'),
                                        model: 'EIM.model.AllDict',
                                        proxy:  'memory'
                                    }),
                                    displayField: 'display',
                                    valueField: 'value',
                                    triggerAction: 'all',
                                    editable: false,
                                    emptyText: '请选择',
                                    width: 70
                                },
                                {
                                    value: '&nbsp;议付'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'displayfield'
                    },
                    items: [
                        {
                            value: '发货前&nbsp;'
                        },
                        {
                            xtype: 'combo',
                            name: 'pay_time2',
                            store: Ext.create('Ext.data.Store', {
                                data: filter_all_dict('pay_time'),
                                model: 'EIM.model.AllDict',
                                proxy:  'memory'
                            }),
                            displayField: 'display',
                            valueField: 'value',
                            triggerAction: 'all',
                            editable: false,
                            emptyText: '请选择',
                            width: 50
                        },
                        {
                            xtype: 'displayfield',
                            value: '&nbsp;天内电汇(T/T)付'
                        },
                        {
                            xtype: 'amount_with_currency',
                            name: 'pay_count2',
                            storeHint: 6,
                            subFlex: '2|3',
                            fieldLabel: '\n',
                            labelSeparator: '\n',
                            labelWidth: 1,
                            allQuery: '4',
                            width: 120
                        },
                        {
                            value: '&nbsp;，发货后&nbsp;'
                        },
                        {
                            xtype: 'combo',
                            name: 'pay_time3',
                            store: Ext.create('Ext.data.Store', {
                                data: filter_all_dict('pay_time'),
                                model: 'EIM.model.AllDict',
                                proxy:  'memory'
                            }),
                            displayField: 'display',
                            valueField: 'value',
                            triggerAction: 'all',
                            editable: false,
                            emptyText: '请选择',
                            width: 50
                        },
                        {
                            xtype: 'displayfield',
                            value: '&nbsp;天内电汇(T/T)付'
                        },
                        {
                            xtype: 'amount_with_currency',
                            name: 'pay_count3',
                            storeHint: 6,
                            subFlex: '2|3',
                            fieldLabel: '\n',
                            labelSeparator: '\n',
                            labelWidth: 1,
                            allQuery: '4',
                            width: 120
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'displayfield'
                    },
                    items: [
                        {
                            value: '验收后&nbsp;'
                        },
                        {
                            xtype: 'combo',
                            name: 'pay_time4',
                            store: Ext.create('Ext.data.Store', {
                                data: filter_all_dict('pay_time'),
                                model: 'EIM.model.AllDict',
                                proxy:  'memory'
                            }),
                            displayField: 'display',
                            valueField: 'value',
                            triggerAction: 'all',
                            editable: false,
                            emptyText: '请选择',
                            width: 50
                        },
                        {
                            xtype: 'displayfield',
                            value: '&nbsp;天内电汇(T/T)付'
                        },
                        {
                            xtype: 'amount_with_currency',
                            name: 'pay_count4',
                            storeHint: 6,
                            subFlex: '2|3',
                            fieldLabel: '\n',
                            labelSeparator: '\n',
                            labelWidth: 1,
                            allQuery: '4',
                            width: 120
                        },
                        {
                            value: '&nbsp;，COD&nbsp;'
                        },
                        {
                            xtype: 'amount_with_currency',
                            name: 'pay_count5',
                            storeHint: 6,
                            subFlex: '2|3',
                            fieldLabel: '\n',
                            labelSeparator: '\n',
                            labelWidth: 1,
                            allQuery: '4',
                            width: 120
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            name: 'flag_3',
                            defaults: {
                                xtype: 'displayfield'
                            },
                            items: [
                                {
                                    value: '若采用信用证支付方式，需增加'
                                },
                                {
                                    xtype: 'amount_with_currency',
                                    name: 'pay_count6',
                                    storeHint: 6,
                                    subFlex: '2|3',
                                    fieldLabel: '\n',
                                    labelSeparator: '\n',
                                    labelWidth: 1,
                                    allQuery: '4',
                                    width: 120
                                },
                                {
                                    value: '&nbsp;信用证费用'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: '含税情况',
            layout: 'hbox',
            items: [
                {
                    xtype: 'checkbox',
                    name: 'is_include_tax'
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    name: 'flag_4',
                    items: [
                        {
                            xtype: 'displayfield',
                            value: '&nbsp;以上价格&nbsp;'
                        },
                        {
                            xtype: 'combo',
                            name: 'receipt',
                            store: Ext.create('Ext.data.Store', {
                                data: filter_all_dict('receipt'),
                                model: 'EIM.model.AllDict',
                                proxy:  'memory'
                            }),
                            value: '1',
                            displayField: 'display',
                            valueField: 'value',
                            triggerAction: 'all',
                            editable: false,
                            emptyText: '请选择',
                            width: 300
                        }
                    ],
                    disabled: true
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: '交货期',
            layout: 'hbox',
            items: [
                {
                    xtype: 'checkbox',
                    name: 'is_delivery'
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    name: 'flag_5',
                    defaults: {
                        xtype: 'displayfield'
                    },
                    items: [
                        {
                            xtype: 'combo',
                            name: 'delivery_point',
                            store: Ext.create('Ext.data.Store', {
                                data: filter_all_dict('delivery_point'),
                                model: 'EIM.model.AllDict',
                                proxy:  'memory'
                            }),
                            value: '1',
                            displayField: 'display',
                            valueField: 'value',
                            triggerAction: 'all',
                            editable: false,
                            emptyText: '请选择',
                            width: 80
                        },
                        {
                            xtype: 'numberfield',
                            name: 'deliver_time_from',
                            width: 40,
//                            disabled: true,
                            minValue: 1,
                            value: 2,
                            decimalPrecision: 0
                        },
                        {
                            value: '&nbsp;至&nbsp;'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'deliver_time_to',
                            width: 40,
//                            disabled: true,
                            minValue: 1,
                            value: 4,
                            decimalPrecision: 0
                        },
                        {
                            xtype: 'combo',
                            name: 'deliver_time_unit',
                            store: Ext.create('Ext.data.Store', {
                                data: filter_all_dict('deliver_time_unit'),
                                model: 'EIM.model.AllDict',
                                proxy:  'memory'
                            }),
                            value: '1',
                            displayField: 'display',
                            valueField: 'value',
                            triggerAction: 'all',
                            editable: false,
                            emptyText: '请选择',
                            width: 50
                        },
                        {
                            value: '&nbsp;内发货，&nbsp;'
                        },
                        {
                            xtype: 'checkbox',
                            name: 'fes_xmas',
                            boxLabel: '圣诞&nbsp;'
                        },
                        {
                            xtype: 'checkbox',
                            name: 'fes_newy',
                            boxLabel: '新年&nbsp;'
                        },
                        {
                            xtype: 'checkbox',
                            name: 'fes_sprg',
                            boxLabel: '春节&nbsp;'
                        },
                        {
                            value: '假期不在其中'
                        }
                    ],
                    disabled: true
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: '质量保证',
            layout: 'hbox',
            items: [
                {
                    xtype: 'checkbox',
                    name: 'is_warranty'
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    name: 'flag_6',
                    defaults: {
                        xtype: 'displayfield'
                    },
                    items: [
                        {
                            xtype: 'combo',
                            name: 'warranty_point',
                            store: Ext.create('Ext.data.Store', {
                                data: filter_all_dict('warranty_point'),
                                model: 'EIM.model.AllDict',
                                proxy:  'memory'
                            }),
                            value: '1',
                            displayField: 'display',
                            valueField: 'value',
                            triggerAction: 'all',
                            editable: false,
                            emptyText: '请选择',
                            width: 80
                        },
                        {
                            xtype: 'combo',
                            name: 'warranty_time',
                            store: Ext.create('Ext.data.Store', {
                                data: filter_all_dict('warranty_time'),
                                model: 'EIM.model.AllDict',
                                proxy:  'memory'
                            }),
                            value: '1',
                            displayField: 'display',
                            valueField: 'value',
                            triggerAction: 'all',
                            editable: false,
                            emptyText: '请选择',
                            width: 50
                        },
                        {
                            value: "&nbsp;个月内质保。"
                        },
                        {
                            xtype: 'textfield',
                            name: 'extra_warranty',
                            emptyText: '还有啥奇怪的质保条款都写过来吧，注意中英文，注意最后加句号。没有就空着',
                            width: 450
                        }
                    ],
                    disabled: true
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: ' ',
            labelSeparator: ' ',
            layout: 'hbox',
            items: [
                {
                    xtype: 'checkbox',
                    name: 'has_warranty_priority'
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    name: 'flag_7',
                    items: [
                        {
                            xtype: 'displayfield',
                            padding: '0 0 4 0',
                            value: '&nbsp;自货物验收合格后12个月或发货后的13个月, 以先到日期为准'
                        }
                    ],
                    disabled: true
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: '开机检测费',
            layout: 'hbox',
            items: [
                {
                    xtype: 'checkbox',
                    name: 'need_disassemble'
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    name: 'flag_8',
                    items: [
                        {
                            xtype: 'displayfield',
                            padding: '0 0 4 0',
                            value: '&nbsp;确定故障原因后，若客户同意维修，则开机检测费可免；若客户决定不维修，则只需支付开机检测费'
                        }
                    ],
                    disabled: true
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: '上门服务费',
            layout: 'hbox',
            items: [
                {
                    xtype: 'checkbox',
                    name: 'need_on-site'
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    name: 'flag_9',
                    defaults: {
                        xtype: 'displayfield'
                    },
                    items: [
                        {
                            value: '&nbsp;若需上门服务，则需另外支付上门服务费'
                        },
                        {
                            xtype: 'amount_with_currency',
                            name: 'pay_count7',
                            storeHint: 4,
                            subFlex: '2|3',
                            fieldLabel: '\n',
                            labelSeparator: '\n',
                            labelWidth: 1,
                            allQuery: '4',
                            width: 120
                        },
                        {
                            value: '&nbsp;/次'
                        }
                    ],
                    disabled: true
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: '特别折扣',
            layout: 'hbox',
            items: [
                {
                    xtype: 'checkbox',
                    name: 'is_special_discount'
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    name: 'flag_10',
                    defaults: {
                        xtype: 'displayfield'
                    },
                    items: [
                        {
                            value: '&nbsp;此为一次性特别折扣&nbsp;',
                            padding: '0 0 4 0'
                        },
                        {
                            xtype: 'checkbox',
                            name: 'is_discount_limit'
                        },
                        {
                            value: '&nbsp;此折扣有效期以生产厂商折扣结束时间为准'
                        }
                    ],
                    disabled: true
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: '有效期<span class="req" style="color:#ff0000">*</span>',
            layout: 'hbox',
            items: [
                {
                    xtype: 'displayfield',
                    value: '报价有效期至&nbsp;'
                },
                {
                    xtype: 'datefield',
                    name: 'valid_time',
                    format: 'Y-m-d',
                    value: Ext.Date.add(new Date(), Ext.Date.DAY, 15),
                    minValue: new Date(),
                    allowBlank: false
                }
            ]
        },
        {
            xtype: 'textarea',
            name: 'extra_term',
            fieldLabel: '附加条款',
            emptyText: '请输入自定义条款，注意中英文，注意最后加句号。没有就空着'
        }
    ]
});