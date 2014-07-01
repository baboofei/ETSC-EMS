Ext.define('EIM.view.quote.BatchProductForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.quote_batch_product_form',

    title: '批量新增产品',
    layout: 'fit',
    width: 500,
    height: 174,
    maximizable: true,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                autoScroll: true,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'expandable_vendor_unit_combo',
                        allowBlank: false
                    },
                    {
                        xtype: 'expandable_product_box_select',
                        allowBlank: false,
                        fieldLabel: '型号',
                        padding: '4 0'
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
