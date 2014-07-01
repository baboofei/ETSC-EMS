Ext.define('EIM.view.customer.ConfirmCustomerUnitForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.customer_confirm_customer_unit_form',

    title: '确认客户单位',
    layout: 'fit',
    width: 300,
//    height: 93,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                trackResetOnLoad: true,
                items: [
                    {
                        xtype: 'hidden',
                        name: 'source_element_id',
                        hidden: true
                    },
                    {
                        xtype: 'expandable_customer_unit_combo'
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