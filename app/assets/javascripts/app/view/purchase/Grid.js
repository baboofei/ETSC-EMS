Ext.define('EIM.view.purchase.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.purchase_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '采购信息列表',
    store: 'GridPurchases',
    iconCls: 'ttl_grid',

    initComponent: function() {
        var me = this;
        //“币种”的伪字典项，供表格中显示和表头筛选用
        var currencyArray = filter_currency(4);

        this.columns = [
            {
                header: '合同项目',
                dataIndex: 'contract_project',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '合同编号',
                dataIndex: 'contract_number',
                width: 80,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '签署时间',
                dataIndex: 'sign_at',
                width: 100,
                sortable: true,
                renderer: Ext.util.Format.dateRenderer("Y-m-d"),
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                }
            },
            {
                header: '卖方',
                dataIndex: 'seller',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '名称',
                dataIndex: 'name',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '型号',
                dataIndex: 'model',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '数量',
                dataIndex: 'quantity',
                width: 40,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '单位',
                dataIndex: 'unit',
                width: 40,
                sortable: true
            },
            {
                header: '报价币种',
                dataIndex: 'quoted_currency_id',
                width: 50,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options:  Ext.Array.map(currencyArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('currency_name');
                }
            },
            {
                header: '首次报价',
                dataIndex: 'first_quoted',
                width: 100,
                sortable: true,
                filter: {
                    type: 'numeric'
                }
            },
            {
                header: '成交币种',
                dataIndex: 'purchase_currency_id',
                width: 50,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options:  Ext.Array.map(currencyArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('currency_name');
                }
            },
            {
                header: '成交单价',
                dataIndex: 'unit_price',
                width: 100,
                sortable: true,
                filter: {
                    type: 'numeric'
                }
            },
            {
                header: '金额',
                dataIndex: 'price',
                width: 100,
                sortable: true,
                filter: {
                    type: 'numeric'
                }
            },
            {
                header: '折扣',
                dataIndex: 'first_quoted',
                width: 100,
                sortable: true,
                filter: {
                    type: 'numeric'
                }
            },
            {
                header: '发票',
                dataIndex: 'invoice',
                width: 80,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '付款方式',
                dataIndex: 'pay_method',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '付款计划时间',
                dataIndex: 'expected_pay_at',
                width: 90,
                sortable: true,
                renderer: Ext.util.Format.dateRenderer("Y-m-d"),
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                }
            },
            {
                header: '付款情况',
                dataIndex: 'pay_status',
                width: 80,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '开票情况',
                dataIndex: 'invoice_status',
                width: 80,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '质保',
                dataIndex: 'warranty',
                width: 80,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '预交货时间',
                dataIndex: 'expected_deliver_at',
                width: 90,
                sortable: true,
                renderer: Ext.util.Format.dateRenderer("Y-m-d"),
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                }
            },
            {
                header: '实交货时间',
                dataIndex: 'actually_deliver_at',
                width: 90,
                sortable: true,
                renderer: Ext.util.Format.dateRenderer("Y-m-d"),
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                }
            },
            {
                header: '交货地点',
                dataIndex: 'deliver_place',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '生产商',
                dataIndex: 'vendor_unit',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '最终用户',
                dataIndex: 'end_user',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '负责人',
                dataIndex: 'user',
                width: 75,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '说明',
                dataIndex: 'description',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '备注',
                dataIndex: 'comment',
                flex: 1,
                minWidth: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            }
        ];

        this.addPurchaseButton = Ext.create('Ext.Button', {
            text: '新增采购信息',
            iconCls: 'btn_add',
            action: 'addPurchase'
        });
        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

        this.features = [
            {
                ftype: 'filters',
                encode: true
            }
        ];

        this.bbar = [this.addPurchaseButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});