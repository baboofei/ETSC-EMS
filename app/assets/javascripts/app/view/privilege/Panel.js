Ext.define('EIM.view.privilege.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.privilege_panel',

    layout: 'border',
    items: [
        {
            xtype: 'tabpanel',
            region: 'center',
            padding: 4,
            items: [
                {
                    xtype: 'privilege_function_grid'
                },
                {
                    xtype: 'privilege_element_grid'
                },
                {
                    xtype: 'privilege_data_grid'
                }
            ]
        }
    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});