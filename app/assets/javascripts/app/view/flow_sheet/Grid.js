Ext.define('EIM.view.flow_sheet.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.flow_sheet_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: 'TSD水单列表',
    store: 'GridFlowSheets',
    iconCls: 'ttl_grid',
    viewConfig: {
        getRowClass: function(record, index, rowParams) {
            if(!record.get('editable')) {
                return 'shared'
            }
        }
    },

    initComponent: function() {
        var me = this;
        //“参与工程师”的伪字典项，供表格中表头筛选用
        var supporterArray = filter_all_supporter();
        //“维修类别”的字典项，供表格中显示和表头筛选用
        var flowSheetTypeArray = filter_all_dict('flow_sheet_type', true);
        //“状态”的字典项，供表格中显示和表头筛选用
        var statusArray = filter_all_dict('flow_sheet_status');
        //“优先级”的字典项，供表格中显示和表头筛选用
        var priorityArray = filter_all_dict('sales_priority', true);
        //“保修状态”的字典项，供表格中显示用。这个因为是由下面的项目决定的，所以无法过滤或者排序
        var isInWarrantyArray = filter_all_dict('flow_sheet_in_warranty', true);

        this.columns = [
            {
                header: '服务单号',
                dataIndex: 'number',
                width: 75,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '类别',
                dataIndex: 'flow_sheet_type',
                width: 50,
                sortable: true,
                filter: {
                    type: 'string'
                },
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(flowSheetTypeArray, function(record) {
                        return [record["value"], record["display"]];
                    })
                },
                renderer: function(value) {
                    var name;
                    Ext.Array.each(flowSheetTypeArray, function(item, index, allItems) {
                        if(item['value'] === value) {
                            name = item['display'];
                        }
                    });
                    return name;
                }
            },
            {
                header: '创建日期',
                dataIndex: 'created_at',
                width: 100,
                sortable: true,
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                },
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '参与工程师',
                dataIndex: 'users>id',
                width: 75,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(supporterArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('users>name');
                }
            },
            {
                header: '总工时',
                dataIndex: 'duration',
                width: 50,
                sortable: true,
                filter: {}
            },
            {
                header: '客户单位',
                dataIndex: 'customer_units>(name|en_name|unit_aliases>unit_alias)',
                width: 280,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '客户联系人',
                dataIndex: 'customers>(name|en_name)',
                width: 120,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '描述',
                dataIndex: 'description',
                flex: 1,
                sortable: true
            },
            {
                header: '状态',
                dataIndex: 'state',
                width: 50,
                sortable: true,
                renderer: function(value, metaData, record) {
//                    维修受理	          a_start
//                    维修中   	          b_dealing
//                    等待中
//                    等待客户发货         c_waiting_customer_send
//                    等待客户响应         c_waiting_customer_respond
//                    等待备件             c_waiting_spare
//                    等待原厂支持         c_waiting_factory_support
//                    等待客户付款/开票    c_waiting_customer_pay
//                    无法处理  	          d_failure
//                    红打包               e_red_package_done
//                    绿打包               e_green_package_done
//                    红完成   	          f_red_done
//                    绿完成   	          f_green_done
//                    结案    	          g_complete

                    var str;
                    switch(value) {
                        case "b_dealing":
                            str = "<p class='act_dealing' title='维修中'></p>";
                            break;
                        case "c_waiting_customer_send":
                            str = "<p class='act_progressing' title='等待中'></p>";
                            break;
                        case "c_waiting_customer_respond":
                            str = "<p class='act_progressing' title='等待中'></p>";
                            break;
                        case "c_waiting_spare":
                            str = "<p class='act_progressing' title='等待中'></p>";
                            break;
                        case "c_waiting_factory_support":
                            str = "<p class='act_progressing' title='等待中'></p>";
                            break;
                        case "c_waiting_customer_pay":
                            str = "<p class='act_progressing' title='等待中'></p>";
                            break;
                        case "d_failure":
                            str = "<p class='act_contract_cancelled' title='无法处理'></p>";
                            break;
                        case "e_red_package_done":
                            str = "<p class='act_check_red' title='红打包'></p>";
                            break;
                        case "f_red_done":
                            str = "<p class='act_check_red' title='红完成'></p>";
                            break;
                        case "e_green_package_done":
                            str = "<p class='act_check' title='打包'></p>";
                            break;
                        case "f_green_done":
                            str = "<p class='act_check' title='完成'></p>";
                            break;
                        case "g_complete":
                            str = "<p class='act_done' title='结案'></p>";
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
                header: '优先级',
                dataIndex: 'priority',
                width: 50,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(priorityArray, function(record) {
                        return [record["value"], record["display"]];
                    })
                },
                renderer: function(value) {
                    var name;
                    Ext.Array.each(priorityArray, function(item, index, allItems) {
                        if(item['value'] === value) {
                            name = item['display'];
                        }
                    });
                    return name;
                }
            },
            {
                header: '保修状态',
                dataIndex: 'is_in_warranty',
                width: 50,
                sortable: false,
                renderer: function(value) {
                    var name;
                    Ext.Array.each(isInWarrantyArray, function(item, index, allItems) {
                        if(item['value'] === value) {
                            name = item['display'];
                        }
                    });
                    return name;
                }
            },
            {
                header: '合同号',
                dataIndex: 'contract>number',
                width: 100,
                filter: {
                    type: 'string'
                }
            }
        ];

        this.addFlowSheetButton = Ext.create('Ext.Button', {
            text: '新增水单',
            iconCls: 'btn_add',
            action: 'addFlowSheet'
        });
        this.transferFlowSheetButton = Ext.create('Ext.Button', {
            text: '转让个案',
            action: 'transferFlowSheet',
            disabled: true
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

        this.bbar = [this.addFlowSheetButton, this.transferFlowSheetButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});


