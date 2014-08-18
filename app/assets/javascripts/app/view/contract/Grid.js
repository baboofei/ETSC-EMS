Ext.define('EIM.view.contract.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.contract_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '合同列表',
    store: 'Contracts',
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

        //“销售工程师”的伪字典项，供表格中表头筛选用
        var saleArray = filter_all_member_sale();
        //“商务”的伪字典项，供表格中表头筛选用
        var businessArray = filter_all_business();
        //“状态”的字典项，供表格中显示和表头筛选用
        var statusArray = filter_all_dict('contract_status');
        //“合同类别”的字典项，供表格中显示和表头筛选用
        var contractTypeArray = filter_all_dict('contract_type');

        this.columns = [
            {
                header: '东隆合同号',
                dataIndex: 'number',
                width: 75,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '合同摘要',
                dataIndex: 'summary',
                flex: 1,
                minWidth: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '签署时间',
                dataIndex: 'signed_at',
                width: 75,
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                },
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '合同状态',
                dataIndex: 'state',
                width: 50,
                renderer: function(value, metaData, record) {
                    //        #开始      start
                    //        #待审批    auditing        [放大镜]
                    //        #待签署    signing         [写字]
                    //        #已签订    progressing     [沙漏]
                    //        #已完成    complete        [对勾]
                    //        #已取消    cancelled       [禁止标志]
                    var str;
                    switch(value) {
                        case "a_start":
                            str = "<p></p>";
                            break;
                        case "b_auditing":
                            str = "<p class='act_contract_auditing' title='待审批'></p>";
                            break;
                        case "c_signing":
                            str = "<p class='act_contract_signing' title='待签署'></p>";
                            break;
                        case "d_progressing":
                            str = "<p class='act_contract_progressing' title='已签订'></p>";
                            break;
                        case "e_complete":
                            str = "<p class='act_contract_complete' title='已完成'></p>";
                            break;
                        case "f_cancelled":
                            str = "<p class='act_contract_cancelled' title='已取消'></p>";
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
                header: '合同类别',
                dataIndex: 'contract_type',
                width: 75,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(contractTypeArray, function(record) {
                        return [record["value"], record["display"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    var name;
                    Ext.Array.each(contractTypeArray, function(item, index, allItems) {
                        if(item['value'] === record.get('contract_type')) {
                            name = item['display'];
                        }
                    });
                    return name;
                }
            },
            {
                header: 'PO号',
                dataIndex: 'contract_items>purchase_order>number',
                width: 120,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '客户合同号',
                dataIndex: 'customer_number',
                width: 100,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '负责工程师',
                dataIndex: 'signer>id',
                width: 50,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(saleArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('signer>name');
                }
            },
            {
                header: '负责商务',
                dataIndex: 'dealer>id',
                width: 50,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(businessArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('dealer>name');
                }
            },
            {
                header: '客户单位',
                dataIndex: 'customer_unit>(name|unit_aliases>unit_alias|en_name)',
                width: 160,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '客户',
                dataIndex: 'end_user>(name|en_name)',
                width: 50,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '客户联系人',
                dataIndex: 'buyer>(name|en_name)',
                width: 50,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '商务相关联系人',
                dataIndex: 'business_contact>(name|en_name)',
                width: 50,
                filter: {
                    type: 'string'
                }
            }
        ];

        this.addContractButton = Ext.create('Ext.Button', {
            text: '新增合同',
            iconCls: 'btn_add',
            action: 'addContract'
        });
        this.transferContractButton = Ext.create('Ext.Button', {
            text: '转让合同',
            action: 'transferContract',
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

        this.bbar = [this.addContractButton, this.transferContractButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});