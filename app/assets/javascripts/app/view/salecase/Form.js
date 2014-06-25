Ext.define('EIM.view.salecase.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.salecase_form',

    title: '新增个案',
    layout: 'fit',
    width: 300,
//    height: 240,
    modal: true,
    //    autoShow: true,

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
                        xtype: 'expandable_customer_unit_combo',
                        name: 'customer_unit_id',
                        fieldLabel: '客户单位',
                        listeners: {
                        }
                    },
                    {
                        xtype: 'expandable_customer_combo',
                        name: 'customer_id',
                        padding: '5 0',
                        fieldLabel: '客户'
                    },
                    {
                        xtype: 'textfield',
                        name: 'comment',
                        fieldLabel: '个案描述',
                        emptyText: '请输入便于记忆的个案描述',
                        allowBlank: false
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
                        value: '1',
                        displayField: 'display',
                        valueField: 'value',
                        triggerAction: 'all',
                        editable: false,
                        allowBlank: false
                    },
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
                        xtype: 'datefield',
                        name: 'start_at',
                        allowBlank: false,
                        format: 'Y-m-d',
                        value: new Date(),//Ext.Date.add(new Date(), Ext.Date.DAY, 15),
                        fieldLabel: '起始日期',
                        emptyText: '请选择此个案实际发生的日期(比如事后填写的情况)'
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