Ext.define('EIM.view.info.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.info_panel',

    layout: 'border',
    items: [
        {
            xtype: 'tabpanel',
            region: 'center',
            padding: 4,
            items: [
                {
                    xtype: 'info_bank_info_grid'
                },
                {
                    xtype: 'real_exchange_rate_grid'
                },
                {
                    xtype: 'panel'
                }
            ]
        }
    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});