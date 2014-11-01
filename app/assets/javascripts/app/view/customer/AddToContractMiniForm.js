/**
 * 用于添加客户联系人到“联系人列表”里的小型表单
 * 有“选择客户单位”、“+”和“选择客户”、“+”的组件
 * 还有“移动电话”、“固定电话”和“传真”的显示，但不可以修改
 */
Ext.define('EIM.view.customer.AddToContractMiniForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.customer_add_to_contract_mini_form',

    title: '添加客户联系人',
    layout: 'fit',
    width: 300,
//    height: 230,
    border: 0,
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
                        xtype: 'expandable_customer_unit_combo'
                    },
                    {
                        xtype: 'expandable_customer_combo',
                        padding: '5 0'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '移动电话',
                        name: 'mobile',
                        disabled: true
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '固定电话',
                        name: 'phone',
                        disabled: true
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '传真',
                        name: 'fax',
                        disabled: true
//                    },
//                    {
//                        xtype: 'datefield',
//                        name: 'contact_at',
//                        format: 'Y-m-d',
//                        fieldLabel: '联系日期',
//                        emptyText: '请选择此条日志实际发生的日期(比如事后填写的情况)',
//                        value: new Date(),
//                        allowBlank: false
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '添加',
                action: 'add_to'
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