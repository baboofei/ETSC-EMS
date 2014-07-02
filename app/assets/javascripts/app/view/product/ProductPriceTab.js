Ext.define('EIM.view.product.ProductPriceTab', {
    extend: 'Ext.form.Panel',
    alias: 'widget.product_price_tab',

    title: '价格信息',
    border: 0,
    padding: '0 4',
    //    bodyPadding: 4,
    layout: 'form',
    fieldDefaults: EIM_field_defaults,
    items: [
        {
            xtype: 'combo',
            fieldLabel: '币种',
            name: 'currency_id',
            store: Ext.create('Ext.data.Store', {
                data: filter_currency(4),
                model: 'EIM.model.dict.Currency',
                proxy: 'memory'
            }),
            displayField: 'name',
            valueField: 'id',
            allowBlank: false,
            editable: false,
            triggerAction: 'all'
        },
        {
            xtype: 'container',
            layout: 'hbox',
            padding: 0,
            border: 0,
            defaults: {
                xtype: 'numberfield',
                minValue: 0,
                minText: '请输入正数……',
                allowNegative: false,
                invalidText: '请输入正数……',
                decimalPrecision: 2,
                step: 1
            },
            items: [
                {
                    fieldLabel: 'list价',
                    name: 'price_in_list',
                    emptyText: '工厂给我们的价格表里面写的价格'
                },
                {
                    fieldLabel: '工厂价',
                    name: 'price_from_vendor',
                    emptyText: '我们的纯成本'
                }
            ]
        },
        {
            xtype: 'container',
            layout: 'hbox',
            defaults: {
                xtype: 'numberfield',
                minValue: 0,
                minText: '请输入正数……',
                allowNegative: false,
                invalidText: '请输入正数……',
                decimalPrecision: 2,
                step: 1
            },
            items: [
                {
                    fieldLabel: '市场价',
                    name: 'price_to_market',
                    emptyText: '加了一定利润率可以报给客户的价格'
                },
                {
                    fieldLabel: '网站价',
                    name: 'price_in_site',
                    emptyText: '显示在网站上的价格'
                }
            ]
        },
        {
            xtype: 'numberfield',
            fieldLabel: '关税',
            name: 'custom_tax',
            minValue: 0,
            maxValue: 1,
            minText: '请输入正数……',
            minText: '重税啊……',
            allowNegative: false,
            invalidText: '请输入正数……',
            decimalPrecision: 2,
            step: 0.01
        },
        {
            xtype: 'textfield',
            fieldLabel: '税则号',
            name: 'tax_number'
        }
    ]
});