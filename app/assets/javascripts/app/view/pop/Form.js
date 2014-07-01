Ext.define('EIM.view.pop.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.pop_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '新增/修改公共联系人',
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
                        xtype: 'expandable_pop_unit_combo',
                        fieldLabel: '公共单位',
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
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5',
                        defaults: {
                            xtype: 'textfield'
                        },
                        items: [
                            {
                                name: 'postcode',
                                fieldLabel: '邮编',
                                flex: 2
                            },
                            {
                                name: 'comment',
                                fieldLabel: '备注',
                                flex: 3
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