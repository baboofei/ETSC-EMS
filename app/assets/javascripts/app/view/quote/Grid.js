Ext.define('EIM.view.quote.Grid', {
    extend:'Ext.grid.Panel',
    alias:'widget.quote_grid',

    requires:'Ext.ux.grid.FiltersFeature',

    title: '报价列表',
    store: 'Quotes',
    iconCls: 'ttl_grid',
    viewConfig: {
        getRowClass: function(record, index, rowParams) {
            if(!record.get('editable')) {
                return 'shared'
            }
        }
    },

    initComponent:function () {
        var me = this;
        
        //“所属用户”的伪字典项，供表格中表头筛选用
        var userArray = filter_all_member_sale();
        //“商务”的伪字典项，供表格中表头筛选用
        var businessArray = filter_all_business();
        //“币种”的伪字典项，供表格中显示和表头筛选用
        var currencyArray = filter_currency(5);
        //“报价类别”的字典项，供表格中显示和表头筛选用
        var quoteTypeArray = filter_all_dict('quote_type');

        this.columns = [
            {
                header: '个案编号',
                dataIndex: '^quotable>(salecase|flow_sheet)>(number)',
//                dataIndex: 'salelog>salecase>number',
                width: 75,
                sortable: true,
                filter: {
                    type:'string'
                }
            },
            {
                header: '报价编号',
                dataIndex: 'number',
                width: 75,
                sortable: true,
                filter:{
                    type:'string'
                }
            },
            {
                header: '报价类别',
                dataIndex: 'quote_type',
                width: 75,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(quoteTypeArray, function (record) {
                        return [record["value"], record["display"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    var name;
                    Ext.Array.each(quoteTypeArray, function(item, index, allItems) {
                        if(item['value'] === record.get('quote_type')) {
                            name = item['display'];
                        }
                    });
                    return name;
                }
            },
            {
                header: '最后处理人',
                dataIndex: 'business>id',
                width: 70,
                sortable: true,
                renderer: function(value, metaData, record) {
                    return record.get('business>name');
                },
                filter: {
                    type:'list',
                    phpMode:true,
                    options: Ext.Array.map(businessArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                }
            },
            {
                header: '报价日期',
                dataIndex: 'created_at',
                width: 90,
                sortable: true,
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                },
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '报价摘要',
                dataIndex: 'summary',
                flex: 1,
                minWidth: 150,
                sortable: true,
                filter:{
                    type:'string'
                }
            },
            {
                header:'币种',
                dataIndex:'currency_id',
                width:50,
                sortable:true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options:  Ext.Array.map(currencyArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('currency_name');
                }
            },
            {
                header:'金额',
                dataIndex:'total',
                width:50,
                sortable:true,
                filter: {
                    type: 'numeric'
                }
            },
            {
                header: '负责工程师',
//                dataIndex: 'sale>id',
                dataIndex: 'sale>id',
                width: 50,
                sortable: true,
                renderer: function(value, metaData, record) {
                    return record.get('sale>name');
                },
                filter: {
                    type:'list',
                    phpMode:true,
                    options:  Ext.Array.map(userArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                }
            },
            {
                header: '客户单位',
                dataIndex: 'customer_unit>(name|unit_aliases>unit_alias|en_name)',
                width: 150,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '客户',
                dataIndex: 'customer>(name|en_name)',
                width: 50,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                xtype: 'actioncolumn',
                width: 50,
                renderer: function(value, metaData, record) {
                    var str = "";
                    //        #预处理    pre_quote       [写字]
                    //        #待处理    progressing     [沙漏]
                    //        #商务检查  checking        [下载箭头加时钟]
                    //        #可下载    downloadable    [下载箭头]
                    //        #需改动    need_change     [问号]+[下载箭头]
                    //        #完成      complete        [对勾]+[下载箭头]
                    if(record.get('state') === "pre_quote") {
                        str += "<p class='act_pre_quote' title='销售填写中'></p>";
                    }else if(record.get('state') === "progressing") {
                        str += "<p class='act_progressing' title='待处理'></p>";
                    }else if(record.get('state') === "checking") {
                        str += "<a href='/application/download/quotes/" + record.get('number') + ".pdf' target='_blank'><p class='act_checking' title='商务检查中'></p></a>";
                    }else{
                        str += "<a href='/application/download/quotes/" + record.get('number') + ".pdf' target='_blank'><p class='act_download' title='下载'></p></a>";
                        switch(record.get('state')) {
                            case "need_change":
                                str += "<p class='act_question' title='需改动'></p>";
                                break;
                            case "complete":
                                str += "<p class='act_done' title='已完成'></p>";
                                break;
                        }
                    }
                    return str;
                }
            }
        ];

        this.addQuoteButton = Ext.create('Ext.Button', {
            text:'新增报价',
            iconCls:'btn_add',
            action:'addQuote'
        });
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

        this.bbar = [this.addQuoteButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem:function () {
        return this.getSelectionModel().getSelection()[0];
    }
});