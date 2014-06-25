Ext.define('EIM.view.salelog.RecommendItemForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.recommend_item_form',

    title: '新增/修改推荐项目',
    layout: 'anchor',
    width: 400,
    height: 200,
    modal: true,
    autoShow: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                border: 0,
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'hidden',
                        name: 'id'
                    },
                    {
                        xtype: 'expandable_vendor_unit_combo',
                        fieldLabel: '工厂',
                        //                name: 'vendor_unit_id',
//                        store: 'VendorUnits',
                        displayField: 'name',
                        valueField: 'id',
                        emptyText: '请输入产品的生产厂家',
                        hideTrigger: true, //伪成输入框
                        mode: 'remote',
                        minChars: 1,
                        triggerAction: 'query'
                    },
                    {
                        xtype: 'checkbox',
                        fieldLabel: '仅推荐工厂'
                    },
                    {
                        xtype: 'expandable_product_combo',
                        fieldLabel: '产品',
                        padding: '0 0 5',
                        store: 'Products',
                        displayField: 'model',
                        valueField: 'id',
                        emptyText: '请输入产品型号/名称/参数/reference号',
                        hideTrigger: true, //伪成输入框
                        mode: 'remote',
                        minChars: 1,
                        triggerAction: 'query'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '中文简述',
                        name: 'simple_description_cn',
                        disabled: true
                        //            }, {
                        //                xtype: 'textfield',
                        //                fieldLabel: '指标',
                        //                name: 'parameter',
                        //                disabled: true
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '客户需求',
                        name: 'customer_requirement'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定',
                action: 'save'
                //        }, {
                //            text: '新增',
                //            action: 'create'
            },
            {
                text: '确定',
                action: 'update',
                hidden: true
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