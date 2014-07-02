Ext.define('EIM.view.contract.Content', {
    extend: 'Ext.form.Panel',
    alias: 'widget.contract_content',

    title: '合同内容',
    bodyPadding: 4,
    autoScroll: true,
    layout: 'anchor',
    fieldDefaults: EIM_field_defaults,

    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            padding: '0 0 5',
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
                    name: 'number',
                    fieldLabel: '东隆合同号',
                    disabled: true
                },
                {
                    name: 'quote>number',
                    fieldLabel: '报价编号',
                    disabled: true
                },
                {
                    name: 'customer_number',
                    fieldLabel: '客户合同号'
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
                    name: 'summary',
                    fieldLabel: '合同摘要'
                },
                {
                    xtype: 'combo',
                    name: 'requirement_id',
                    fieldLabel: '供求类别',
                    store: Ext.create('Ext.data.Store', {
                        data: filter_all_dict('requirement_sort'),
                        model: 'EIM.model.AllDict',
                        proxy:  'memory'
                    }),
                    valueField: 'value',
                    displayField: 'display',
                    editable: false
                },
                {
                    xtype: 'combo',
                    name: 'contract_type',
                    fieldLabel: '合同类别',
                    store: Ext.create('Ext.data.Store', {
                        data: filter_all_dict('contract_type'),
                        model: 'EIM.model.AllDict',
                        proxy:  'memory'
                    }),
                    valueField: 'value',
                    displayField: 'display',
                    editable: false
                }
            ]
        },
        {
            xtype: 'container',
            layout: 'hbox',
            padding: '0 0 5',
            defaults: {
                xtype: 'numberfield'
            },
            items: [
                {
                    xtype: 'amount_with_currency',
                    name: 'sum',
                    fieldLabel: '合同金额',
                    storeHint: 4,
                    subFlex: '3|2',
                    flex: 1
                },
                {
                    name: 'exchange_rate',
                    fieldLabel: '当前汇率'
                },
                {
                    name: 'rmb',
                    hidden: true,
                    fieldLabel: '折合人民币'
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
        },
        {
            xtype: 'container',
            layout: 'hbox',
            padding: '0 0 5',
            defaults: {
                xtype: 'checkbox'
            },
            items: [
                {
                    name: 'does_need_install',
                    fieldLabel: '安装需求',
                    boxLabel: '是否需要安装？'
                },
                {
                    name: 'does_need_lc',
                    fieldLabel: '信用证情况',
                    boxLabel: '是否需要信用证？'
                },
                {
                    name: 'lc_number',
                    xtype: 'textfield',
                    fieldLabel: '信用证编号'
                }
            ]
        },
        {
            xtype: 'expandable_pay_mode_combo',
            plusButtonId: 'privilege_button_contract_add_pay_mode'
        },
        {
            xtype: 'displayfield',
            fieldLabel: '付款方式格式',
            labelWidth: 100,
            value:'签合同后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，发货前#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，发货后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，验收后#[天|周|月]内付[##%|USD###]([电汇|信用证])<br><span style="color: gray;">#表示数字，中括号表示选择支。<br>时间节点可搭配不同时间值多次使用。<br>如采用百分比方式，则总百分比应为100%。</span>'
        },
        {
            xtype: 'textfield',
            fieldLabel: '备注',
            name: 'comment'
        },
        {
            xtype: 'container',
            id: 'privilege_container_update_contract_content_info',
            allowPrivilege: true,
            layout: 'hbox',
            padding: '5 0 0',
            items: [
                {
                    xtype: 'displayfield',
                    flex: 1
                },
                {
                    xtype: 'button',
                    text: '确认修改'
                }
            ]
        }
    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});