/**
 * 维修水单里的收货清单表格
 */
Ext.define('EIM.view.flow_sheet.ReceptionGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.flow_sheet_reception_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '收货清单',
    iconCls: 'ttl_grid',

    initComponent: function() {
        this.store = 'FlowSheetReceptions';
        this.columns = [
            {
                header: '工厂',
                flex: 1,
                sortable: false,
                dataIndex: 'vendor_unit>name',
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
                header: '型号',
                width: 100,
                sortable: false,
                dataIndex: 'model',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '故障现象',
                width: 100,
                sortable: false,
                dataIndex: 'breakdown',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '到货时间',
                width: 100,
                sortable: false,
                dataIndex: 'accepted_at',
                filter: {
                    type: 'date'
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

        this.addInstrumentFromButton = Ext.create('Ext.Button', {
            text: '添加货品',
            iconCls: 'btn_add',
            action: 'addInstrumentFrom',
            disabled: true
        });
        this.deleteInstrumentFromButton = Ext.create('Ext.Button', {
            text: '删除货品',
            iconCls: 'btn_delete',
            action: 'deleteInstrumentFrom',
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

        this.bbar = [this.addInstrumentFromButton, this.deleteInstrumentFromButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});