Ext.define('EIM.view.pop_unit.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.pop_unit_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '公共单位列表',
    store: 'GridPopUnits',
    iconCls: 'ttl_grid',
    viewConfig: {enableTextSelection:true},

    initComponent: function() {
        var me = this;
        //“单位性质”的字典项，供表格中显示和表头筛选用
        var cuSortArray = filter_all_dict('unit_properties');
        //“信用等级”的字典项，供表格中显示和表头筛选用
        var creditLevelArray = filter_all_dict('credit_level');

        this.columns = [
            {
                header: '名称',
                dataIndex: 'name|en_name|unit_aliases>unit_alias',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '所属城市',
                dataIndex: 'city>name',
                width: 50,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '邮政编码',
                dataIndex: 'postcode',
                width: 75,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '地址',
                dataIndex: 'addr',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '英文名称',
                dataIndex: 'en_name',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '英文地址',
                dataIndex: 'en_addr',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '网址',
                dataIndex: 'site',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                },
                renderer: function(value) {
                    if(value.match(/^http:\/\//)) {
                        return "<a href='" + value + "' target='_blank'>" + value + "</a>";
                    } else {
                        if(Ext.isEmpty(value)) {
                            return "";
                        } else {
                            return "<a href='http://" + value + "' target='_blank'>http://" + value + "</a>";
                        }
                    }
                }
            },
            {
                header: '单位性质',
                dataIndex: 'cu_sort',
                width: 100,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(cuSortArray, function(record) {
                        return [record["value"], record["display"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    var name;
                    Ext.Array.each(cuSortArray, function(item, index, allItems) {
                        if(item['value'] === record.get('cu_sort')) {
                            name = item['display'];
                        }
                    });
                    return name;
                }
            },
            {
                header: '信用等级',
                dataIndex: 'credit_level',
                width: 50,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(creditLevelArray, function(record) {
                        return [record["value"], record["display"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    var name;
                    Ext.Array.each(creditLevelArray, function(item, index, allItems) {
                        if(item['value'] === record.get('credit_level')) {
                            name = item['display'];
                        }
                    });
                    return name;
                }
            },
            {
                header: '别称',
                dataIndex: 'unit_aliases>unit_alias',
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

        this.addPopUnitButton = Ext.create('Ext.Button', {
            text: '新增客户单位',
            iconCls: 'btn_add',
            action: 'addPopUnit'
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

        this.bbar = [this.addPopUnitButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedPopUnit: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});