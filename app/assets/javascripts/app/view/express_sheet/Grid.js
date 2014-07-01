Ext.define('EIM.view.express_sheet.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.express_sheet_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '快递单列表',
    store: 'GridExpressSheets',
    iconCls: 'ttl_grid',
    viewConfig: {
        enableTextSelection: true,
        getRowClass: function(record, index, rowParams) {
            if(!record.get('editable')) {
                return 'shared'
            }
        }
    },

    initComponent: function() {
        var me = this;
        var userArray = filter_all_user();
        //“币种”的伪字典项，供表格中显示和表头筛选用
        var currencyArray = filter_currency(4);
        //“快递公司”的字典项，供表格中显示和表头筛选用
        var expressUnitArray = filter_all_dict('express', true);
        //“信用等级”的字典项，供表格中显示和表头筛选用
        var creditLevelArray = filter_all_dict('credit_level');

        this.columns = [
            {
                header: '快递公司',
                dataIndex: 'express_unit_name',
                width: 150,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options:  Ext.Array.map(expressUnitArray, function(record) {
                        return [record["id"], record["display"]];
                    })
                }
            },
            {
                header: '单号',
                dataIndex: 'number',
                width: 120,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '寄件人',
                dataIndex: 'sender>name',
                width: 150,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options:  Ext.Array.map(userArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                }
            },
            {
                header: '收件人单位',
                dataIndex: '^unit_receivable>(name|unit_aliases>unit_alias)',
                width: 150,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '收件人',
                dataIndex: '^person_receivable>(name|en_name)',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '所寄物品',
                dataIndex: 'description',
                minWidth: 150,
                flex: 1,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '所属项',
                dataIndex: '^vestable>(number)',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '费用币种',
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
                header: '费用金额',
                dataIndex: 'cost',
                width: 100,
                sortable: true,
                filter: {
                    type: 'numeric'
                }
            },
            {
                header: '寄件日期',
                dataIndex: 'created_at',
                width: 90,
                sortable: true,
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                },
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '下载',
                dataIndex: 'pdf_url',
                width: 50,
                sortable: true,
                hidden: true,
                renderer: function(value, metaData, record) {
                    var short_url = value.split("/")[value.split("/").length - 1];
                    return "<a href='/application/download/express_sheets/" + short_url + "' target='_blank'><p class='act_download' title='下载'></p></a>"
                }
            },
            {
                header: '备注',
                dataIndex: 'comment',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
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