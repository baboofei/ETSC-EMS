Ext.define('EIM.view.m_inquire.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.m_inquire_form',

    title: '新增/修改客户',
    layout: 'fit',
    width: 500,
    modal: true,
    //    autoShow: true,

    initComponent: function() {
        var userArray = filter_all_user();
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'hidden',
                        name: 'id',
                        hidden: true
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
                                fieldLabel: '姓名'
                            },
                            {
                                name: 'en_name',
                                fieldLabel: '英文名'
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        name: 'customer_unit_name',
                        fieldLabel: '客户单位'
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
                                fieldLabel: '移动电话'
                            },
                            {
                                name: 'phone',
                                fieldLabel: '固定电话'
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
                                fieldLabel: '传真'
                            },
                            {
                                name: 'im',
                                fieldLabel: 'QQ/MSN'
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
                        xtype: 'textfield',
                        name: 'addr',
                        fieldLabel: '地址'
                    },
                    {
                        xtype: 'textfield',
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
                                name: 'email',
                                fieldLabel: '电子邮件'
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
                                xtype: 'combo',
                                name: 'm_lead_id',
                                fieldLabel: '结识方式',
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('lead', true).concat(Ext.ComponentQuery.query('functree')[0].recentExhibition),
                                    model: 'EIM.model.AllDict',
                                    proxy:  'memory'
                                }),
                                displayField: 'display',
                                valueField: 'value',
                                value: "3",
                                triggerAction: 'all',
                                editable: false,
                                allowBlank: false
                            },
                            {
                                xtype: 'combo',
                                name: 'transfer_to',
                                fieldLabel: '转让给',
                                store: Ext.create('Ext.data.Store', {
                                    data: userArray,
                                    model: 'EIM.model.ComboUser',
                                    proxy: 'memory'
                                }),
                                displayField: 'name',
                                valueField: 'id',
                                value: 13,
                                editable: false,
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5',
                        items: [
                            {
                                xtype: 'textarea',
                                name: 'detail',
                                fieldLabel: '详情',
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5',
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'comment',
                                fieldLabel: '备注'
                            }
                        ]
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

