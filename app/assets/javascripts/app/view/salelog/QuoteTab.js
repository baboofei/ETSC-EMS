Ext.define('EIM.view.salelog.QuoteTab', {
    extend: 'Ext.form.Panel',
    alias: 'widget.quote_tab',

    title: '报价',
    border: 0,
    padding: '0 4',
    //    bodyPadding: 4,
    layout: 'form',
    fieldDefaults: EIM_field_defaults,
    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'combo',
                    fieldLabel: '客户',
                    name: 'customer_id',
                    allowBlank: false,
                    store: 'MiniCustomers',
                    displayField: 'name',
                    valueField: 'id',
                    editable: false
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
                }
            ]
        },
        {
            xtype: 'container',
            layout: 'hbox',
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
                    value: '1'
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
            xtype: 'container',
            layout: 'hbox',
            padding: '0 0 4 0',
            items: [
                {
                    xtype: 'datefield',
                    fieldLabel: '报价日期',
                    name: 'created_at',
                    allowBlank: false,
                    format: 'Y-m-d',
                    value: new Date()
                },
                {
                    xtype: 'combo',
                    name: 'group_id',
                    store: 'ComboGroups',
                    fieldLabel: '项目组',
                    displayField: 'name',
                    valueField: 'id',
                    editable: false
                }
            ]
        },
        {
            xtype: 'textfield',
            fieldLabel: '报价要求',
            emptyText: '销售对报价条款上的一些要求',
            name: 'request'
        }
    ]
});