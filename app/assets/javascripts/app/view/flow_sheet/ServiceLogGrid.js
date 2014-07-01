Ext.define('EIM.view.flow_sheet.ServiceLogGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.flow_sheet_service_log_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '服务日志',
    store: 'ServiceLogs',
    iconCls: 'ttl_grid',
    sortableColumns: false,
    viewConfig: {enableTextSelection:true},

    initComponent: function() {
//        var ownerStore = Ext.data.StoreManager.lookup('Users');

        this.columns = [
            {
                header: '开始时间',
                width: 120,
                dataIndex: 'start_at',
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '结束时间',
                width: 120,
                dataIndex: 'end_at',
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

        this.addServiceLogButton = Ext.create('Ext.Button', {
            text: '新增服务日志',
            iconCls: 'btn_add',
            action: 'addServiceLog',
            disabled: true,
            menu: new Ext.menu.Menu({
                items: [
//                    {
//                        text: '报价',
//                        action: 'quote'
//                    },
                    {
                        text: '到货查验',
                        action: 'checkEquipment'
                    },
                    {
                        text: '客户自行返厂',
                        action: 'selfReturnFactory'
                    },
                    {
                        text: '等待客户响应',
                        action: 'waitCustomerRespond'
                    },
                    {
                        text: '客户已响应',
                        action: 'customerRespond'
                    },
                    {
                        text: '寄备用机给客户',
                        action: 'sendStandBy'
                    },
                    {
                        text: '确认客户不修',
                        action: 'confirmQuit'
                    },
                    {
                        text: '等待备件',
                        action: 'waitSpare'
                    },
                    {
                        text: '备件就绪',
                        action: 'spareDone'
                    },
                    {
                        text: '等待原厂支持',
                        action: 'waitFactorySupport'
                    },
                    {
                        text: '原厂支持就绪',
                        action: 'factorySupportDone'
                    },
                    {
                        text: '更换零部件',
                        action: 'changeParts'
                    },
                    {
                        text:'更换拆机件',
                        action: 'changeDetachedParts'
                    },
                    {
                        text: '返厂出货',
                        action: 'returnFactorySend'
                    },
                    {
                        text: '返厂收货',
                        action: 'returnFactoryReceive'
                    },
                    {
                        text: '检验/测试',
                        action: 'checkOrTest'
                    },
                    {
                        text: '校准/调试',
                        action: 'calibrateOrDebug'
                    },
                    {
                        text: '上门服务',
                        action: 'doorToDoorService'
                    },
                    {
                        text: '产生维修争议',
                        action: 'dispute'
                    },
                    {
                        text: '等待客户付款/开票',
                        action: 'waitCustomerPay'
                    },
                    {
                        text: '客户已付款/开票',
                        action: 'customerPayDone'
                    },
                    {
                        text: '包装',
                        action: 'redPackage'
                    },
                    {
                        text: '包装',
                        action: 'greenPackage'
                    },
                    {
                        text: '发货',
                        action: 'redDeliver'
                    },
                    {
                        text: '发货',
                        action: 'greenDeliver'
                    },
                    {
                        text: '跟踪',
                        action: 'track'
                    }
                ]
            })
        });
        this.addRemindButton = Ext.create('Ext.Button', {
            text: '新增提醒',
            iconCls: 'btn_clock',
            action: 'addRemind'
        });
        this.addQuoteButton = Ext.create('Ext.Button', {
            text: '新增报价',
            iconCls: 'btn_add',
            action: 'addQuote',
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

        this.bbar = [this.addServiceLogButton, this.addQuoteButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    }
});