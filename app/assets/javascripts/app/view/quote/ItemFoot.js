Ext.define('EIM.view.quote.ItemFoot', {
    extend: 'Ext.form.Panel',
    alias: 'widget.quote_item_foot',

    title: '“合计”区域',
    iconCls: 'ttl_config',

    bodyPadding:4,
    autoScroll:true,
    layout:'form',
    fieldDefaults:EIM_field_defaults,

    defaults: {
        xtype: 'numberfield',
        minValue: 0.01
    },
    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'numberfield',
                    fieldLabel: '合计',
                    name: 'total',
                    flex: 3
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: '折',
                    labelWidth: 15,
                    name: 'x_discount',
                    minValue: 0,
                    maxValue: 1,
                    flex: 1
                }
            ]
//            fieldLabel: '合计',
//            name: 'total'
//        },
//        {
//            fieldLabel: '折',
//            name: 'x_discount'
        },
        {
            fieldLabel: '总折扣',
            name: 'total_discount',
            minValue: 0
        },
        {
            fieldLabel: '运保费',
            name: 'fif',
            minValue: 0
        },
        {
            fieldLabel: '总计',
            name: 'final_price'
        },
        {
            fieldLabel: '折合人民币',
            name: 'rmb'
        }
    ]
});