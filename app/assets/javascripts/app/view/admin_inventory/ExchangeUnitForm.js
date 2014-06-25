/**
 * “单位换算”的表单
 */
Ext.define('EIM.view.admin_inventory.ExchangeUnitForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_exchange_unit_form',

    title: '单位换算',
    layout: 'fit',
    width: 600,
    height: 118,
    border: 0,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                defaults: {
                    xtype: 'container',
                    layout: 'hbox',
                    padding: '0 0 5'
                },
                items: [
                    {
                        items: [
                            {
                                xtype: 'hidden',
                                name: 'id',
                                hidden: true
                            },
                            {
                                xtype: 'numberfield',
                                name: 'exchange_unit_old_count',
                                fieldLabel: '旧数量',
                                disabled: true
                            },
                            {
                                xtype: 'textfield',
                                name: 'exchange_unit_old_unit',
                                fieldLabel: '旧单位',
                                disabled: true
                            },
                            {
                                xtype: 'numberfield',
                                name: 'exchange_unit_old_rmb',
                                fieldLabel: '旧RMB单价',
                                disabled: true
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'exchange_unit_new_count',
                                fieldLabel: '新数量',
                                minValue: 0,
                                minText: '物品数量怎么能是0呢！',
                                negativeText: '不能是负的！',
                                allowBlank: false
                            },
                            {
                                xtype: 'textfield',
                                name: 'exchange_unit_new_unit',
                                fieldLabel: '新单位',
                                emptyText: '个/件/千克之类的',
                                allowBlank: false
                            },
                            {
                                xtype: 'numberfield',
                                name: 'exchange_unit_new_rmb',
                                fieldLabel: '新RMB单价',
                                allowBlank: false
                            }
                        ]
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