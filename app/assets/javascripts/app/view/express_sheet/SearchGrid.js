Ext.define('EIM.view.express_sheet.SearchGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.express_sheet_search_grid',

    requires:'Ext.ux.grid.FiltersFeature',

    store: 'ExpressCustomers',
    iconCls: 'ttl_grid',
    multiSelect: true,

    initComponent: function() {
        var me = this;

        //“涉及应用”的字典项，供表格中显示和表头筛选用
        var applicationArray = filter_all_application();
        //“区域”的字典项，供表格中显示和表头筛选用
        var areaArray = filter_all_area();
        //“单位性质”的字典项，供表格中显示和表头筛选用
        var cuSortArray = filter_all_dict('unit_properties');

        this.columns = [
            {
                header:'姓名',
                dataIndex:'name',
                width:75,
                sortable:true,
                filter:{
                    type:'string'
                }
            },
            {
                header:'客户单位',
                dataIndex:'customer_unit_name',
                width:150,
                sortable:true,
                filter:{
                    type:'string'
                }
            },
            {
                header: '单位性质',
                dataIndex: 'cu_sort',
                width: 50,
                sortable: true,
                renderer: function(value, metaData, record) {
                    var name;
                    Ext.Array.each(cuSortArray, function(item, index, allItems) {
                        if(item['id'] === record.get('cu_sort')) {
                            name = item['name'];
                        }
                    });
                    return name;
                },
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(cuSortArray, function (record) {
                        return [record["id"], record["name"]];
                    })
                }
            },
            {
                header: '区域',
                dataIndex: 'area_name',
                width: 50,
                sortable: true,
                filter: {
                    type:'list',
                    phpMode:true,
                    options:Ext.Array.map(areaArray, function (record) {
                        return [record["id"], record["name"]];
                    })
                }
            },
            {
                header: '城市',
                dataIndex: 'city_name',
                width: 50,
                sortable: true,
                filter: {
                    type:'string'
                }
            },
            {
                header:'涉及应用',
                dataIndex:'application_ids',
                width:100,
                sortable:true,
                filter:{
                    type:'list',
                    phpMode:true,
                    options:Ext.Array.map(applicationArray, function (record) {
                        return [record["id"], record["description"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('application_names');
                }
            },
            {
                header: '固定电话',
                dataIndex: 'phone',
                width: 75,
                sortable: false
            },
            {
                header: '移动电话',
                dataIndex: 'mobile',
                width: 75,
                sortable: false
            },
            {
                header: '地址',
                dataIndex: 'addr',
                width: 150,
                sortable: false
            },
            {
                header:'备注',
                dataIndex:'comment',
                width:50,
                sortable:true,
                filter:{
                    type:'list',
                    phpMode:true,
                    options:[]
                },
                flex: 1
            }
        ];

        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store:this.store,
            displayInfo:true,
            border:0,
            minWidth:380
        });

        this.features = [
            {
                ftype:'filters',
                encode:true
            }
        ];

        this.bbar = this.displayPaging ? [this.pagingToolbar] : this.bbar;

        this.callParent(arguments);
    }
});