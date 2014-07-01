/**
 * “入库”的表单
 */
Ext.define('EIM.view.admin_inventory.InStockForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_in_stock_form',

    title: '入库',
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
//                                xtype: 'combo',
//                                fieldLabel: '库管类别',
//                                name: 'inventory_type',
//                                store: 'dict.MaterialCodes',
//                                mode: 'remote',
//                                displayField: 'name',
//                                valueField: 'id',
//                                triggerAction: 'query',
//                                minChars: 1,
//                                hideTrigger: true,
//                                allowBlank: false,
//                                forceSelection: true
                                xtype: 'expandable_material_code_combo',
                                name: 'inventory_type',
                                flex: 1
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: '财务类别',
                                name: 'financial_type',
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('stock_financial_type'),
                                    model: 'EIM.model.AllDict',
                                    proxy:  'memory'
                                }),
                                displayField: 'display',
                                valueField: 'value',
                                flex: 1,
                                value: '2',
                                triggerAction: 'all',
                                editable: false,
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'expandable_vendor_unit_combo',
                                fieldLabel: '所有权',
                                emptyText: '请输入并选择此物品的所有权单位',
                                flex: 1
                            },
                            {
                                xtype: 'checkbox',
                                fieldLabel: '资产编号',
                                boxLabel: '自动生成资产编号',
                                checked: false,
                                name: 'does_generate_number'
                            }
                        ]
                    },
                    {
                        defaults: {
                            xtype: 'combo',
                            displayField: 'display',
                            valueField: 'value',
                            triggerAction: 'all',
                            editable: false,
                            allowBlank: false
                        },
                        items: [
                            {
                                fieldLabel: '库存级别',
                                name: 'inventory_level',
                                value: '3',
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('stock_inventory_level'),
                                    model: 'EIM.model.AllDict',
                                    proxy:  'memory'
                                })
                            },
                            {
                                fieldLabel: '存放地点',
                                name: 'keep_at',
                                value: '2',
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('stock_keep_at'),
                                    model: 'EIM.model.AllDict',
                                    proxy: 'memory'
                                })
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                editable: false,
                                name: 'created_at',
                                fieldLabel: '入库日期',
                                allowBlank: false,
                                value: new Date()
                            },
                            {
                                xtype: 'numberfield',
                                name: 'current_quantity',
                                fieldLabel: '实际数量',
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        name: 'sn',
                        padding: '0 0 0 0',
                        fieldLabel: '序列号',
                        emptyText: '请输入序列号，多个序列号用西文逗号“,”分开',
                        validator: function(){
                            if(this.invalidMsg === '') {
                                this.clearInvalid();
                                return true;
                            } else {
                                return this.invalidMsg;
                            }
                        },
                        invalidMsg: ''
                    },
                    {
                        xtype: 'textfield',
                        name: 'comment',
                        fieldLabel: '备注'
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