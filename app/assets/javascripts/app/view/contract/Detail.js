//noinspection SpellCheckingInspection
Ext.define('EIM.view.contract.Detail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.contract_detail',

    title: '合同详情',
    bodyPadding: 4,
    //    frame: true,
    autoScroll: true,
    layout: 'border',

    items: [
        {
            xtype: 'tabpanel',
            region: 'center',
            items: [
                {
                    xtype: 'contract_content'
                },
                {
                    xtype: 'contract_item_grid'
                },
                {
                    xtype: 'collection_panel'
                },
                {
                    xtype: 'contract_history_grid'
                }
            ]
        },
        {
            xtype: 'form',
            title: '相关联系人',
            name: 'contract_info',
            region: 'west',
            width: 450,
            split: true,
            autoScroll: true,
            //        border: 0,
            padding: 0,
            layout: 'anchor',
            defaults: {anchor: '100%'},
            bodyPadding: 4,
            //        url: '',//这
            fieldDefaults: EIM_field_defaults,
            items: [
                {
                    xtype: 'fieldset',
                    title: '客户信息',
                    collapsible: true,
                    defaultType: 'textfield',
                    defaults: {anchor: '100%'},
                    layout: 'anchor',
                    items: [
                        {
                            xtype: 'expandable_customer_unit_combo',
                            name: 'customer_unit_id',
                            fieldLabel: '单位',
                            emptyText: '请输入并选择客户单位',
                            allowBlank: false,
                            hiddenPlus: true
                        },
                        {
                            xtype: 'expandable_customer_combo',
                            name: 'buyer_customer_id',
                            fieldLabel: '联系人',
                            emptyText: '请选择客户联系人(如采购)',
                            padding: '5 0',
                            allowBlank: false,
                            hiddenPlus: true
                        },
                        {
                            xtype: 'expandable_customer_combo',
                            name: 'end_user_customer_id',
                            fieldLabel: '使用人',
                            emptyText: '请选择客户最终使用人',
                            allowBlank: false,
                            hiddenPlus: true,
                            disabledPlus: true
                        },
                        {
                            xtype: 'container',
                            id: 'privilege_container_update_contract_customer_info',
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
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '商务相关单位信息',
                    collapsible: true,
                    defaultType: 'textfield',
                    defaults: {anchor: '100%'},
                    layout: 'anchor',
                    items: [
                        {
                            xtype: 'expandable_business_unit_combo',
                            name: 'business_unit_id',
                            fieldLabel: '公司名称',
                            emptyText: '请输入并选择商务相关单位',
                            allowBlank: true,
                            plusButtonId: 'privilege_button_contract_add_business_unit'
                        },
                        {
                            xtype: 'expandable_business_contact_combo',
                            name: 'business_contact_id',
                            fieldLabel: '联系人',
                            emptyText: '请选择商务相关联系人',
                            padding: '5 0',
                            allowBlank: true,
                            plusButtonId: 'privilege_button_contract_add_business_contact'
                        },
                        {
                            xtype: 'container',
                            id: 'privilege_container_update_contract_business_info',
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
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '卖方信息',
                    collapsible: true,
                    defaultType: 'textfield',
                    defaults: {anchor: '100%'},
                    layout: 'anchor',
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
                                proxy: 'memory'
                            }),
                            valueField: 'id',
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
                            displayField: 'name'
                        },
                        {
                            xtype: 'container',
                            id: 'privilege_container_update_contract_user_info',
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
                    ]
                }
            ]
        }
    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});