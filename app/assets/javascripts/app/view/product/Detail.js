Ext.define('EIM.view.product.Detail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.product_detail',

    title: '产品信息',
    bodyPadding: 4,
    autoScroll: true,
    layout: 'column',
//    style: 'margin: 4px',
    items: [
        {
            columnWidth: 1 / 3,
            baseCls: 'x-plain',
            bodyStyle: 'padding: 0 0 5px 0',
            items: [
                {
                    xtype: 'product_info_form',
                    bodyPadding: '0 4 4'
                }
            ]
        },
        {
            columnWidth: 1 / 3,
            baseCls: 'x-plain',
            bodyStyle: 'padding: 0 0 5px 5px',
            items: [
                {
                    xtype: 'product_price_form',
                    bodyPadding: '0 4 4'
                }
            ]
        },
        {
            columnWidth: 1 / 3,
            baseCls: 'x-plain',
            bodyStyle: 'padding: 0 0 5px 5px',
            items: [
                {
                    xtype: 'product_description_form',
                    bodyPadding: '0 4 4'
                }
            ]
        }
    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});