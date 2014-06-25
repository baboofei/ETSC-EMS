Ext.define('EIM.view.quote.ItemFee', {
    extend: 'Ext.form.Panel',
    alias: 'widget.quote_item_fee',

    title: '各种费用相关',
//    iconCls: 'ttl_config',

    bodyPadding: 4,
    autoScroll: true,
    layout: 'anchor',
    fieldDefaults: EIM_field_defaults,

    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'combo',
                    store: Ext.create('Ext.data.Store', {
                        data: filter_currency(5),
                        model: 'EIM.model.dict.Currency',
                        proxy:  'memory'
                    }),
                    fieldLabel: '产品币种',
                    name: 'currency_id',
                    displayField: 'name',
                    valueField: 'id',
                    emptyText: '请选择币种',
                    editable: false,
                    triggerAction: 'all'
                },
                {
                    xtype: 'combo',
                    store: Ext.create('Ext.data.Store', {
                        data: filter_currency(4),
                        model: 'EIM.model.dict.Currency',
                        proxy:  'memory'
                    }),
                    fieldLabel: '运保费币种',
                    name: 'fif_currency_id',
                    displayField: 'name',
                    valueField: 'id',
                    emptyText: '请选择币种',
                    editable: false,
                    disabled: true,
                    triggerAction: 'all'
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: '清关费用',
                    name: 'declaration_fee',
                    minValue: 0
                }
            ]
        },
        {
            xtype: 'container',
            layout: 'hbox',
            padding: '4 0',
            items: [
                {
                    xtype: 'checkbox',
                    fieldLabel: '关税增值税',
                    boxLabel: '计算关税、增值税',
                    name: 'does_count_ctvat'
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: '最大关税(%)',
                    name: 'max_custom_tax',
                    value: 0,
                    disabled: true
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: '增值税(%)',
                    name: 'vat',
                    value: 17,
                    decimalPrecision: 0,
                    minValue: 1,
                    maxValue: 50,
                    disabled: true
                }
            ]
        }
    ]
});
