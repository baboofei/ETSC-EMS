Ext.define('EIM.view.vendor_unit.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.vendor_unit_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '供应商单位列表',
    store: 'GridVendorUnits',
    iconCls: 'ttl_grid',

    initComponent: function() {
        var me = this;

        //“技术”的伪字典项，供表格中表头筛选用
        var supporterArray = filter_all_supporter();
        //“商务”的伪字典项，供表格中表头筛选用
        var businessArray = filter_all_business();
        //“采购”的伪字典项，供表格中表头筛选用
        var buyerArray = filter_all_buyer();

        this.columns = [
            {
                header: '名称',
                dataIndex: 'name|en_name|unit_aliases>unit_alias|short_code',
                width: 200,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '别称',
                dataIndex: 'unit_aliases>unit_alias',
                width: 100,
                sortable: true,
                hidden: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '简码',
                dataIndex: 'short_code',
                width: 50,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '采购',
                dataIndex: 'purchasers>id',
                width: 100,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options:  Ext.Array.map(buyerArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('purchasers>name');
                }
            },
            {
                header: '商务',
                dataIndex: 'businesses>id',
                width: 100,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options:  Ext.Array.map(businessArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('businesses>name');
                }
            },
            {
                header: '技术',
                dataIndex: 'supporters>id',
                width: 100,
                sortable: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options:  Ext.Array.map(supporterArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('supporters>name');
                }
            },
            {
                header: '所属城市',
                dataIndex: 'city>name',
                width: 50,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '邮政编码',
                dataIndex: 'postcode',
                width: 75,
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
                header: '英文名称',
                dataIndex: 'en_name',
                width: 100,
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
                header: '网址',
                dataIndex: 'site',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                },
                renderer: function(value) {
                    if(value.match(/^http:\/\//)) {
                        return "<a href='" + value + "' target='_blank'>" + value + "</a>";
                    } else {
                        if(Ext.isEmpty(value)) {
                            return "";
                        } else {
                            return "<a href='http://" + value + "' target='_blank'>http://" + value + "</a>";
                        }
                    }
                }
            },
            {
                header: '合作？',
                dataIndex: 'is_partner',
                width: 50,
                sortable: true,
                filter: {
                    type: 'list',
                    options: [[true, '是'], [false, '否']]
                }
            },
            {
                header: '生产？',
                dataIndex: 'is_producer',
                width: 50,
                sortable: true
            },
            {
                header: '销售？',
                dataIndex: 'is_seller',
                width: 50,
                sortable: true
            },
            {
                header: '主要产品',
                dataIndex: 'major_product',
                width: 150,
                sortable: true
            },
            {
                header: '备注',
                dataIndex: 'comment',
                flex: 1,
                minWidth: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            }
        ];

        this.addVendorUnitButton = Ext.create('Ext.Button', {
            text: '新增供应商单位',
            iconCls: 'btn_add',
            action: 'addVendorUnit'
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

        this.bbar = [this.addVendorUnitButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});