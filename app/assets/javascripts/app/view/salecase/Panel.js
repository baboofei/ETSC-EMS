Ext.define('EIM.view.salecase.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.salecase_panel',
    //    autoRender: true,

    layout: 'border',
    items: [
        {
            xtype: 'salecase_detail',
            region: 'center',
            padding: '0 4 4 4'
            //        frame: true,
            //        fieldDefaults: {
            //            labelAlign: 'right'
            //        }
        },
        {
            xtype: 'salecase_grid',
            height: 300,
            minHeight: 200,
            maxHeight: 400,
            region: 'north',
            padding: "4 4 0 4",
            //        border: 0,
            collapsible: true,
            split: true
        }
    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});