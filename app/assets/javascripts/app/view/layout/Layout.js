Ext.define('EIM.view.layout.Layout', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.eim_layout',
    //    autoRender: true,
    //    renderTo: Ext.getBody(),

    layout: 'border',
    disabled: true,
    items: [
        {
            title: '东隆科技内部系统',
            region: 'north',
            layout: 'hbox',
            height: 50,
            xtype: 'panel',
            items: [
                {
                    xtype: 'displayfield',
                    value: "欢迎登录，" + userName + "。"
                },
                {
                    xtype: 'button',
                    text: '修改密码',
                    action: 'changePassword'
                },
                {
                    xtype: 'button',
                    text: '注销',
                    action: 'logout'
                }
            ]
        },
        {
            region: 'west',
            margins: '2 0 2 2',
            collapsible: true,
            split: true,
            xtype: 'functree'
        },
        {
            region: 'center',
            id: 'center',
            xtype: 'tabpanel',
            margins: '2 2 2 0',
            //        autoDestroy: false,
            //        layout: 'fit',
            items: [
                {
                    title: '首页',
                    id: 'Foo-tab',
                    xtype: 'panel',
                    fitToFrame: true,
                    html: '<iframe id="frame1" src="/login/login.html" frameborder="0" width="100%" height="100%"></iframe>',
                    bodyPadding: '20'
                    //                        xtype:'user_grid'
                    //                },
                    //                {
                    //                    title:'标题二',
                    //                    id:'Bar-tab',
                    //                    tabConfig:{
                    //                        title:'啥东东',
                    //                        tooltip:'提示'
                    //                    },
                    //                    xtype:'functree'
                }
            ]
        }
    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});