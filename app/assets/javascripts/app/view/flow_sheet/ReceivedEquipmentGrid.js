/**
 * 维修水单里的收/发货清单表格
 */
Ext.define('EIM.view.flow_sheet.ReceivedEquipmentGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.flow_sheet_received_equipment_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '收/发货清单',
    iconCls: 'ttl_grid',
    multiSelect: true,

    initComponent: function() {
        this.store = 'FlowSheetReceivedEquipments';
        this.columns = [
            {
                header: '工厂',
                flex: 1,
                minWidth: 150,
                sortable: false,
                dataIndex: 'vendor_unit>name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '型号',
                width: 150,
                sortable: false,
                dataIndex: 'product>model',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '序列号',
                width: 50,
                sortable: false,
                dataIndex: 'sn',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '故障现象',
                width: 100,
                sortable: false,
                dataIndex: 'symptom',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '到货日期',
                width: 100,
                sortable: false,
                dataIndex: 'accepted_at',
                renderer: Ext.util.Format.dateRenderer("Y-m-d"),
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                }
            },
            {
                header: '到付单号',
                width: 80,
                sortable: false,
                dataIndex: 'collect_account_number',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '保修状态',
                width: 50,
                sortable: false,
                dataIndex: 'is_in_warranty',
                filter: {
                    type: 'boolean',
                    yesText: '保内',
                    noText: '保外'
                },
                renderer: function(value) {
                    return value ? "保内" : "保外";
                }
            },
            {
                header: '已包装？',
                width: 50,
                sortable: false,
                dataIndex: 'is_packaged',
                filter: {
                    type: 'boolean'
                },
                renderer: function(value) {
                    return value ? "是" : "否";
                }
            },
            {
                header: '已返厂？',
                width: 50,
                sortable: false,
                dataIndex: 'is_return_factory',
                filter: {
                    type: 'boolean'
                },
                renderer: function(value) {
                    return value ? "是" : "否";
                }
            },
            {
                header: '已发还？',
                width: 50,
                sortable: false,
                dataIndex: 'is_sent_back',
                filter: {
                    type: 'boolean'
                },
                renderer: function(value) {
                    return value ? "是" : "否";
                }
            },
            {
                header: '备注',
                width: 100,
                sortable: false,
                dataIndex: 'comment',
                filter: {
                    type: 'string'
                }
            }
        ];

        this.addEquipmentButton = Ext.create('Ext.Button', {
            text: '添加货品',
            iconCls: 'btn_add',
            action: 'addEquipment',
            disabled: true
        });
        this.deleteEquipmentButton = Ext.create('Ext.Button', {
            text: '删除货品',
            iconCls: 'btn_delete',
            action: 'deleteEquipment',
            disabled: true
        });
        this.packageEquipmentButton = Ext.create('Ext.Button', {
            text: '包装',
            action: 'packageEquipment',
            disabled: true
        });
        this.returnEquipmentButton = Ext.create('Ext.Button', {
            text: '返厂',
            action: 'returnEquipment',
            disabled: true
        });
        this.receiveEquipmentButton = Ext.create('Ext.Button', {
            text: '返厂收货',
            action: 'receiveEquipment',
            disabled: true
        });
        this.deliverEquipmentButton = Ext.create('Ext.Button', {
            text: '发还客户',
            action: 'deliverEquipment',
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

        this.bbar = [
            this.addEquipmentButton,
            this.deleteEquipmentButton,
            this.packageEquipmentButton,
            this.returnEquipmentButton,
            this.receiveEquipmentButton,
            this.deliverEquipmentButton,
            '-',
            this.pagingToolbar
        ];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    },

    //可多选，加一个“s”的项
    getSelectedItems: function() {
        return this.getSelectionModel().getSelection();
    }
});