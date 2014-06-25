Ext.define('EIM.view.contract.ItemGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.contract_item_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '合同项列表',
    store: 'ContractItems',
    iconCls: 'ttl_grid',
    multiSelect: true,

    initComponent: function() {
        //“发货情况”的字典项，供表格中显示用
        var sendStatusArray = filter_all_dict('send_status');
        //“验收情况”的字典项，供表格中显示用
        var checkAndAcceptStatusArray = filter_all_dict('check_and_accept_status');
        this.columns = [
            {
                header: '产品型号',
                dataIndex: 'product>model',
                width: 200,
                sortable: false
            },
            {
                header: '产品序列号',
                dataIndex: 'serial_number',
                width: 75,
                sortable: false
            },
            {
                header: '数量',
                dataIndex: 'quantity',
                width: 50,
                sortable: false
            },
            {
                header: 'PO号',
                dataIndex: 'purchase_order>number',
                width: 90,
                sortable: false
            },
            {
                header: '发货状态',
                dataIndex: 'send_status',
                width: 75,
                renderer: function(value, metaData, record) {
                    var name;
                    Ext.Array.each(sendStatusArray, function(item, index, allItems) {
                        if(Number(item['value']) === Number(record.get('send_status'))) {
                            name = item['display'];
                        }
                    });
                    return name;
                }
            },
            {
                header: '合约发货时间',
                dataIndex: 'appointed_leave_factory_at',
                width: 100,
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '预计发货时间',
                dataIndex: 'expected_leave_factory_at',
                width: 100,
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '实际发货时间',
                dataIndex: 'actually_leave_factory_at',
                width: 100,
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '离开东隆时间',
                dataIndex: 'leave_etsc_at',
                width: 100,
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '到达客户时间',
                dataIndex: 'reach_customer_at',
                width: 100,
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '验收时间',
                dataIndex: 'check_and_accept_at',
                width: 100,
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '验收情况',
                dataIndex: 'check_and_accept_status',
                width: 75,
                renderer: function(value, metaData, record) {
                    var name;
                    Ext.Array.each(checkAndAcceptStatusArray, function(item, index, allItems) {
                        if(item['value'] === record.get('check_and_accept_status')) {
                            name = item['display'];
                        }
                    });
                    return name;
                }
            },
            {
                header: '质保条款',
                dataIndex: 'warranty_term>name',
                flex: 1,
                minWidth: 150
            }
        ];

        this.addContractItemButton = Ext.create('Ext.Button', {
            text: '新增',
            iconCls: 'btn_add',
            action: 'addContractItem'
        });
        this.addDoneButton = Ext.create('Ext.Button', {
            text: '增完',
            iconCls: 'btn_done',
            action: 'addDone'
        });
        this.editContractItemButton = Ext.create('Ext.Button', {
            text: '修改',
            iconCls: 'btn_edit',
            action: 'editContractItem',
            disabled: true
        });
        this.deleteContractItemButton = Ext.create('Ext.Button', {
            text: '删除',
            iconCls: 'btn_delete',
            action: 'deleteContractItem',
            disabled: true
        });
        this.divideSendingButton = Ext.create('Ext.Button', {
            text: '分批发货',
            iconCls: 'btn_divide',
            action: 'divideSending',
             disabled: true
        });
        this.batchEditContractItemButton = Ext.create('Ext.Button', {
            text: '批量修改合同项',
            action: 'batchEditContractItem',
            disabled: true,
            menu: Ext.create('Ext.menu.Menu', {
                items: [
                    {
                        text: '产品数量',
                        action: 'quantity',
                        menu: Ext.create('Ext.menu.Menu', {
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            minValue: 1,
                                            emptyText: '请输入产品数量',
                                            decimalPrecision: 0,
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'hidden',
                                            value: 'quantity',
                                            hidden: true
                                        },
                                        {
                                            xtype: 'button',
                                            text: '确定'
                                        }
                                    ]
                                }
                            ],
                            title: '产品数量'
                        })
                    },
                    {
                        text: '发货状态',
                        action: 'send_status',
                        menu: Ext.create('Ext.menu.Menu', {
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'combo',
                                            store: Ext.create('Ext.data.Store', {
                                                data: filter_all_dict('send_status'),
                                                model: 'EIM.model.AllDict',
                                                proxy:  'memory'
                                            }),
                                            valueField: 'value',
                                            displayField: 'display',
                                            emptyText: '请选择发货状态',
                                            triggerAction: 'all',
                                            editable: false,
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'hidden',
                                            value: 'send_status',
                                            hidden: true
                                        },
                                        {
                                            xtype: 'button',
                                            text: '确定'
                                        }
                                    ]
                                }
                            ],
                            title: '发货状态'
                        })
                    },
                    {
                        text: '合约发货时间',
                        action: 'appointed_leave_factory',
                        menu: Ext.create('Ext.menu.DatePicker', {
                            title: '发货时间',
                            id: 'appointed_leave_factory_at'
                        })
                    },
                    {
                        text: '预计发货时间',
                        action: 'expected_leave_factory',
                        menu: Ext.create('Ext.menu.DatePicker', {
                            title: '预计发货时间',
                            id: 'expected_leave_factory_at'
                        })
                    },
                    {
                        text: '实际发货时间',
                        action: 'actually_leave_factory',
                        menu: Ext.create('Ext.menu.DatePicker', {
                            title: '实际发货时间',
                            id: 'actually_leave_factory_at'
                        })
                    },
                    {
                        text: '离开东隆时间',
                        action: 'leave_etsc',
                        menu: Ext.create('Ext.menu.DatePicker', {
                            title: '离开东隆时间',
                            id: 'leave_etsc_at'
                        })
                    },
                    {
                        text: '到达客户时间',
                        action: 'reach_customer',
                        menu: Ext.create('Ext.menu.DatePicker', {
                            title: '到达客户时间',
                            id: 'reach_customer_at'
                        })
                    },
                    {
                        text: '客户验收时间',
                        action: 'check_and_accept',
                        menu: Ext.create('Ext.menu.DatePicker', {
                            title: '客户验收时间',
                            id: 'check_and_accept_at'
                        })
                    },
                    {
                        text: '验收状态',
                        action: 'check_and_accept_status',
                        menu: Ext.create('Ext.menu.Menu', {
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'combo',
                                            store: Ext.create('Ext.data.Store', {
                                                data: filter_all_dict('check_and_accept_status'),
                                                model: 'EIM.model.AllDict',
                                                proxy:  'memory'
                                            }),
                                            valueField: 'value',
                                            displayField: 'display',
                                            emptyText: '请选择验收状态',
                                            triggerAction: 'all',
                                            editable: false,
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'hidden',
                                            value: 'check_and_accept_status',
                                            hidden: true
                                        },
                                        {
                                            xtype: 'button',
                                            text: '确定'
                                        }
                                    ]
                                }
                            ],
                            title: '验收状态'
                        })
                    },
                    {
                        text: '质保条款……',
                        action: 'term'
                    },
                    {
                        text: '分批发货',
                        action: 'divide_sending',
                        menu: Ext.create('Ext.menu.Menu', {
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            minValue: 1,
                                            emptyText: '请输入要分出的数量',
                                            decimalPrecision: 0,
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'hidden',
                                            value: 'divide_sending',
                                            hidden: true
                                        },
                                        {
                                            xtype: 'button',
                                            text: '确定'
                                        }
                                    ]
                                }
                            ],
                            title: '分批发货'
                        })
                    }
                ]
            })
        });
        this.editSN = Ext.create('Ext.Button', {
            text: '修改序列号',
            iconCls: 'btn_edit',
            id: 'privilege_button_edit_contract_item_sn',
            action: 'editSN',
             disabled: true
        });
        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

        this.bbar = [
            this.addContractItemButton,
            this. addDoneButton,
            this.editContractItemButton,
            this.deleteContractItemButton,
            this.divideSendingButton,
            this.batchEditContractItemButton,
            this.editSN,
            this.pagingToolbar
        ];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    },

    //可多选，加一个“s”的项
    getSelectedItems: function() {
        return this.getSelectionModel().getSelection();
    }
});