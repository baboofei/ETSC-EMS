/**
 * 小型的窗口，只供销售快速添加工厂用
 * 只给“名称”和“备注”框，详情去工厂模块填
 */
Ext.define('EIM.view.vendor_unit.MiniAddForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.vendor_unit_mini_add_form',

    title: '快速新增供应商',
    layout: 'fit',
    width: 450,
    height: 128,
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
                        hidden: true
                    },
                    {
                        name: 'name',
                        fieldLabel: '名称',
                        allowBlank: false
                    },
                    {
                        name: 'comment',
                        fieldLabel: '备注'
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