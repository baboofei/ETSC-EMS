Ext.define('EIM.view.user.PasswordForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.password_form',

    title: '修改密码',
    layout: 'fit',
    width: 300,
    height: 150,
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
                        fieldLabel: 'id',
                        hidden: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'old_password',
                        fieldLabel: '旧密码',
                        inputType: 'password',
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        name: 'new_password',
                        fieldLabel: '新密码',
                        inputType: 'password',
                        allowBlank: false,
                        minLength: 6
                    },
                    {
                        xtype: 'textfield',
                        name: 'confirm_password',
                        fieldLabel: '确认新密码',
                        inputType: 'password',
                        allowBlank: false,
                        minLength: 6
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定',
                action: 'submitPassword'
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

