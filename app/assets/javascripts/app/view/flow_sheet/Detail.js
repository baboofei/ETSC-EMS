Ext.define('EIM.view.flow_sheet.Detail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.flow_sheet_detail',

    title: '水单详情',
    bodyPadding: 4,
    //    frame: true,
    autoScroll: true,
    layout: 'border',

    items: [
        {
            xtype: 'tabpanel',
            region: 'center',
            items: [
                {
                    xtype: 'flow_sheet_info'
                },
                {
                    xtype: 'flow_sheet_received_equipment_grid'
                },
                {
                    xtype: 'flow_sheet_service_log_grid'
                },
                {
                    xtype: 'panel',
                    title: '服务总结'
                }
            ]
        },
        {
            xtype: 'customer_service_mini_grid',
            title: '联系人列表',
            region: 'west',
            width: 450,
            viewConfig: {enableTextSelection:true},
            split: true
        }
    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});


