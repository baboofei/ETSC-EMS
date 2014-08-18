Ext.define('EIM.view.business_unit.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.business_unit_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '商务相关单位列表',
    store: 'GridBusinessUnits',
    iconCls: 'ttl_grid',

    initComponent: function() {
        var me = this;
        //“单位性质”的字典项，供表格中显示和表头筛选用
//        var sortArray;
//        var sortStore = Ext.getStore('dict.CustomerUnitSorts');
//        //        var sortStore = Ext.data.StoreManager.lookup('dict.CustomerUnitSorts');
//        sortStore.load(function() {
//            //这一部分是给renderer用的
//            sortArray = Ext.pluck(sortStore.data.items, 'data');
//            //这一部分是给filter用的
//            var options = Ext.Array.map(sortArray, function(record) {
//                return [record["id"], record["name"]];
//            });
//            var target_col = me.getView().getHeaderCt().child('[dataIndex=sort_id]');
//            target_col.initialConfig.filter.options = options;
//        });
//        //“所属城市”不算字典项，但原理一样，供表格中显示用
//        var cityArray;
//        var cityStore = Ext.getStore('dict.Cities');
//        //        var cityStore = Ext.data.StoreManager.lookup('dict.Cities');
//        cityStore.load(function() {
//            //这一部分是给renderer用的
//            cityArray = Ext.pluck(cityStore.data.items, 'data');
//        });

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
                header: '城市',
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
                }
            },
            {
                header: '别称',
                dataIndex: 'unit_aliases>unit_alias',
                width: 150,
                sortable: true,
                hidden: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '备注',
                dataIndex: 'comment',
                flex: 1,
                sortable: true,
                filter: {
                    type: 'string'
                }
            }
        ];

        this.addBusinessUnitButton = Ext.create('Ext.Button', {
            text: '新增商务相关单位',
            iconCls: 'btn_add',
            action: 'addBusinessUnit'
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

        this.bbar = [this.addBusinessUnitButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});