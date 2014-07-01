Ext.define('EIM.view.salelog.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.salelog_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '销售日志列表',
    store: 'Salelogs',
    iconCls: 'ttl_grid',
    sortableColumns: false,
    viewConfig: {enableTextSelection:true},

    initComponent: function() {
//        var ownerStore = Ext.data.StoreManager.lookup('Users');
        //“销售工作进展”的字典项，供表格中显示和表头筛选用
        var processArray = filter_all_dict('sales_processes', true);

        this.columns = [
            {
                header: '联系时间',
                width: 120,
                dataIndex: 'contact_at',
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
//            {
//                header: '进展描述',
//                width: 75,
//                dataIndex: 'process',
//                renderer: function(value, metaData, record) {
//                    var name;
//                    Ext.Array.each(processArray, function(item, index, allItems) {
//                        if(item['value'] === value) {
//                            name = item['display'];
//                        }
//                    });
//                    return name;
//                }
//            },
            {
                header: '进展细节',
                flex: 1,
                minWidth: 75,
                dataIndex: 'natural_language',
                renderer: function(value, metaData, record) {
                    metaData.tdAttr = 'data-qtip="' + Ext.util.Format.stripTags(record.get("natural_language")) + '"';
                    return value;
                }
            },
            {
                header: '备注',
                width: 150,
                dataIndex: 'comment',
                renderer: function(value, metaData, record) {
                    metaData.tdAttr = 'data-qtip="' + record.get("comment") + '"';
                    return value;
                }
            }
        ];

        this.addSalelogButton = Ext.create('Ext.Button', {
            text: '新增销售工作日志',
            iconCls: 'btn_add',
            action: 'addSalelog',
            disabled: true
        });
        this.addRemindButton = Ext.create('Ext.Button', {
            text: '新增提醒',
            iconCls: 'btn_clock',
            action: 'addRemind',
            disabled: true
        });
        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,//'Salelogs',//Ext.getStore('Salelogs'),
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

        this.features = [{
            ftype: 'filters',
            encode: true
        }];

        this.bbar = [this.addSalelogButton, this.addRemindButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    }
});