Ext.define('EIM.view.product.ProductInfoTab', {
    extend: 'Ext.form.Panel',
    alias: 'widget.product_info_tab',

    title: '基本信息',
    border: 0,
    padding: '0 4',
    //    bodyPadding: 4,
    layout: 'form',
    fieldDefaults: EIM_field_defaults,
    defaults: {
        xtype: 'textfield'
    },
    items: [
        {
            xtype: 'hidden',
            name: 'id',
            hidden: true
        },
        {
            fieldLabel: '名称',
            name: 'name',
            allowBlank: false
        },
        {
            fieldLabel: '型号',
            name: 'model',
            allowBlank: false
        },
        {
            xtype: 'expandable_vendor_unit_combo',
            name: 'producer_vendor_unit_id'
        },
        {
            xtype: 'expandable_vendor_unit_combo',
            name: 'seller_vendor_unit_id',
            fieldLabel: '销售厂家'
        },
        {
            fieldLabel: 'REF号',
            name: 'reference'
        },
        {
            fieldLabel: '所属系列',
            name: 'serial_id'
        }
    ]
});