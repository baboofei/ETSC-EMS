Ext.define('EIM.view.product.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.product_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '新增/修改产品',
    layout: 'fit',
    width: 560,
    height: 260,
    maximizable: true,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'container',
                layout: 'anchor',
                items: [
                    {
                        xtype: 'tabpanel',
                        border: 0,
                        anchor: '100%',
                        items: [
                            {
                                xtype: 'product_info_tab'
                            },
                            {
                                xtype: 'product_price_tab',
                                id: 'tab_product_price_tab',
                                allowPrivilege: true
                            },
                            {
                                xtype: 'product_description_tab',
                                id: 'tab_product_description_tab',
                                allowPrivilege: true
                            }
                        ]
                    }
                ]
            }
//            {
//                xtype: 'form',
//                bodyPadding: 4,
//                layout: 'anchor',
//                fieldDefaults: EIM_field_defaults,
//                defaults: {
//                    xtype: 'container',
//                    layout: 'hbox',
//                    padding: '0 0 5',
//                    defaults: {
//                        xtype: 'textfield'
//                    }
//                },
//                items: [
//                    {
//                        xtype: 'hidden',
//                        hidden: true,
//                        name: 'id',
//                        fieldLabel: 'id'
//                    },
//                    {
//                        items: [
//                            {
//                                name: 'name',
//                                fieldLabel: '名称'
//                            },
//                            {
//                                name: 'model',
//                                fieldLabel: '型号'
//                            }
//                        ]
//                    },
//                    {
//                        xtype: 'expandable_vendor_unit_combo',
//                        //                                name: 'producer_vendor_unit_name',
//                        //                                store: 'ComboVendorUnits',
//                        fieldLabel: '生产厂家',
//                        allowBlank: false
//                    },
//                    {
//                        xtype: 'expandable_vendor_unit_combo',
//                        //                                name: 'seller_vendor_unit_name',
//                        //                                store: 'ComboVendorUnits',
//                        fieldLabel: '销售厂家',
//                        allowBlank: false
//                    },
//                    {
//                        items: [
//                            {
//                                name: 'reference',
//                                fieldLabel: 'REF号',
//                                emptyText: '工厂给的reference号，没有就算了'
//                            },
//                            {
//                                name: 'user',
//                                fieldLabel: '负责人'
//                            }
//                        ]
//                    },
//                    {
//                        xtype: 'textfield',
//                        padding: '0 0 0',
//                        name: 'description',
//                        fieldLabel: '说明'
//                    },
//                    {
//                        xtype: 'textfield',
//                                                padding: '0 0 0',
//                        name: 'comment',
//                        fieldLabel: '备注'
//                    }
//                ]
//            }
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