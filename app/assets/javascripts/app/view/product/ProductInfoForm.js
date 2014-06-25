Ext.define('EIM.view.product.ProductInfoForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.product_info_form',

    title: '基本信息',
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
            name: 'producer>(name|short_name|short_code)'
        },
        {
            xtype: 'expandable_vendor_unit_combo',
            name: 'seller>(name|short_name|short_code)',
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
    ],
    buttons: [
        {
            text: '保存基本信息',
            action: 'edit_product_info',
            iconCls: 'btn_save',
            id: 'privilege_button_edit_product_info',
            allowPrivilege: true,
            tempDisabled: true
        }
    ]
});