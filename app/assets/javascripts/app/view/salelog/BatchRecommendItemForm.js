Ext.define('EIM.view.salelog.BatchRecommendItemForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.batch_recommend_item_form',

    title: '批量新增推荐项目',
    layout: 'anchor',
    width: 400,
    height: 200,
    modal: true,

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
                        xtype: 'expandable_vendor_unit_combo',
                        allowBlank: false
                    },
                    {
                        xtype: 'expandable_product_box_select',
                        allowBlank: false,
                        fieldLabel: '型号',
                        padding: '4 0'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '客户需求',
                        name: 'customer_requirement'
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