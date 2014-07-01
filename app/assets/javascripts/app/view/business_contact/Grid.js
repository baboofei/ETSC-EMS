Ext.define('EIM.view.business_contact.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.business_contact_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title: '商务相关联系人列表',
    store: 'GridBusinessContacts',
    iconCls: 'ttl_grid',

    initComponent: function() {
        var me = this;
//        console.log(filter_all_dict('lead', true));
//        console.log(Ext.ComponentQuery.query('functree')[0].allExhibition);
        //“区域”的伪字典项，供表格中显示和表头筛选用
        var areaArray = filter_all_area();

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
                header: '商务相关单位',
                dataIndex: 'business_unit>(name|en_name|unit_aliases>unit_alias)',
//                dataIndex: 'business_unit>business_unit_aliases>unit_alias',
                width: 150,
                sortable: false,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '区域',
                dataIndex: 'business_unit>city>prvc>area>id',
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
                    return record.get('business_unit>city>prvc>area>name');
                }
            },
            {
                header: '城市',
                dataIndex: 'business_unit>city>name',
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
                header: '英文地址',
                dataIndex: 'en_addr',
                flex: 1,
                minWidth: 150,
                sortable: true,
                filter: {
                    type: 'string'
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

//a1 = BusinessContactUnit.where("business_units.name like '%天%'").pluck :id
//a2 = BusinessContactUnitAlias.where("business_unit_aliases.unit_alias like '%天%'").pluck :business_unit_id
//a=(a1+a2).uniq
//question = a.map{"?"}.join(",")
//BusinessContact.where("business_units.id in (#{question})", *a).includes(:business_unit)