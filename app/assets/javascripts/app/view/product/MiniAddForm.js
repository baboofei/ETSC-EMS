/**
 * 小型的窗口，只供销售快速添加产品用
 * 只给“名称”、“型号”和“备注”框，详情去产品模块填
 */
Ext.define('EIM.view.product.MiniAddForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.product_mini_add_form',

    title: '快速新增产品',
    layout: 'fit',
    width: 500,
    maximizable: true,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
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
                        xtype: 'hidden',
                        name: 'source_element_id',
                        hidden: false
                    },
                    {
                        xtype: 'expandable_vendor_unit_combo',
                        name: 'vendor_unit_id',
                        fieldLabel: '工厂',
                        padding: '0 0 5'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5',
                        defaults: {
                            xtype: 'textfield'
                        },
                        items: [
                            {
                                name: 'name',
                                fieldLabel: '名称'
                            },
                            {
                                name: 'model',
                                fieldLabel: '型号'
                            }
                        ]
                    },
                    {
                        name: 'simple_description_cn',
                        fieldLabel: '中文简述'
                    },
                    {
                        name: 'simple_description_en',
                        fieldLabel: '英文简述'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '保存',
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