Ext.define('EIM.view.salecase.Detail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.salecase_detail',

    title: '销售个案详情',
    bodyPadding: 4,
    //    frame: true,
    autoScroll: true,
    layout: 'border',

    items: [
        {
            xtype: 'salelog_grid',
            region: 'center'
        },
        {
            xtype: 'panel',
            region: 'west',
            width: 450,
            split: true,
            layout: 'border',
            border: 0,
            padding: 0,
            items: [
                {
                    xtype: 'form',
                    title: '个案信息',
                    id: 'salecase_info',
                    region: 'north',
                    split: true,
                    autoScroll: true,
                    //                id: 'add_salecase_form',
                    //            padding: '3 3 1 3',
                    height: 150,
                    bodyPadding: 4,
                    //                border: 0,
                    layout: 'form',
                    fieldDefaults: EIM_field_defaults,
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'feasible',
                                    allowBlank: false,
                                    fieldLabel: '成案率(%)',
                                    emptyText: '请估计此个案的成案率',
                                    minValue: 0,
                                    maxValue: 100
                                },
                                {
                                    xtype: 'combo',
                                    name: 'priority',
                                    fieldLabel: '优先级',
                                    store: Ext.create('Ext.data.Store', {
                                        data: filter_all_dict('sales_priority',false),
                                        model: 'EIM.model.AllDict',
                                        proxy: 'memory'
                                    }),
                                    displayField: 'display',
                                    valueField: 'value',
                                    triggerAction: 'all',
                                    editable: false,
                                    emptyText: '请选择优先级',
                                    allowBlank: false
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            name: 'comment',
                            allowBlank: false,
                            fieldLabel: '个案描述',
                            emptyText: '请输入对此个案的描述'
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
                    ],
                    buttons: [
                        {
                            text: '确定',
                            action: 'salecaseSubmit',
                            disabled: true
                        }
                    ]
                },
                {
                    xtype: 'tabpanel',
                    items: [
                        {
                            xtype: 'customer_mini_grid',
                            title: '客户列表'
                        },
                        {
                            xtype: 'business_contact_mini_grid',
                            title: '商务相关联系人列表'
                        }
                    ],
                    //            id: 'customer_grid',
                    region: 'center'/*,
                 store: 'Users'*/
                }
            ]
        }
    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});