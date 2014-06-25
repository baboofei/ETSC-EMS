Ext.define('EIM.view.contract.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.contract_form',

    title: '合同信息',
    layout: 'fit',
    width: 750,
    modal: true,
    maximizable: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                defaults: {
                    xtype: 'container',
                    layout: 'hbox',
                    padding: '0 0 5',
                    defaults: {
                        xtype: 'textfield'
                    }
                },
                items: [
                    {
                        xtype: 'hidden',
                        name: 'id',
                        hidden: true
                    },
                    {
                        xtype: 'hidden',
                        name: 'quote_id',
                        hidden: true
                    },
                    {
                        items: [
                            {
                                fieldLabel: '合同摘要',
                                name: 'summary',
                                flex: 2
                            },
                            {
                                fieldLabel: '客户合同号',
                                name: 'customer_number',
                                flex: 1
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype:'expandable_customer_unit_combo',
                                emptyText:'请输入并选择客户单位',
                                flex: 1,
                                allowBlank: false
                            },
                            {
                                fieldLabel: '客户联系人',
                                xtype: 'expandable_customer_combo',
                                name: 'buyer_customer_name',
                                emptyText:'请选择客户联系人(如采购)',
                                flex: 1,
                                allowBlank: false
                            },
                            {
                                fieldLabel: '客户使用人',
                                xtype: 'expandable_customer_combo',
                                name: 'end_user_customer_name',
                                emptyText: '请选择客户最终使用人',
                                flex: 1,
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'expandable_business_unit_combo',
                                emptyText: '请输入并选择商务相关单位',
                                flex: 2,
                                allowBlank: true
                            },
                            {
                                xtype: 'expandable_business_contact_combo',
                                emptyText: '请选择商务相关联系人',
                                flex: 1,
                                allowBlank:true
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'combo',
                                fieldLabel: '卖方公司',
                                name: 'our_company_id',
                                allowBlank: false,
                                editable: false,
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_our_company(),
                                    model: 'EIM.model.dict.OurCompany',
                                    proxy:  'memory'
                                }),
                                valueField: 'id',
                                flex: 2,
                                displayField: 'name'
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: '工程师',
                                name: 'signer_user_id',
                                allowBlank: false,
                                editable: false,
                                store: 'ComboQuoteSales',
                                triggerAction: 'all',
                                valueField: 'id',
                                flex: 1,
                                displayField: 'name'
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'combo',
                                name: 'requirement_id',
                                fieldLabel: '供求类别',
                                allowBlank: false,
                                editable: false,
                                flex: 1,
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('requirement_sort'),
                                    model: 'EIM.model.AllDict',
                                    proxy:  'memory'
                                }),
                                valueField: 'value',
                                displayField: 'display',
                                value: '1'
                            },
                            {
                                xtype: 'combo',
                                name: 'contract_type',
                                fieldLabel: '合同类别',
                                allowBlank: false,
                                editable: false,
                                flex: 1,
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('contract_type'),
                                    model: 'EIM.model.AllDict',
                                    proxy:  'memory'
                                }),
                                valueField: 'value',
                                displayField: 'display',
                                value: '1'
                            },
                            {
                                xtype: 'amount_with_currency',
                                name: 'sum',
                                fieldLabel: '合同金额',
                                storeHint: 4,
                                subFlex: '3|2',
                                flex: 1
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                xtype: 'checkbox',
                                fieldLabel: '安装需求',
                                name: 'does_need_install',
                                boxLabel: '是否需要安装？'
                            },
                            {
                                xtype: 'checkbox',
                                fieldLabel: '信用证需求',
                                name: 'does_need_lc',
                                boxLabel: '是否需要信用证？'
                            },
                            {
                                fieldLabel: '信用证编号',
                                name: 'lc_number'
                            }
                        ]
                    },
                    {
                        xtype: 'expandable_pay_mode_combo'
                    },
                    {
                        xtype:'displayfield',
                        fieldLabel:'付款方式格式',
                        labelWidth:100,
                        value:'签合同后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，发货前#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，发货后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，验收后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])<br><span style="color: gray;">#表示数字，中括号表示选择支。<br>时间节点可搭配不同时间值多次使用。<br>如采用百分比方式，则总百分比应为100%。</span>'
                    },
                    {
                        xtype:'textfield',
                        fieldLabel:'备注',
                        name:'comment'
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