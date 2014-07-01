Ext.define('EIM.view.admin_inventory.ForStockGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.admin_inventory_for_stock_grid',

//    title: '待入库商品列表',
    store: 'GridForStockAdminInventories',
    iconCls: 'ttl_grid',
    multiSelect: true,

    initComponent: function() {
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
                header: '描述',
                dataIndex: 'description',
                width: 150,
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
                header: '币种',
                dataIndex: 'currency_name',
                width: 50,
                sortable: false
            },
            {
                header: '单价',
                dataIndex: 'buy_price',
                width: 80,
                sortable: false
            },
            {
                header: '人民币单价',
                dataIndex: 'rmb',
                width: 80,
                sortable: false
            },
            {
                header: '供应商',
                dataIndex: 'vendor_unit_name',
                width: 150,
                sortable: false
            },
            {
                header: '供方联系人',
                dataIndex: 'vendor_name',
                width: 70,
                sortable: false
            },
            {
                header: '采购人',
                dataIndex: 'buyer_user_name',
                width: 70,
                sortable: false
            },
            {
                header: '失效日期',
                dataIndex: 'expire_at',
                width: 90,
                sortable: false,
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '备注',
                dataIndex: 'comment',
                width: 200,
                sortable: false
            }
        ];
        this.addItemButton = Ext.create('Ext.Button', {
            text: '新增待入库商品',
            iconCls: 'btn_add',
            action: 'addItem'
        });
        this.deleteItemButton = Ext.create('Ext.Button', {
            text: '删除选中商品',
            iconCls: 'btn_delete',
            action: 'deleteSelection',
            disabled: true
        });

        this.bbar = [this.addItemButton, this.deleteItemButton];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});