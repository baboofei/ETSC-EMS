Ext.define('EIM.view.login.Display', {
    extend:'Ext.grid.Panel',
    alias:'widget.logindisplay',

    title:'Users',

    initComponent:function () {
        this.store = 'Users';

        this.columns = [
            {header:'username', dataIndex:'reg_name', flex:1},
            {header:'authenticated', dataIndex:'name', flex:1}
        ];

        this.callParent(arguments);
    }
});