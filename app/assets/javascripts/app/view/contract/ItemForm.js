Ext.define('EIM.view.contract.ItemForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.contract_item_form',

    title: '新增/修改合同项',
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
                trackResetOnLoad: true,
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
                        xtype: 'expandable_vendor_unit_combo',
                        fieldLabel: '生产厂家'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '5 0',
                        items: [
                            {
                                xtype: 'expandable_product_combo',
                                fieldLabel: '产品型号',
                                flex: 2
                            },
                            {
                                name: 'quantity',
                                xtype: 'numberfield',
                                fieldLabel: '数量',
                                decimalPrecision: 0,
                                minValue: 1,
                                minText: '最少也得有一件产品吧',
                                flex: 1,
                                allowBlank: false
                            }
                        ]
                    },
//                    {
//                        name: 'serial_number',
//                        fieldLabel: '序列号'
//                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        defaults: {
                            xtype: 'combo'
                        },
                        items: [
                            {
                                name: 'send_status',
                                fieldLabel: '发货状态',
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('send_status'),
                                    model: 'EIM.model.AllDict',
                                    proxy: 'memory'
                                }),
                                valueField: 'value',
                                displayField: 'display',
                                value: '01',
                                emptyText: '请选择发货状态',
                                triggerAction: 'all',
                                editable: false,
                                allowBlank: false
                            },
                            {
                                name: 'check_and_accept_status',
                                fieldLabel: '验收状态',
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('check_and_accept_status'),
                                    model: 'EIM.model.AllDict',
                                    proxy: 'memory'
                                }),
                                valueField: 'value',
                                displayField: 'display',
                                value: '1',
                                emptyText: '请选择验收状态',
                                triggerAction: 'all',
                                editable: false,
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '5 0 0',
                        defaults: {
                            xtype: 'datefield',
                            format: 'Y-m-d'
                        },
                        items: [
                            {
                                name: 'appointed_leave_factory_at',
                                fieldLabel: '合约发货'
                            },
                            {
                                name: 'expected_leave_factory_at',
                                fieldLabel: '预计发货'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '5 0 0',
                        defaults: {
                            xtype: 'datefield',
                            format: 'Y-m-d'
                        },
                        items: [
                            {
                                name: 'actually_leave_factory_at',
                                fieldLabel: '实际发货'
                            },
                            {
                                name: 'leave_etsc_at',
                                fieldLabel: '离开东隆'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '5 0',
                        items: [
                            {
                                xtype: 'datefield',
                                name: 'reach_customer_at',
                                fieldLabel: '到达客户',
                                format: 'Y-m-d'
                            },
                            {
                                xtype: 'combo',
                                store: [[]],
                                name: 'purchase_order_id',
                                fieldLabel: '<s>PO号</s>',
                                emptyText: '现在还选不了，得等PO模块做好',
                                editable: false
                            }
                        ]
                    },
                    {
                        name: 'warranty_term_id',
                        fieldLabel: '质保条款',
                        xtype: 'combo',
                        store: 'Terms',
                        mode: 'remote',
                        vtype: 'term',
                        valueField: 'id',
                        displayField: 'name',
                        emptyText: '请输入并选择质保条款，格式见下面↓',
                        triggerAction: 'query',
                        minChars: 1,
                        value: 2,
                        rawValue: '从出厂起12个月',
                        hideTrigger: true,
                        allowBlank: false
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '质保条款格式',
                        labelWidth: 100,
                        value: '从[出厂|发货|到港|到货|客户验收|客户开始使用]起##个[月|小时]<br><span style="color: gray;">#表示数字，中括号表示选择支。</span>'
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
                text: '确定并继续',
                action: 'save_apply'
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