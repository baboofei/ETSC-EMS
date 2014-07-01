Ext.define('EIM.view.quote.ServiceForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.quote_service_form',

    title: '新增报价',
    layout: 'fit',
    width: 500,
//    height: 308,
    maximizable: true,
    modal: true,

    initComponent: function() {
        Ext.tip.QuickTipManager.init();
//        Ext.QuickTips.init();
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                autoScroll: true,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'hidden',
                        name: 'id'
                    },
                    {
                        xtype: 'expandable_customer_unit_combo',
                        allowBlank: false
                    },
                    {
                        xtype: 'expandable_customer_combo',
                        allowBlank: false,
                        padding: '4 0'
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '卖方公司',
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
                        value: 1
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 4 0',
                        items: [
                            {
                                xtype: 'combo',
                                fieldLabel: '维修工程师',
                                name: 'support>id',
                                allowBlank: false,
                                editable: false,
                                store: 'ComboSupporters',
                                valueField: 'id',
                                displayField: 'name'
                            },
                            {
                                xtype: 'datefield',
                                fieldLabel: '报价日期',
                                name: 'created_at',
                                allowBlank: false,
                                format: 'Y-m-d',
                                value: new Date()
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
                                fieldLabel: '报价类型',
                                name: 'quote_type',
                                allowBlank: false,
                                editable: false,
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('quote_type'),
                                    model: 'EIM.model.AllDict',
                                    proxy:  'memory'
                                }),
                                valueField: 'value',
                                displayField: 'display',
                                value: '2'
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: '报价语言',
                                name: 'language',
                                allowBlank: false,
                                editable: false,
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('quote_language'),
                                    model: 'EIM.model.AllDict',
                                    proxy:  'memory'
                                }),
                                valueField: 'value',
                                displayField: 'display',
                                value: '2'
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
                                fieldLabel: '报价格式',
                                name: 'quote_format',
                                allowBlank: false,
                                editable: false,
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('quote_format'),
                                    model: 'EIM.model.AllDict',
                                    proxy:  'memory'
                                }),
                                valueField: 'value',
                                displayField: 'display',
                                value: '1'
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: '产品币种',
                                name: 'currency_id',
                                allowBlank: false,
                                editable: false,
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_currency(5),
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
                        xtype: 'textfield',
                        fieldLabel: '报价摘要',
                        name: 'summary',
                        flex: 2
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '报价要求',
                        emptyText: '销售对报价条款上的一些要求',
                        name: 'request'
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
                text: '取消',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});
