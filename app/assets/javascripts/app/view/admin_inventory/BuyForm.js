/**
 * “申请入库”的表单
 */
Ext.define('EIM.view.admin_inventory.BuyForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_buy_form',

    title: '入库商品信息',
    layout: 'fit',
    width: 662,
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
                    padding: '0 0 5',
                    defaults: {
                        xtype: 'textfield'
                    }
                },
                items: [
                    {
                        items: [
                            {
                                xtype: 'combo',
                                fieldLabel: '品名',
                                name: 'name',
                                allowBlank: false,
                                store: 'ComboAdminInventoryNames',
                                displayField: 'name',
                                valueField: 'id',
                                mode: 'remote',
                                emptyText: '请输入品名，注意有提示',
                                triggerAction: 'query',
                                minChars: 1,
                                hideTrigger: true //伪成输入框
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: '型号',
                                name: 'model',
                                store: 'ComboAdminInventoryModels',
                                displayField: 'name',
                                valueField: 'id',
                                mode: 'remote',
                                emptyText: '请输入型号，注意有提示',
                                triggerAction: 'query',
                                minChars: 1,
                                hideTrigger: true //伪成输入框
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '描述',
                        name: 'description',
                        padding: '0 0 0',
                        allowBlank: false
                    },
                    {
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: '数量',
                                name: 'current_quantity',
                                minValue: 0,
                                allowBlank: false,
                                minText: '至少得有一件物品吧！',
                                negativeText: '数量不能为负数！'
                            },
                            {
                                fieldLabel: '统计单位',
                                name: 'count_unit',
                                emptyText: '个/件/千克之类的',
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'amount_with_currency',
                                name: 'buy_price',
                                fieldLabel: '单价',
                                subFlex: '4|3',
                                emptyText: '购入时的单价',
//                                padding: '0 0 4 0',
                                storeHint: 4,
                                decimalPrecision: 4,
                                flex: 1,
                                allowBlank: false,
                                allowZero: true
                            },
                            {
                                xtype: 'numberfield',
                                name: 'rmb',
                                fieldLabel: 'RMB单价',
                                allowBlank: false,
                                decimalPrecision: 4,
                                minText: '请输入折合人民币的单价！',
                                negativeText: '不能是负的！',
                                flex: 1
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'expandable_vendor_unit_combo',
                                fieldLabel: '供应商',
                                emptyText: '请输入并选择供应商名称',
                                flex: 1
                            },
                            {
                                xtype: 'expandable_vendor_combo',
                                flex: 1
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                name: 'expire_at',
                                fieldLabel: '失效日期'
                            },
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                name: 'expire_warranty_at',
                                fieldLabel: '过保日期'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'combo',
                                name: 'buyer>id',
                                fieldLabel: '采购人',
                                emptyText: '请选择采购人',
                                store: 'ComboPurchasers',
                                valueField: 'id',
                                displayField: 'name',
                                flex: 1,
                                triggerAction: 'all',
                                editable: false,
                                allowBlank: false
                            },
                            {
                                xtype: 'textfield',
                                name: 'comment',
                                flex: 3,
                                fieldLabel: '备注'
                            }
                        ]
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定',
                action: 'save',
                group: 'submit'
            },
            {
                text: '确定u',
                action: 'update',
                group: 'submit',
                hidden: true
            },
            {
                text: '确定并继续',
                action: 'save_apply',
                group: 'submit'
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