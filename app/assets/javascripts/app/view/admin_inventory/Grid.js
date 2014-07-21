Ext.define('EIM.view.admin_inventory.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.admin_inventory_grid',

    requires:'Ext.ux.grid.FiltersFeature',

    title: '库存商品列表',
    store: 'GridAdminInventories',
    iconCls: 'ttl_grid',
    viewConfig: {enableTextSelection:true},

    initComponent: function() {
//        var me = this;
//        //“类别”的字典项，供表格中显示和表头筛选用
//        var inventoryTypeArray = filter_all_dict('stock_inventory_type');
        //“库存级别”的字典项，供表格中显示和表头筛选用
        var inventoryLevelArray = filter_all_dict('stock_inventory_level');
        //“存放地点”的字典项，供表格中显示和表头筛选用
        var keepAtArray = filter_all_dict('stock_keep_at');
        //“状态”的字典项，供表格中显示和表头筛选用
        var statusArray = filter_all_dict('stock_status');
        //“采购人”的伪字典项，供表格中显示和表头筛选用
        var buyerArray = filter_all_buyer();
        //“保管人”的伪字典项，供表格中显示和表头筛选用
        var userArray = filter_all_member();

        this.columns = [
            {
                header:'类别',
                dataIndex:'material_code>(name|code|description)',
                width:75,
                sortable:true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '厂家',
                dataIndex: 'bought_from>(name|en_name|unit_aliases>unit_alias)',
                width: 200,
                sortable: false,
                hidden: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header:'品名',
                dataIndex:'name',
                width:150,
                sortable:true,
                filter:{
                    type:'string'
                }
            },
            {
                header: '型号',
                dataIndex: 'model',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '描述',
                dataIndex: 'description',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '库存级别',
                dataIndex: 'inventory_level',
                width: 50,
                sortable: true,
                renderer: function(value, metaData, record) {
                    var name;
                    Ext.Array.each(inventoryLevelArray, function(item, index, allItems) {
                        if(Number(item['value']) === record.get('inventory_level')) {
                            name = item['display'];
                        }
                    });
                    return name;
                },
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(inventoryLevelArray, function (record) {
                        return [record["value"], record["display"]];
                    })
                }
            },
            {
                header: '存放地点',
                dataIndex: 'keep_at',
                width: 100,
                sortable: true,
                renderer: function(value, metaData, record) {
                    var name;
                    Ext.Array.each(keepAtArray, function(item, index, allItems) {
                        if(Number(item['value']) === record.get('keep_at')) {
                            name = item['display'];
                        }
                    });
                    return name;
                },
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(keepAtArray, function (record) {
                        return [record["value"], record["display"]];
                    })
                }
            },
            {
                header:'数量',
                dataIndex:'current_quantity',
                width:50,
                sortable:true,
                filter:{
                    type:'numeric'
                }
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
                width: 75,
                sortable: true,
                filter: {
                    type: 'numeric'
                }
            },
            {
                header: '状态',
                dataIndex: 'state',
                width: 50,
                sortable: true,
                renderer: function(value, metaData, record) {
                    //#开始            start
                    //#待入库          a_for_stock   [沙漏]
                    //#库存中          b_stocking    [箱子]
                    //#出库审批中      c_auditing    [写字]
                    //#待领用          d_for_use       ┓
                    //#待租借          e_for_loan     ┣[沙漏&箭头]
                    //#待售出          f_for_sell    ┛
                    //#已损坏          x_damaged     [损坏箱子]
                    //#已报废          y_scrapped    [垃圾箱]
                    //#被领用          g_using       [虚框箱子&用户]
                    //#被租借          h_loaned      [虚框箱子]
                    //#被卖出          i_sold        [虚框箱子&美元符号]
                    var str;
                    switch(value) {
                        case "a_for_stock":
                            str = "<p class='act_for_stock' title='待入库'></p>";
                            break;
                        case "b_stocking":
                            str = "<p class='act_stocking' title='库存中'></p>";
                            break;
                        case "c_auditing":
                            str = "<p class='act_auditing' title='审批中'></p>";
                            break;
                        case "d_for_use":
                            str = "<p class='act_for_use' title='待领用'></p>";
                            break;
                        case "e_for_loan":
                            str = "<p class='act_for_loan' title='待租借'></p>";
                            break;
                        case "f_for_sell":
                            str = "<p class='act_for_sell' title='待售出'></p>";
                            break;
                        case "x_damaged":
                            str = "<p class='act_damaged' title='已损坏'></p>";
                            break;
                        case "y_scrapped":
                            str = "<p class='act_scrapped' title='已报废'></p>";
                            break;
                        case "g_using":
                            str = "<p class='act_using' title='被领用'></p>";
                            break;
                        case "h_loaned":
                            str = "<p class='act_loaned' title='被租借'></p>";
                            break;
                        case "i_sold":
                            str = "<p class='act_sold' title='被售出'></p>";
                            break;
                        case "j_for_reject":
                            str = "<p class='act_for_reject' title='待退货'></p>";
                            break;
                        case "k_rejected":
                            str = "<p class='act_rejected' title='已退货'></p>";
                            break;
                        default:
                    }
                    return str;
                },
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(statusArray, function (record) {
                        return [record["value"], record["display"]];
                    })
                }
            },
            {
                header: '采购人',
                dataIndex: 'buyer>id',
                width: 50,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options:  Ext.Array.map(buyerArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('buyer_user_name');
                }
            },
            {
                header: '经手人',
                dataIndex: 'user_id',
                width: 50,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options:  Ext.Array.map(userArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('user_name');
                }
            },
            {
                header: '保管人',
                dataIndex: 'keeper>id',
                width: 50,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options:  Ext.Array.map(userArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('keeper_user_name');
                }
            },
            {
                header: '编号',
                dataIndex: 'number',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '序列号',
                dataIndex: 'sn',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '领用事由',
                dataIndex: 'project',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '失效日期',
                dataIndex: 'expire_at',
                width: 90,
                sortable: true,
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                },
                hidden: true,
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '过保日期',
                dataIndex: 'expire_warranty_at',
                width: 90,
                sortable: true,
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                },
                hidden: true,
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '操作日期',
                dataIndex: 'created_at',
                width: 90,
                sortable: true,
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                },
                hidden: true,
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header:'备注',
                dataIndex: 'comment',
                minWidth: 75,
                flex: 1,
                sortable:true,
                filter:{
                    type:'string'
                }
            }
        ];

        this.buyButton = Ext.create('Ext.Button', {
            text: '申请入库',
            iconCls: 'btn_buy',
            action: 'buy'
        });
        this.inStockButton = Ext.create('Ext.Button', {
            text: '入库',
            iconCls: 'btn_add',
            action: 'in_stock'
        });
        this.otherActionButton = Ext.create('Ext.Button', {
            text: '其他操作',
            disabled: true,
            action: 'other_action',
            menu: Ext.create('Ext.menu.Menu', {
                items: [
                    {
                        text: '出库',
                        action: 'out_stock'
                    },
                    {
                        text: '报损',
                        action: 'damage'
                    },
                    {
                        text: '报废',
                        action: 'scrap'
                    },
                    {
                        text: '充抵',
                        action: 'charge'
                    },
                    {
                        text: '变更存放地点',
                        action: 'change_location'
                    },
                    {
                        text: '变更所有权',
                        action: 'change_owner'
                    },
                    {
                        text: '单位换算',
                        action: 'exchange_unit'
                    }
                ]
            })
        });

        this.pagingToolbar = {
            xtype: 'pagingtoolbar',
            store:this.store,
            displayInfo:true,
            border:0,
            minWidth:380
        };
//
        this.features = [
            {
                ftype:'filters',
                encode:true
            }
        ];

        if(this.displayPaging) {
            //如果有此配置，则bbar上带上分页条
            if(this.bbar) {
                if(this.bbar[this.bbar.length - 1].xtype === 'pagingtoolbar') {
                    this.bbar = this.bbar;
                }else{
                    this.bbar.push('-');
                    this.bbar.push(this.pagingToolbar);
                }
            }else{
                this.bbar = this.pagingToolbar;
            }
        }else{
            //如果没有此配置，则不带
            if(this.bbar) {
                this.bbar = this.bbar;
            }else{
                this.bbar = null;
            }
        }

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    },
    getSelectedItems: function() {
        return this.getSelectionModel().getSelection();
    }
});


