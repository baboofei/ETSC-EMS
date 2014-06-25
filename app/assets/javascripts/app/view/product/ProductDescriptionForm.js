Ext.define('EIM.view.product.ProductDescriptionForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.product_description_form',

    title: '描述',
//    border: 0,
//    padding: '0 4',
    //    bodyPadding: 4,
    layout: 'form',
    fieldDefaults: EIM_field_defaults,
    items: [
        {
            xtype: 'hidden',
            name: 'id',
            hidden: true
        },
        {
            xtype: 'textarea',
            fieldLabel: '中文简述',
            name: 'simple_description_cn',
            height: 70
        },
        {
            xtype: 'textarea',
            fieldLabel: '英文简述',
            name: 'simple_description_en',
            height: 70
        },
        {
            xtype: 'textfield',
            fieldLabel: '备注',
            name: 'comment'
        }
    ],
    buttons: [
        {
            text: '保存描述',
            action: 'edit_product_description',
            iconCls: 'btn_save',
            id: 'privilege_button_edit_product_description',
            allowPrivilege: true,
            tempDisabled: true
        }
    ]
});