Ext.define('EIM.view.customer.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.customer_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '新增/修改客户',
    layout: 'fit',
    width: 500,
//    height: 396,
    maximizable: true,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                trackResetOnLoad: true,
                defaults: {
                    xtype: 'textfield'
                },
                items: [
                    {
                        xtype: 'hidden',
                        name: 'id',
                        hidden: true
                    },
                    {
                        xtype: 'hidden',
                        name: 'source_element_id',
                        hidden: true
                    },
                    {
                        xtype: 'expandable_customer_unit_combo',
                        fieldLabel: '客户单位',
                        padding: '0 0 5'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5',
                        defaults: {
                            xtype: 'textfield'
                        },
                        items: [
                            {
                                name: 'name',
                                fieldLabel: '姓名',
                                allowBlank: false
                            },
                            {
                                name: 'en_name',
                                fieldLabel: '英文名',
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        name: 'email',
                        fieldLabel: '电子邮件',
                        emptyText: '多个邮件地址用西文逗号“,”分开',
                        vtype: 'zemail'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5',
                        defaults: {
                            xtype: 'textfield'
                        },
                        items: [
                            {
                                name: 'mobile',
                                fieldLabel: '移动电话',
                                emptyText: '多个号码用西文逗号“,”分开'
                            },
                            {
                                name: 'phone',
                                fieldLabel: '固定电话',
                                emptyText: '多个号码用西文逗号“,”分开'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5',
                        defaults: {
                            xtype: 'textfield'
                        },
                        items: [
                            {
                                name: 'fax',
                                fieldLabel: '传真',
                                emptyText: '多个号码用西文逗号“,”分开'
                            },
                            {
                                name: 'im',
                                fieldLabel: 'QQ/MSN',
                                emptyText: '多个号码用西文逗号“,”分开'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5',
                        defaults: {
                            xtype: 'textfield'
                        },
                        items: [
                            {
                                name: 'department',
                                fieldLabel: '部门'
                            },
                            {
                                name: 'position',
                                fieldLabel: '职位'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5',
                        items: [
                            {
                                xtype: 'combo',
                                name: 'addr_combo',
                                fieldLabel: '通信地址',
                                flex: 2,
                                store: Ext.create('Ext.data.Store', {
                                    fields: [
                                        {name: 'name', type: 'string'},
                                        {name: 'address', type: 'string'}
                                    ]
                                }),
                                queryMode: 'local',
                                displayField: 'name',
                                editable: false,
                                valueField: 'address'
                            },
                            {
                                xtype: 'textfield',
                                name: 'addr',
                                fieldLabel: '',
                                flex: 3
                            }
                        ]
                    },
                    {
                        name: 'en_addr',
                        fieldLabel: '英文地址'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5',
                        defaults: {
                            xtype: 'textfield'
                        },
                        items: [
                            {
                                name: 'postcode',
                                fieldLabel: '邮编'
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: '结识方式',
                                name: 'lead_id',
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('lead', true).concat(Ext.ComponentQuery.query('functree')[0].recentExhibition),
                                    model: 'EIM.model.AllDict',
                                    proxy:  'memory'
                                }),
                                displayField: 'display',
                                valueField: 'value',
                                value: '1',
                                triggerAction: 'all',
                                editable: false,
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        xtype: 'boxselect',
                        fieldLabel: '涉及应用',
//                        name: 'application_ids',
                        store: "dict.Applications",
                        queryMode: "local",
                        forceSelection: false,
                        createNewOnBlur: true,
                        createNewOnEnter: true,
                        //                value: [1, 3, 5],
                        //                delimiter: "|",
                        //                typeAhead: true,
                        displayField: 'description',
                        valueField: 'id',
                        height: 50,
                        emptyText: '可多选'
                    },
                    {
                        name: 'comment',
                        fieldLabel: '备注'
                    },
                    {
                        xtype: 'combo',
                        name: 'group_id',
                        store: 'ComboGroups',
                        fieldLabel: '项目组',
                        displayField: 'name',
                        valueField: 'id',
                        editable: false
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '保存',
                action: 'save'
            },
            {
                text: '取消',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});