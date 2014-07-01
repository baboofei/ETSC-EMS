Ext.define('EIM.view.flow_sheet.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.flow_sheet_form',

    title: '新增水单',
    layout: 'fit',
    width: 600,
    modal: true,

    initComponent: function() {
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
                        padding: '5 0',
                        items: [
                            {
                                xtype: 'expandable_customer_unit_combo',
                                name: 'customer_unit_id',
                                fieldLabel: '客户单位',
                                flex: 1
                            },
                            {
                                xtype: 'expandable_customer_combo',
                                name: 'customer_id',
                                fieldLabel: '客户',
                                flex: 1
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5 0',
                        items: [
                            {
                                xtype: 'combo',
                                name: 'flow_sheet_type',
                                fieldLabel: '类别',
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('flow_sheet_type', false),
                                    model: 'EIM.model.AllDict',
                                    proxy: 'memory'
                                }),
                                displayField: 'display',
                                valueField: 'value',
                                triggerAction: 'all',
                                editable: false,
                                emptyText: '请选择类别',
                                allowBlank: false
                            },
                            {
                                xtype: 'textfield',
                                name: 'description',
                                fieldLabel: '描述',
                                emptyText: '请输入便于记忆的维修水单描述',
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5 0',
                        items: [
                            {
                                xtype: 'combo',
                                name: 'priority',
                                fieldLabel: '优先级',
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('sales_priority',false),
                                    model: 'EIM.model.AllDict',
                                    proxy: 'memory'
                                }),
                                value: '1',
                                displayField: 'display',
                                valueField: 'value',
                                triggerAction: 'all',
                                editable: false,
                                allowBlank: false
                            },
                            {
                                xtype: 'combo',
                                name: 'deal_requirement',
                                fieldLabel: '处理要求',
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('flow_sheet_deal_requirement',false),
                                    model: 'EIM.model.AllDict',
                                    proxy: 'memory'
                                }),
                                displayField: 'display',
                                valueField: 'value',
                                triggerAction: 'all',
                                editable: false,
                                value: "1",
                                emptyText: '请选择处理要求',
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5 0',
                        items: [
                            {
                                xtype: 'combo',
                                name: 'deliver_by',
                                fieldLabel: '发货依据',
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('flow_sheet_deliver_by',false),
                                    model: 'EIM.model.AllDict',
                                    proxy: 'memory'
                                }),
                                displayField: 'display',
                                valueField: 'value',
                                triggerAction: 'all',
                                editable: false,
                                value: "1",
                                emptyText: '请选择发货依据',
                                allowBlank: false
                            },
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                name: 'created_at',
                                value: new Date(),
                                fieldLabel: '发生日期'
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        name: 'comment',
                        fieldLabel: '备注'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '保存',
                //            formBind: true,
                //            disabled: true,
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