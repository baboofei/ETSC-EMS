Ext.define('EIM.view.business_contact.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.business_contact_form',

    requires: [
//        'Ext.ux.form.field.BoxSelect'
    ],

    title: '新增/修改商务相关联系人',
    layout: 'fit',
    width: 500,
//    height: 262,
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
                        fieldLabel: 'id'
                    },
                    {
                        xtype: 'hidden',
                        name: 'source_element_id',
                        hidden: true
                    },
                    {
                        xtype: 'expandable_business_unit_combo',
//                        name: 'business_unit_id',
                        fieldLabel: '商务相关单位',
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
                                fieldLabel: '英文名'
                            }
                        ]
                    },
                    {
                        name: 'email',
                        fieldLabel: '电子邮件',
                        emptyText: '多个邮件地址用西文逗号“,”分开'
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
                                name: 'addr',
                                fieldLabel: '通信地址'
                            },
                            {
                                name: 'postcode',
                                fieldLabel: '邮编'
                            }
                        ]
                    },
                    {
                        name: 'en_addr',
                        fieldLabel: '英文地址'
                    },
                    {
                        name: 'comment',
                        fieldLabel: '备注'
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