Ext.define('EIM.view.vendor.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.vendor_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '供应商列表',
    store: 'GridVendors',
    iconCls: 'ttl_grid',

    initComponent: function() {
        var me = this;
        //“单位性质”的字典项，供表格中显示和表头筛选用
        var cuSortArray = filter_all_dict('unit_properties');


        this.columns = [
            {
                header: '姓名',
                dataIndex: 'name',
                width: 80,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '英文名',
                dataIndex: 'en_name',
                width: 80,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '所属单位',
                dataIndex: 'vendor_unit>(name|en_name|unit_aliases>unit_alias|short_code)',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '部门',
                dataIndex: 'department',
                width: 50,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '职位',
                dataIndex: 'position',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '电子邮箱',
                dataIndex: 'email',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '固定电话',
                dataIndex: 'phone',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '移动电话',
                dataIndex: 'mobile',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '传真',
                dataIndex: 'fax',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: 'QQ/MSN',
                dataIndex: 'im',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '地址',
                dataIndex: 'addr',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '英文地址',
                dataIndex: 'en_addr',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '邮编',
                dataIndex: 'postcode',
                width: 50,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '备注',
                dataIndex: 'comment',
                flex: 1,
                minWidth: 80,
                sortable: true,
                filter: {
                    type: 'string'
                }
            }
        ];

//        this.addVendorButton = Ext.create('Ext.Button', {
//            text: '新增供应商',
//            iconCls: 'btn_add',
//            action: 'addVendor'
//        });
        this.pagingToolbar = {
            xtype: 'pagingtoolbar',
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        };

        this.features = [
            {
                ftype: 'filters',
                encode: true
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
    }
});