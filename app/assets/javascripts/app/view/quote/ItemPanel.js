Ext.define('EIM.view.quote.ItemPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.quote_item_panel',

    title: '报价项目',
    bodyPadding: 4,
    autoScroll: true,
    layout: 'border',
    fieldDefaults: EIM_field_defaults,

    items: [
        {
            xtype: 'container',
            layout: 'anchor',
            region: 'center',
            items: [
                {
                    xtype: 'quote_item_tree',
                    anchor: '100% -170'
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    padding: '4 0',
                    items: [
                        {
                            xtype: 'quote_item_fee',
                            flex: 1,
                            padding: '0 4 0 0'
                        },{
                            xtype: 'quote_item_foot',
                            width: 300,
                            height: 166
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'quote_item_config',
            region: 'east',
            width: 250,
            split: true,
            collapsed: true,
            collapsible: true
        }
    ],

    initComponent:function () {
        this.callParent(arguments);
    }
});