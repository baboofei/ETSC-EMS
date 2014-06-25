Ext.define('EIM.view.material_code.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.material_code_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '物料编码列表',
    store: 'GridMaterialCodes',
    iconCls: 'ttl_grid',

    initComponent: function() {
        var me = this;
        //“单位性质”的字典项，供表格中显示和表头筛选用
        var cuSortArray = filter_all_dict('unit_properties');


        this.columns = [
            {
                header: '名称',
                dataIndex: 'name',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '编码',
                dataIndex: 'code',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '描述',
                dataIndex: 'description',
                flex: 1,
                minWidth: 250,
                sortable: true,
                filter: {
                    type: 'string'
                }
            }
        ];

        this.addMaterialCodeButton = Ext.create('Ext.Button', {
            text: '新增物料编码',
            iconCls: 'btn_add',
            action: 'addMaterialCode'
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

        this.bbar = [this.addMaterialCodeButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});