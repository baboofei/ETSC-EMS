Ext.define('EIM.view.user.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.user_form',

    title: '新增/修改用户',
    layout: 'fit',
    modal: true,
    //    autoShow: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
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
                        name: 'name',
                        fieldLabel: '姓名',
                        allowBlank: false
                    },
                    {
                        name: 'en_name',
                        fieldLabel: '英文名',
                        allowBlank: false
                    },
                    {
                        name: 'reg_name',
                        fieldLabel: '登录名',
                        allowBlank: false
                    },
                    {
                        name: 'mobile',
                        fieldLabel: '手机号'
                    },
                    {
                        name: 'extension',
                        fieldLabel: '分机号'
                    },
                    {
                        name: 'etsc_email',
                        fieldLabel: '公司邮箱'
                    },
                    {
                        name: 'email',
                        fieldLabel: '私人邮箱'
                    },
                    {
                        name: 'qq',
                        fieldLabel: 'QQ'
                    },
                    {
                        name: 'msn',
                        fieldLabel: 'MSN'
                    },
                    {
                        xtype: 'combo',
                        name: 'sex',
                        fieldLabel: '性别',
                        value: 1,
                        store: [[1, "男"], [2, "女"]]
                    },
                    {
                        name: 'department_name',
                        fieldLabel: '部门'
                    },
                    {
                        name: 'position',
                        fieldLabel: '职位'
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

