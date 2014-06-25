/**
 * “申请领用”的表单
 */
Ext.define('EIM.view.admin_inventory.ApplyForUseForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_apply_for_use_form',

    title: '申请领用',
    layout: 'fit',
    width: 400,
//    height: 205,
    border: 0,
    modal: true,

    initComponent: function() {
        var userArray = filter_all_user();
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'column',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'fieldcontainer',
                        columnWidth: 0.5,
                        fieldLabel: '领用原因',
                        name: 'project',
                        defaultType: 'radiofield',
                        defaults: {
                            name: 'project_option',
                            height: 22
                        },
                        layout: 'vbox',
                        items: [
                            {
                                boxLabel: '办公',
                                inputValue: 'office',
                                checked: true
                            },
                            {
                                boxLabel: '送客户',
                                inputValue: 'customer'
                            },
                            {
                                boxLabel: '公司项目',
                                inputValue: 'project'
                            },
                            {
                                boxLabel: 'TSD',
                                inputValue: 'tsd'
                            },
                            {
                                boxLabel: '研发',
                                inputValue: 'development'
                            },
                            {
                                boxLabel: '展会',
                                inputValue: 'exhibition'
                            },
                            {
                                boxLabel: '其他',
                                inputValue: 'other'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        columnWidth: 0.5,
                        layout: 'vbox',
                        items: [
                            {
                                xtype: 'displayfield',
                                height: 22
                            },
                            {
                                xtype: 'displayfield',
                                height: 22
                            },
                            {
                                xtype: 'textfield',
                                name: 'project_number',
                                emptyText: '公司项目编号',
                                disabled: true
                            },
                            {
                                xtype: 'displayfield',
                                height: 22
                            },
                            {
                                xtype: 'displayfield',
                                height: 22
                            },
                            {
                                xtype: 'textfield',
                                name: 'exhibition_name',
                                emptyText: '____年__月__日____城市______展',
                                disabled: true
                            },
                            {
                                xtype: 'textfield',
                                name: 'other_detail',
                                emptyText: '详细事由',
                                disabled: true
                            }
                        ]
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定',
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