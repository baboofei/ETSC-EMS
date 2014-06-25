Ext.define('EIM.view.vendor_unit.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.vendor_unit_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '新增/修改供应商单位',
    layout: 'fit',
    width: 650,
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
                        xtype: 'hidden',
                        name: 'source_element_id',
                        hidden: true
                    },
                    {
                        items: [
                            {
                                name: 'name|en_name|unit_aliases>unit_alias|short_code',
                                fieldLabel: '名称',
                                allowBlank: false,
                                flex: 1
                            },
                            {
                                name: 'en_name',
                                fieldLabel: '英文名称',
                                flex: 2
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'combo',
                                name: 'parent_id',
                                fieldLabel: '上级单位',
                                store: 'ComboFullVendorUnits',
                                forceSelection: true,
                                displayField: 'name',
                                valueField: 'id',
                                hideTrigger: true, //伪成输入框
                                minChars: 1,
                                triggerAction: 'query',
                                flex: 2
                            },
                            {
                                xtype: 'checkbox',
                                name: 'does_inherit',
                                fieldLabel: '继承',
                                boxLabel: '是否继承上级信息？',
                                disabled: true,
                                flex: 1
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                name: 'unit_aliases>unit_alias',
                                fieldLabel: '别称'
                            },
                            {
                                name: 'short_code',
                                fieldLabel: '简码'
                            },
                            {
                                xtype: 'combo',
                                name: 'city_id',
                                fieldLabel: '所属城市',
                                store: 'dict.Cities',
                                displayField: 'name',
                                valueField: 'id',
                                allowBlank: false,
                                mode: 'remote',
                                emptyText: '请输入所属城市名称',
                                triggerAction: 'query',
                                minChars: 1,
                                hideTrigger: true, //伪成输入框
                                forceSelection: true
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        name: 'addr',
                        fieldLabel: '地址',
                        padding: '0 0 0',
                        emptyText: '不要写城市名称，因为已经选择了'
                    },
                    {
                        xtype: 'textfield',
                        name: 'en_addr',
                        padding: '0 0 0',
                        fieldLabel: '英文地址'
                    },
                    {
                        xtype: 'textfield',
                        name: 'intro',
                        padding: '0 0 0',
                        fieldLabel: '简介'
                    },
                    {
                        xtype: 'textfield',
                        name: 'en_intro',
                        padding: '0 0 0',
                        fieldLabel: '英文简介'
                    },
                    {
                        xtype: 'textarea',
                        name: 'bank_info',
                        padding: '0 0 0',
                        height: 30,
                        fieldLabel: '银行信息'
                    },
                    {
                        items: [
                            {
                                xtype: 'datefield',
                                name: 'established_at',
                                fieldLabel: '成立时间',
                                format: 'Y-m-d'
                            },
                            {
                                xtype: 'numberfield',
                                name: 'scale',
                                fieldLabel: '规模(人)',
                                decimalPrecision: 0
                            },
                            {
                                name: 'competitor',
                                fieldLabel: '竞争对手'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                name: 'phone',
                                fieldLabel: '电话'
                            },
                            {
                                name: 'fax',
                                fieldLabel: '传真'
                            },
                            {
                                name: 'postcode',
                                fieldLabel: '邮编'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                name: 'site',
                                fieldLabel: '网址'
                            },
                            {
                                name: 'major_product',
                                fieldLabel: '主营产品'
                            },
                            {
                                xtype: 'combo',
                                name: 'currency_id',
                                fieldLabel: '默认币种',
                                allowBlank: false,
                                editable: false,
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_currency(4),
                                    model: 'EIM.model.dict.Currency',
                                    proxy:  'memory'
                                }),
                                valueField: 'id',
                                displayField: 'name',
                                triggerAction: 'all',
                                value: 11
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'checkbox',
                                name: 'is_partner',
                                fieldLabel: '合作伙伴',
                                boxLabel: '是否为合作伙伴？'
                            },
                            {
                                xtype: 'checkbox',
                                name: 'is_producer',
                                fieldLabel: '生产厂商',
                                boxLabel: '是否为生产厂商？'
                            },
                            {
                                xtype: 'checkbox',
                                name: 'is_seller',
                                fieldLabel: '销售厂商',
                                boxLabel: '是否为销售厂商？'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                name: 'supporters',
                                xtype: 'boxselect',
                                fieldLabel: '技术负责',
                                store: "ComboSupporters",
                                queryMode: "local",
                                displayField: 'name',
                                valueField: 'id',
                                height: 50,
                                emptyText: '可多选'
                            },
                            {
                                name: 'purchasers',
                                xtype: 'boxselect',
                                fieldLabel: '采购负责',
                                store: "ComboPurchasers",
                                queryMode: "local",
                                displayField: 'name',
                                valueField: 'id',
                                height: 50,
                                emptyText: '可多选'
                            },
                            {
                                name: 'businesses',
                                xtype: 'boxselect',
                                fieldLabel: '商务负责',
                                store: 'ComboBusinesses',
                                queryMode: 'local',
                                displayField: 'name',
                                valueField: 'id',
                                height: 50,
                                emptyText: '可多选'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                name: 'lead_time',
                                fieldLabel: '交货期',
                                flex: 1
                            },
                            {
                                name: 'term',
                                fieldLabel: '付款条款',
                                flex: 3
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                name: 'product_quality',
                                fieldLabel: '产品质量'
                            },
                            {
                                name: 'service_quality',
                                fieldLabel: '服务质量'
                            },
                            {
                                name: 'delivery_quality',
                                fieldLabel: '交货情况'
                            },
                            {
                                name: 'price_quality',
                                fieldLabel: '售价情况'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                name: 'level',
                                fieldLabel: '评级',
                                flex: 1
                            },
                            {
                                name: 'comment',
                                fieldLabel: '备注',
                                flex: 3
                            }
                        ]
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