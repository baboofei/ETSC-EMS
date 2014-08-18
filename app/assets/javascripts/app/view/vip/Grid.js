Ext.define('EIM.view.vip.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.vip_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: 'VIP联系人列表',
    store: 'GridVips',
    iconCls: 'ttl_grid',
    viewConfig: {enableTextSelection:true},

    initComponent: function() {
        var me = this;
        //“结识方式”的字典项，供表格中显示和表头筛选用
        var leadArray = filter_all_dict('lead', true).concat(Ext.ComponentQuery.query('functree')[0].recentExhibition);
        var leadFilterArray = filter_all_dict('lead', true).concat(Ext.ComponentQuery.query('functree')[0].allExhibition);
//        console.log(filter_all_dict('lead', true));
//        console.log(Ext.ComponentQuery.query('functree')[0].allExhibition);
        //“涉及应用”的伪字典项，供表格中显示和表头筛选用
        var applicationArray = filter_all_application();
        //“区域”的伪字典项，供表格中显示和表头筛选用
        var areaArray = filter_all_area();
        //“单位性质”的字典项，供表格中显示和表头筛选用
        var cuSortArray = filter_all_dict('unit_properties');
        //“所属用户”的伪字典项，供表格中显示和表头筛选用
        var userArray = filter_all_member();

        this.columns = [
            {
                header: '姓名',
                dataIndex: 'name',
                width: 75,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: 'VIP联系人单位',
                dataIndex: 'vip_unit>(name|unit_aliases>unit_alias|en_name)',
//                dataIndex: 'vip_unit>vip_unit_aliases>unit_alias',
                width: 150,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '单位别称',
                dataIndex: 'vip_unit>unit_aliases>unit_alias',
                width: 150,
                sortable: false,
                hidden: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '区域',
                dataIndex: 'vip_unit>city>prvc>area>id',
                width: 50,
                sortable: true,
                filter: {
                    type:'list',
                    phpMode:true,
                    options:Ext.Array.map(areaArray, function (record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('vip_unit>city>prvc>area>name');
                }
            },
            {
                header: '城市',
                dataIndex: 'vip_unit>city>name',
                width: 50,
                sortable: false,
                filter: {
                    type:'string'
                }
            },
            {
                header: '英文名',
                dataIndex: 'en_name',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '电子邮件',
                dataIndex: 'email',
                width: 100,
                sortable: true,
                filter: {
                    type: 'string'
                },
                renderer: function(value, metaData, record) {
                    var array = value.split(',');
                    var email = [];
                    Ext.Array.each(array, function(item) {
                        item = item.replace(/\s/, '');
                        var name = record.get('name');
                        email.push("<a href='mailto:" + name + "<" + item + ">'>" + item + "</a>");
                    });
                    return email.join(",");
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
                header: '固定电话',
                dataIndex: 'phone',
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
                header: '部门',
                dataIndex: 'department',
                width: 100,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '职位',
                dataIndex: 'position',
                width: 100,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '通信地址',
                dataIndex: 'addr',
                flex: 1,
                minWidth: 150,
                sortable: false,
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
                header: '结识时间',
                dataIndex: 'created_at',
                width: 100,
                sortable: true,
                renderer: Ext.util.Format.dateRenderer("Y-m-d"),
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                }
            },
            {
                header: '创建人',
                dataIndex: 'user_id',
                width: 100,
                hidden: true,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options:  Ext.Array.map(userArray, function(record) {
                        return [record["id"], record["name"]];
                    })
                },
                renderer: function(value, metaData, record) {
                    return record.get('user_name');
                }
            },
            {
                header: '备注',
                dataIndex: 'comment',
                width: 100,
                sortable: false,
                filter: {
                    type: 'string'
                }
            }
        ];

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

//a1 = VipUnit.where("vip_units.name like '%天%'").pluck :id
//a2 = VipUnitAlias.where("vip_unit_aliases.unit_alias like '%天%'").pluck :vip_unit_id
//a=(a1+a2).uniq
//question = a.map{"?"}.join(",")
//Vip.where("vip_units.id in (#{question})", *a).includes(:vip_unit)