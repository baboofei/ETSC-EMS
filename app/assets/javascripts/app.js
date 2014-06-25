///**
// *= require_self
// */
//
//// Set valid ExtJS loading path (/vendor/assets/extjs4/src)
//Ext.Loader.setPath('Ext', '/assets/extjs4/src');
//
//// create a new instance of Application class
//Ext.application({
//  // the global namespace
//  name: 'AM',
//
//  appFolder: '/assets/app',
//
//  controllers: ['Users'],
//
//  autoCreateViewport: true
//});
//以上是User Grid的模型代码

//以下是登录用的User模型代码

var islogin;
var userName, userId, unreadReminds;
var globeFilter;
var wrong_time = 0;
Ext.Loader.setConfig({enabled:true});
Ext.Loader.setPath({
    "Ext": "/assets/extjs4/src",
    "Ext.ux": "/assets/ux",
    'Extensible': '/assets/extensible-1.5.2/src'
});
Ext.Ajax.request({
    url:'/login/verify',
    success: function(response){
        var text = Ext.decode(response.responseText);
//        console.log(text);
        if(text["success"]){
            islogin = true;
            userName = text["user_name"];
            userId = text["user"];
            unreadReminds = text["unread_reminds"];
//            Ext.example.msg("", userName);
        }else{
            islogin = false;
            userName = "";
            userId = "";
        }
    }
});

Ext.application({
    name: 'EIM',
 
    appFolder: 'assets/app',  /* this appears to NOT be a relative path */

    controllers: ['Login'],//,'Users'],//这里可以不加载，后面用var c = me.application.getController('Users');c.init();来实现
    
    launch: function() {
//        console.log("xx");
        Ext.create('Ext.Panel', {
//            layout: 'fit',
            renderTo: Ext.getBody(),
            border: 0,
            items: [
//                {
//                    xtype:'loginform'
//                },
//                {
//                    xtype:'user_grid'
//                }
            ]
        });
    }
//    autoCreateViewport: true
});