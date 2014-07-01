Ext.define('EIM.view.pay_mode.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.pay_mode_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '新增付款方式',
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
                        xtype: 'hidden',
                        name: 'source_element_id',
                        hidden: true
                    },
                    {
                        name: 'name',
                        xtype: 'combo',
                        fieldLabel: '付款方式',
                        store: 'PayModes',
                        flex: 1,
                        mode: 'remote',
                        vtype: 'pay_mode',
                        valueField: 'id',
                        displayField: 'name',
                        emptyText: '格式：签合同后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，发货前#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，发货后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，验收后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])',
                        triggerAction: 'query',
                        minChars: 1,
                        hideTrigger: true,
                        allowBlank: false
                    },
                    {
                        xtype:'displayfield',
                        fieldLabel:'付款方式格式',
                        labelWidth:100,
                        value:'签合同后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，发货前#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，发货后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，验收后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])<br><span style="color: gray;">#表示数字，中括号表示选择支。<br>时间节点可搭配不同时间值多次使用。<br>如采用百分比方式，则总百分比应为100%。</span>'
                    },
                    {
                        name: 'credit_level',
                        xtype: 'combo',
                        fieldLabel: '信用等级',
                        allowBlank: false,
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            data: filter_all_dict('credit_level'),
                            model: 'EIM.model.AllDict',
                            proxy:  'memory'
                        }),
                        valueField: 'value',
                        displayField: 'display',
                        value: '3'
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