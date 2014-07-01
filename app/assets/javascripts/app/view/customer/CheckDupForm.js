Ext.define('EIM.view.customer.CheckDupForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.customer_check_dup_form',

    title: '客户详情',
    layout: 'border',
    width: 818,
    height: 600,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'customer_check_dup_sub_form',
                name: 'in',
                title: '客户信息(转入)',
                padding: '4 0 4 4',
                bodyPadding: '0 4 0 0',
                flex: 1,
                region: 'west'
            },
            {
                xtype: 'panel',
                padding: '4 4 4 4',
                width: 20,
                flex: 0.2,
                region: 'center',
                border: 0,
                layout: 'fit',
                items: [
                    {
                        xtype: 'button',
                        text: '>>>',
                        tooltip: '全部更新'
                    }
                ]
            },
            {
                xtype: 'customer_check_dup_sub_form',
                name: 'out',
                title: '客户信息(可能)',
                padding: '4 4 4 0',
                bodyPadding: '0 4 0 0',
                flex: 1,
                region: 'east'
            },
            {
                xtype: 'hidden',
                name: 'inquire_type',
                hidden: true
            },
            {
                xtype: 'hidden',
                name: 'inquire_id',
                hidden: true
            },
            {
                xtype: 'container',
                padding: '0 4 4 4',
//                height: 176,
                items: [
                    {
                        xtype: 'panel',
                        height: 70,
                        layout: 'form',
                        bodyPadding: '0 4 0 0',
                        items: [
                            {
                                xtype: 'textarea',
                                name: 'detail',
                                fieldLabel: '详情(会写入工作日志)',
                                labelWidth: 80,
                                labelAlign: 'right',
                                labelSeparator: '：'
                            }
                        ]
                    },
                    {
                        xtype: 'customer_possible_grid',
                        padding: '4 0 0 0',
                        title: '可能客户列表',
                        height: 146
                    }
                ],
                region: 'south'
            }
        ];

        this.buttons = [
            {
                text: '覆盖',
                action: 'override',
                disabled: true
            },
            {
                text: '新增',
                action: 'create'
            },
            {
                text: '再转让',
                action: 're_transfer'
            },
            {
                text: '非目标',
                action: 'obsolete'
            },
            {
                text: '取消',
                handler: function() {
                    this.up('window').close();
                }
            }
        ];

        this.callParent(arguments);
    }
});