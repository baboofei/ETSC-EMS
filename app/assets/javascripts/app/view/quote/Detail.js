Ext.define('EIM.view.quote.Detail', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.quote_detail',

    items: [
        {
            xtype: 'quote_info',
            disabled: true
        },
        {
            xtype: 'quote_item_panel',
            disabled: true
        },
        {
            xtype: 'quote_term',
            disabled: true
        }
    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});