Ext.define('EIM.view.login.Form', {
    extend:'Ext.window.Window',
    alias:'widget.loginform',

    initComponent:function () {
        var me = this;

        Ext.apply(me, {
            autoShow:true,
            modal:false,
            closable:false,
            resizable:true,
            width:300,
            height:150,
            items:{
                xtype:'form',
                border:false,
                bodyPadding:10,
                defaultType:'textfield',
                items:[
                    {
                        name:'reg_name',
                        fieldLabel:'用户名 ',
                        allowBlank:false,
                        enableKeyEvents:true
                    },
                    {
                        name:'password',
                        fieldLabel:'密码',
                        inputType:'password',
                        allowBlank:false,
                        enableKeyEvents:true
                    }
                ],
                buttons:[
                    {
                        text:'登录',
                        id:'Login',
                        action:'login'/*,
                        formBind:true, //only enabled once the form is valid
                        disabled:true*/
                    }
                ]
            }
        });

        me.callParent();
    }
});
