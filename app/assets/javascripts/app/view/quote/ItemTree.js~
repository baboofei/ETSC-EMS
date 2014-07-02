Ext.define('EIM.view.quote.ItemTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.quote_item_tree',

    title: '报价项表格',
    store: 'QuoteItems',
    rootVisible: false,
    viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop'
        },
        toggleOnDblClick: false
    },
    multiSelect: true,
    sortableColumns: false,

    initComponent:function () {
        this.columns = [
            {
                text: '编号',
                dataIndex: 'inner_id',
                width: 40
            },
            {
                xtype: 'treecolumn',
                text: '型号',
                width: 300,
                renderer: function(value, metaData, record) {
                    var description;
                    if(record["data"]["leaf"]) {
                        //如果是叶子，则用产品的型号名称拼
                        description = record["data"]["product_model"] + record["data"]["product_name"];
                    }else{
                        //如果不是叶子，则用型号
                        description = record["data"]["product_model"];
                    }
                    return description;
                }
            },
            {
                text: '生产厂家',
                dataIndex: 'vendor_unit_name',
                width: 100
            },
            {
                text: '描述',
                dataIndex: 'description',
                width: 150
            },
            {
                text: '关税',
                dataIndex: 'custom_tax',
                width: 40
            },
            {
                text: '数量',
//                dataIndex: 'quantity',
                width: 75,
                renderer: function(value, metaData, record) {
                    var quantity;
                    if(record["data"]["quantity_2"] != 0) {
                        //如果有第二数量，则拼起来显示
                        quantity = record["data"]["quantity"] + "~" + record["data"]["quantity_2"];
                    }else{
                        //如果没有，则只显示数量
                        quantity = record["data"]["quantity"];
                    }
                    return quantity;
                }
            },
            {
                text: '来源价',
                width: 100,
                columnName: 'original_unit_price',
                renderer: function(value, metaData, record) {
                    //不是叶子，或者是叶子但值是0，则显示“无”
                    var original_unit_price = "无";
                    if(Number(record["data"]["original_unit_price"]) != 0) {
                        //否则，用币种和来源价拼在一起，取两位小数
                        original_unit_price = record["data"]["original_currency_name"] + Number(record["data"]["original_unit_price"]).toFixed(2);
                    }
                    return original_unit_price;
                }
            },
            {
                text: '单价',
                width: 100,
                dataIndex: 'unit_price',
                renderer: function(value, metaData, record) {
                    var unit_price;
//                    console.log(value);
                    if(value === 0) {
                        //如果传过来是0，则显示“无”
                        unit_price = '无';
                    }else{
                        //如果不是，则用折后币种和单价拼在一起，取两位小数
                        unit_price = record["data"]["currency_name"] + Number(record["data"]["unit_price"]).toFixed(2);
                    }
                    return unit_price;
                }
            },
            {
                text: '汇率',
                width: 50,
                dataIndex: 'exchange_rate'
            },
            {
                text: '折扣',
                width: 100,
                dataIndex: 'discount',
                renderer: function(value, metaData, record) {
                    var unit_price;
                    //                    console.log(value);
                    if(value === 0) {
                        //如果传过来是0，则显示“无”
                        unit_price = '无';
                    }else{
                        //如果不是，则用折后币种和折扣价拼在一起，取两位小数
                        unit_price = record["data"]["currency_name"] + Number(record["data"]["discount"]).toFixed(2);
                    }
                    return unit_price;
                }
            },
            {
                text: '折至',
                width: 100,
                dataIndex: 'discount_to',
                renderer: function(value, metaData, record) {
                    var unit_price;
                    //                    console.log(value);
                    if(value === 0) {
                        //如果传过来是0，则显示“无”
                        unit_price = '无';
                    }else{
                        //如果不是，则用折后币种和折后价拼在一起，取两位小数
                        unit_price = record["data"]["currency_name"] + Number(record["data"]["discount_to"]).toFixed(2);
                    }
                    return unit_price;
                }
            },
            {
                text: '小计',
                width: 150,
                dataIndex: 'total',
                renderer: function(value, metaData, record) {
                    var unit_price;
                    //                    console.log(value);
                    if(value === 0) {
                        //如果传过来是0，则显示“无”
                        unit_price = '无';
                    }else{
                        //如果不是，则用折后币种和小计拼在一起，取两位小数
                        unit_price = record["data"]["currency_name"] + Number(record["data"]["total"]).toFixed(2);
                    }
                    return unit_price;
                }
            }
        ];
        this.addQuoteBlockButton = Ext.create('Ext.Button', {
            text: '新增系统/子系统',
            iconCls: 'btn_add_folder',
            action: 'addQuoteBlock'
        });
        this.editQuoteBlockButton = Ext.create('Ext.Button', {
            text: '修改块',
            iconCls: 'btn_edit',
            action: 'editQuoteBlock',
            hidden: true
        });
        this.addQuoteItemButton = Ext.create('Ext.Button', {
            text: '新增报价项',
            iconCls: 'btn_add_product',
            action: 'addQuoteItem'
        });
        this.batchAddProductButton = Ext.create('Ext.Button', {
            text: '批量新增产品',
            iconCls: 'btn_batch_add',
            action: 'batchAddProduct'
        });
        this.editQuoteItemButton = Ext.create('Ext.Button', {
            text: '修改',
            iconCls: 'btn_edit',
            action: 'editQuoteItem',
            disabled: true
        });
        this.batchMarkUpDownButton = Ext.create('Ext.Button', {
            text: '批量加/减价',
            iconCls: 'btn_edit',
            action: 'batchMarkUpDown',
            disabled: true
        });
        this.deleteButton = Ext.create('Ext.Button', {
            text: '删除',
            iconCls: 'btn_delete',
            action: 'deleteSelection',
            disabled: true
        });

        this.bbar = [
            this.addQuoteBlockButton,
            this.addQuoteItemButton,
            this.batchAddProductButton,
            this.editQuoteBlockButton,
            this.editQuoteItemButton,
            this.batchMarkUpDownButton,
            this.deleteButton
        ];

        this.callParent(arguments);
    },

    getSelectedItem:function () {
        return this.getSelectionModel().getSelection()[0];
    },

    //可多选，加一个“s”的项
    getSelectedItems:function () {
        return this.getSelectionModel().getSelection();
    }
});