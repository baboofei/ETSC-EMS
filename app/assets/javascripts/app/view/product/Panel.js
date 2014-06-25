Ext.define('EIM.view.product.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.product_panel',

    layout: 'border',
    items: [
        {
            xtype: 'product_grid',
            region: 'center',
            padding: "4 4 0 4",
            collapsible: true,
            split: true
        },
        {
            xtype: 'product_detail',
            height: 270,
            region: 'south',
            padding: "0 4 4 4",
            split: true
        }
    ],

    buttons: [
        {
            text: '保存为新产品',
            action: 'save_as',
            iconCls: 'btn_save_as'
        }
    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});