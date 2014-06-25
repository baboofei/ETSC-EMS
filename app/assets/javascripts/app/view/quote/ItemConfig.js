Ext.define('EIM.view.quote.ItemConfig', {
    extend: 'Ext.form.Panel',
    alias: 'widget.quote_item_config',

    title: 'PDF设置',
    iconCls: 'ttl_config',

    bodyPadding:4,
    autoScroll:true,
    layout:'anchor',
    fieldDefaults:EIM_field_defaults,
    defaults: {
        xtype: 'textfield'
    },

    items: [
        {
            xtype: 'fieldset',
            title: '“单价”列',
            collapsible: true,
            layout: 'form',
            name: 'original_price_fieldset',
            custom_key: 'unit_price',
            items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkbox',
                            fieldLabel: '',
                            boxLabel: '显示系统价格',
                            name: 'show_original_price_system',
                            action: 'triggerSystemPrice'
                        },
                        {
                            xtype: 'checkbox',
                            fieldLabel: '',
                            boxLabel: '显示中间价格',
                            name: 'show_original_price_middle',
                            action: 'triggerSubSystemPrice'
                        }
                    ]
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: '',
                    boxLabel: '显示产品价格',
                    name: 'show_original_price_product',
                    action: 'triggerProductPrice',
                    checked: true
                }
            ]
        },
//        {
//            xtype: 'fieldset',
//            title: '“折扣”列',
//            collapsible: true,
//            layout: 'form',
//            name: 'discount_fieldset',
//            custom_key: 'discount',
//            items: [
//                {
//                    xtype: 'container',
//                    layout: 'hbox',
//                    items: [
//                        {
//                            xtype: 'checkbox',
//                            fieldLabel: '',
//                            boxLabel: '显示列',
//                            name: 'show_discount',
//                            action: 'triggerColumn'
//                        },
//                        {
//                            xtype: 'checkbox',
//                            fieldLabel: '',
//                            boxLabel: '显示系统价格',
//                            name: 'show_discount_system',
//                            action: 'triggerSystemPrice'
//                        }
//                    ]
//                },
//                {
//                    xtype: 'container',
//                    layout: 'hbox',
//                    items: [
//                        {
//                            xtype: 'checkbox',
//                            fieldLabel: '',
//                            boxLabel: '显示中间价格',
//                            name: 'show_discount_middle',
//                            action: 'triggerSubSystemPrice'
//                        },
//                        {
//                            xtype: 'checkbox',
//                            fieldLabel: '',
//                            boxLabel: '显示产品价格',
//                            name: 'show_discount_product',
//                            action: 'triggerProductPrice'
//                        }
//                    ]
//                }
//            ]
//        },
        {
            xtype: 'fieldset',
            title: '“折至”列',
            collapsible: true,
            layout: 'form',
            name: 'discount_to_fieldset',
            custom_key: 'discount_to',
            items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkbox',
                            fieldLabel: '',
                            boxLabel: '显示列',
                            name: 'show_discount_to',
                            action: 'triggerColumn'
                        },
                        {
                            xtype: 'checkbox',
                            fieldLabel: '',
                            boxLabel: '显示系统价格',
                            name: 'show_discount_to_system',
                            action: 'triggerSystemPrice'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkbox',
                            fieldLabel: '',
                            boxLabel: '显示中间价格',
                            name: 'show_discount_to_middle',
                            action: 'triggerSubSystemPrice'
                        },
                        {
                            xtype: 'checkbox',
                            fieldLabel: '',
                            boxLabel: '显示产品价格',
                            name: 'show_discount_to_product',
                            action: 'triggerProductPrice'
                        }
                    ]
                }

            ]
        },
        {
            xtype: 'fieldset',
            title: '“小计”列',
            collapsible: true,
            layout: 'form',
            name: 'total_fieldset',
            custom_key: 'total',
            items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkbox',
                            fieldLabel: '',
                            boxLabel: '显示系统价格',
                            name: 'show_total_system',
                            action: 'triggerSystemPrice'
                        },
                        {
                            xtype: 'checkbox',
                            fieldLabel: '',
                            boxLabel: '显示中间价格',
                            name: 'show_total_middle',
                            action: 'triggerSubSystemPrice'
                        }
                    ]
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: '',
                    boxLabel: '显示产品价格',
                    name: 'show_total_product',
                    action: 'triggerProductPrice',
                    checked: true
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: '“合计”区',
            collapsible: true,
            layout: 'form',
            name: 'footer_fieldset',
            custom_key: 'footer',
            items: [
                {
                    xtype: 'checkbox',
                    fieldLabel: '',
                    boxLabel: '显示“合计”',
                    name: 'show_footer_total',
                    action: 'triggerTotal',
                    checked: true
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: '',
                    boxLabel: '显示“折扣”',
                    name: 'show_footer_discount',
                    action: 'triggerLessSpecialDiscount',
                    checked: true
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: '',
                    boxLabel: '显示“运保费”',
                    name: 'show_footer_freight_insurance_cost',
                    action: 'triggerFreightInsuranceCost',
                    checked: true
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: '',
                    boxLabel: '显示“总计”',
                    name: 'show_footer_final_price',
                    action: 'triggerFinal',
                    checked: true
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: '',
                    boxLabel: '显示“折合人民币”',
                    name: 'show_footer_rmb',
                    action: 'triggerRMB',
                    checked: false
                }
            ]
        }
    ]
});