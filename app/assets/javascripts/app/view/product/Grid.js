Ext.define('EIM.view.product.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.product_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '产品列表',
    store: 'GridProducts',
    iconCls: 'ttl_grid',

    initComponent: function() {
        var me = this;
        //“币种”的伪字典项，供表格中显示和表头筛选用
        var currencyArray = filter_currency(4);

        this.columns = [
            {
                header: '产品型号',
                dataIndex: 'model',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '产品名称',
                dataIndex: 'name',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '生产厂商',
                dataIndex: 'producer>(name|short_name|short_code|en_name)',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '销售厂商',
                dataIndex: 'seller>(name|short_name|short_code|en_name)',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: 'reference号',
                dataIndex: 'reference',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '中文简述',
                dataIndex: 'simple_description_cn',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '英文简述',
                dataIndex: 'simple_description_en',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '币种',
                dataIndex: 'currency_id',
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
                header: 'list价',
                dataIndex: 'price_in_list',
                width: 100,
                sortable: true,
                filter: {
                    type: 'numeric'
                }
            },
            {
                header: '工厂价',
                dataIndex: 'price_from_vendor',
                width: 100,
                sortable: true,
                filter: {
                    type: 'numeric'
                }
            },
            {
                header: '市场价',
                dataIndex: 'price_to_market',
                width: 100,
                sortable: true,
                filter: {
                    type: 'numeric'
                }
            },
            {
                header: '网站价',
                dataIndex: 'price_in_site',
                width: 100,
                sortable: true,
                filter: {
                    type: 'numeric'
                }
            },
            {
                header: '所属系列',
                dataIndex: 'serial>name',
                width: 50,
                sortable: true,
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '税则号',
                dataIndex: 'tax_number',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '关税',
                dataIndex: 'custom_tax',
                width: 100,
                sortable: true,
                filter: {
                    type: 'numeric'
                }
            }
        ];

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

        this.bbar = [this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});