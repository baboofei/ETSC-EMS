Ext.define('EIM.view.product.ProductDescriptionTab', {
    extend: 'Ext.form.Panel',
    alias: 'widget.product_description_tab',

    title: '描述',
    border: 0,
    padding: '0 4',
    //    bodyPadding: 4,
    layout: 'form',
    fieldDefaults: EIM_field_defaults,
    items: [
        {
            xtype: 'textarea',
            fieldLabel: '中文简述',
            name: 'simple_description_cn'
        },
        {
            xtype: 'textarea',
            fieldLabel: '英文简述',
            name: 'simple_description_en'
        }
    ]
});