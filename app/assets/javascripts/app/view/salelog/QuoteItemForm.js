Ext.define('EIM.view.salelog.QuoteItemForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.quote_item_form',

    title: '新增/修改报价项目',
    layout: 'anchor',
    width: 400,
    height: 154,
    modal: true,
    autoShow: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                border: 0,
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'hidden',
                        name: 'id'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '工厂',
                        name: 'vendor_unit_id'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '产品',
                        name: 'product_id',
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '指标',
                        name: 'parameter'
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
                text: '确定',
                action: 'update',
                hidden: true
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