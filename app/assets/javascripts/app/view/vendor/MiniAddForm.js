/**
 * 小型的窗口，只供快速添加供方联系人用
 * 只给“姓名”、“英文名”(非必填)、“移动电话”和“固定电话”框，详情去供方联系人模块填
 */
Ext.define('EIM.view.vendor.MiniAddForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.vendor_mini_add_form',

    title: '快速新增供方联系人',
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
                        hidden: true
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
                                fieldLabel: '姓名',
                                allowBlank: false
                            },
                            {
                                name: 'en_name',
                                fieldLabel: '英文名'
                            }
                        ]
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
                                name: 'phone',
                                fieldLabel: '固定电话'
                            },
                            {
                                name: 'mobile',
                                fieldLabel: '移动电话'
                            }
                        ]
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