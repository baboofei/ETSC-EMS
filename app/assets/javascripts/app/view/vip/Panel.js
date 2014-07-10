Ext.define('EIM.view.vip.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.vip_panel',

    layout: 'border',
    padding: 4,
    items: [
        {
            xtype: 'vip_grid',
            name: 'source_grid',
            region: 'north',
            title: 'VIP联系人列表',
            flex: 2,
            split: true,
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'sourceGridVips',
                    dropGroup: 'targetGridVips'
                },
                getRowClass: function(record, index, rowParams) {
                    if(!record.get('editable')) {
                        return 'shared'
                    }
                }
            },
            displayPaging: true,
            bbar: [
                {
                    xtype: 'button',
                    text: '新增VIP联系人',
                    iconCls: 'btn_add',
                    action: 'addVip'
                }
            ]
        },
        {
            xtype: 'vip_grid',
            name: 'target_grid',
            region: 'center',
            store: 'EmptyGridVips',
            title: '待操作VIP联系人',
            flex: 1,
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'sourceGridVips',
                    dropGroup: 'sourceGridVips'
                }
            },
            displayPaging: true,
            bbar: [
                {
                    xtype: 'button',
                    text: '删除',
                    iconCls: 'btn_delete',
                    action: 'deleteSelection',
                    disabled: true
                },
                {
                    xtype: 'hidden',
                    hidden: true,
                    name: 'vip_ids'
                },
                {
                    xtype: 'popup_express_grid_button',
                    disabled: true
                }
            ]
        }
    ]
});