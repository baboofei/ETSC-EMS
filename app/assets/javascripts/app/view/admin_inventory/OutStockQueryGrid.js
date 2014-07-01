Ext.define('EIM.view.admin_inventory.OutStockQueryGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.admin_inventory_out_stock_query_grid',

//    title: '待出库商品列表',
    store: 'GridOutStockQueryAdminInventories',
    iconCls: 'ttl_grid',
//    multiSelect: false,

    initComponent: function() {
        //“存放地点”的字典项，供表格中显示和表头筛选用
        var keepAtArray = filter_all_dict('stock_keep_at');
        this.columns = [
            {
                header: '品名',
                dataIndex: 'name',
                width: 75,
                sortable: false
            },
            {
                header: '型号',
                dataIndex: 'model',
                width: 100,
                sortable: false
            },
            {
                header: '数量',
                dataIndex: 'current_quantity',
                width: 50,
                sortable: false
            },
            {
                header: '单位',
                dataIndex: 'count_unit',
                width: 50,
                sortable: false
            },
            {
                header: '人民币单价',
                dataIndex: 'rmb',
                width: 80,
                sortable: false
            },
            {
                header: '项目',
                dataIndex: 'project',
                width: 120,
                sortable: false
            },
            {
                header: '存放地点',
                dataIndex: 'keep_at',
                width: 120,
                renderer: function(value, metaData, record) {
                    var name;
                    Ext.Array.each(keepAtArray, function(item, index, allItems) {
                        if(Number(item['value']) === record.get('keep_at')) {
                            name = item['display'];
                        }
                    });
                    return name;
                },
                sortable: false
            },
            {
                header: '备注',
                dataIndex: 'comment',
                width: 200,
                sortable: false
            }
        ];
//        this.addItemButton = Ext.create('Ext.Button', {
//            text: '新增待入库商品',
//            iconCls: 'btn_add',
//            action: 'addItem'
//        });
//        this.deleteItemButton = Ext.create('Ext.Button', {
//            text: '删除选中商品',
//            iconCls: 'btn_delete',
//            action: 'deleteSelection',
//            disabled: true
//        });
//
//        this.bbar = [this.addItemButton, this.deleteItemButton];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});