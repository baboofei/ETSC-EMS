Ext.define('EIM.view.customer.ConfirmCustomerApplicationForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.customer_confirm_customer_application_form',

    title: '确认客户应用',
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
                        xtype: 'boxselect',
                        fieldLabel: '涉及应用',
                        store: "dict.Applications",
                        queryMode: "local",
                        forceSelection: false,
                        createNewOnBlur: true,
                        createNewOnEnter: true,
                        displayField: 'description',
                        valueField: 'id',
                        height: 50,
                        emptyText: '可多选'
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