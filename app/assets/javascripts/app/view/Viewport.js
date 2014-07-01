Ext.define('EIM.view.Viewport', {
    extend:'Ext.container.Viewport',

    // layout: 'fit',

//  items: [{
//    xtype: 'user_grid',
//    title: 'Users',
//    html : 'List of users will go here'
//  },{
//  	xtype: 'user_grid',
//  	title: '中文用户',
//  	width: 300
//  }]
    items:[
        {
            xtype:'loginform'
        },
        {
            xtype:'logindisplay'
        }
    ]
});
