Ext.define('EIM.view.customer.ConfirmSalecaseForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.customer_confirm_salecase_form',

    title: '选择个案',
    layout: 'fit',
    width: 500,
//    height: 93,
    modal: true,

    initComponent: function() {
        //“所属用户”的伪字典项，供表格中表头筛选用
        var userArray = filter_all_member_sale();
        //“优先级”的字典项，供表格中显示和表头筛选用
        var priorityArray = filter_all_dict('sales_priority', true);

        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                trackResetOnLoad: true,
                items: [
                    {
                        xtype: 'hidden',
                        name: 'source_element_id',
                        hidden: true
                    },
                    {
                        xtype: 'grid',
                        name: 'possible_salecases',
                        title: '已有个案(同单位或同客户)',
                        height: 200,
                        store: 'GridPossibleSalecases',
                        columns: [
                            {
                                header: '个案编号',
                                dataIndex: 'number',
                                width: 75
                            },
                            {
                                header: '个案描述',
                                dataIndex: 'comment',
                                flex: 1,
                                minWidth: 100
                            },
                            {
                                header: '起始日期',
                                dataIndex: 'start_at',
                                width: 100,
                                renderer: Ext.util.Format.dateRenderer("Y-m-d")
                            },
                            {
                                header: '最近联系日期',
                                dataIndex: 'updated_at',
                                width: 100,
                                renderer: Ext.util.Format.dateRenderer("Y-m-d")
                            },
                            {
                                header: '已签合同？',
                                dataIndex: 'has_signed_contract',
                                width: 80
                            },
                            {
                                header: '负责人',
                                dataIndex: 'user_id',
                                width: 50,
                                renderer: function(value, metaData, record) {
                                    return record.get('user_name');
                                }
                            },
                            {
                                header: '项目组',
                                dataIndex: 'group_id',
                                width: 80,
                                renderer: function(value, metaData, record) {
                                    return record.get('group_name');
                                }
                            },
                            {
                                header: '客户单位',
                                dataIndex: 'customer_units>(name|en_name|unit_aliases>unit_alias)',
                                width: 200,
                                sortable: false,
                                filter: {
                                    type: 'string'
                                }
                            },
                            {
                                header: '客户联系人',
                                dataIndex: 'customers>(name|en_name)',
                                width: 200,
                                sortable: false,
                                filter: {
                                    type: 'string'
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
                                header: '成案率(%)',
                                dataIndex: 'feasible',
                                width: 60,
                                sortable: true,
                                filter: {
                                    type: 'numeric'
                                }
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: 'GridPossibleSalecases',
                            displayInfo: true,
                            border: 0,
                            minWidth: 380
                        })
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '新增日志至选中个案',
                action: 'save_into',
                disabled: true
            },
            {
                text: '新增日志至新个案',
                action: 'save_new'
            },
            {
                text: '取消',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});