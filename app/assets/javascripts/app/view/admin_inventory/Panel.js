Ext.define('EIM.view.admin_inventory.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.admin_inventory_panel',

    layout: 'border',
    padding: 4,
    items: [
        {
            xtype: 'admin_inventory_grid',
            name: 'source_grid',
            region: 'center',
            flex: 2,
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'sourceGridAdminInventories',
                    dropGroup: 'targetGridAdminInventories'
                }/*,
                copy: true*/
            },
            displayPaging: true,
            bbar: [
                {
                    id: 'privilege_button_buy_in',
                    text: '申请入库',
                    iconCls: 'btn_buy',
                    action: 'buy',
                    allowPrivilege: true
                },
                {
                    id: 'privilege_button_show_history_inventory',
                    text: '查看操作记录',
                    action: 'show_history',
                    allowPrivilege: true
                },
                {
                    id: 'privilege_button_export_excel_inventory',
                    text: '导出Excel',
                    action: 'export_excel',
                    allowPrivilege: true
                },
                '-',
                {
                    id: 'privilege_button_damage',
                    text: '报损',
                    action: 'damage',
                    iconCls: 'btn_damage',
                    allowPrivilege: true,
                    tempDisabled: true
                },
                {
                    id: 'privilege_button_scrap',
                    text: '报废',
                    action: 'scrap',
                    iconCls: 'btn_scrap',
                    allowPrivilege: true,
                    tempDisabled: true
                },
                {
                    id: 'privilege_button_fix',
                    text: '修好',
                    action: 'fix',
                    iconCls: 'btn_ok',
                    allowPrivilege: true,
                    tempDisabled: true
                },
                {
                    id: 'privilege_button_charge',
                    text: '充抵',
                    action: 'charge',
                    allowPrivilege: true,
                    tempDisabled: true
                },
                {
                    id: 'privilege_button_exchange_unit',
                    text: '单位换算',
                    action: 'exchange_unit',
                    iconCls: 'btn_calculate',
                    allowPrivilege: true,
                    tempDisabled: true
                },
                {
                    text: '修改',
                    id: 'privilege_button_modify',
                    action: 'modify',
                    iconCls: 'btn_edit',
                    allowPrivilege: true,
                    tempDisabled: true
                },
                {
                    text: '变更存放地点',
                    id: 'privilege_button_change_location',
                    action: 'change_location',
                    iconCls: 'btn_change_location',
                    allowPrivilege: true,
                    tempDisabled: true
                },
                {
                    text: '变更所有权',
                    id: 'privilege_button_change_ownership',
                    action: 'change_ownership',
                    iconCls: 'btn_change_owner',
                    allowPrivilege: true,
                    tempDisabled: true
                }
            ]
        },
//        {
//            xtype: 'panel',
//            region: 'east',
//            title: '操作历史',
//            collapsed: true,
//            collapsible: true,
//            width: 0,
//            hidden: true
//        },
        {
            xtype: 'admin_inventory_grid',
            name: 'target_grid',
            title: '待处理物品',
            store: 'GridCopyAdminInventories',
            region: 'south',
            flex: 1,
            split: true,
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'sourceGridAdminInventories',
                    dropGroup: 'sourceGridAdminInventories'
//                },
//                listeners: {
//                    beforedrop: function(e) {
//                        console.log(e);
//                    }
                }
            },
            displayPaging: true,
            bbar: [
                {
                    text: '删除',
                    iconCls: 'btn_delete',
                    action: 'deleteSelection',
                    disabled: true
                },
                '-',
                {
                    xtype: 'hidden',
                    hidden: true,
                    name: 'admin_inventory_ids'
                },
                {
                    text: '申请领用',
                    id: 'privilege_button_apply_for_use',
//                    iconCls: 'btn_buy',
                    action: 'apply_for_use',
                    tempDisabled: true,
                    allowPrivilege: true
                },
                {
                    text: '申请租借',
                    id: 'privilege_button_apply_for_loan',
//                    iconCls: 'btn_buy',
                    action: 'apply_for_loan',
                    tempDisabled: true,
                    allowPrivilege: true
                },
                {
                    text: '申请售出',
                    id: 'privilege_button_apply_for_sell',
//                    iconCls: 'btn_buy',
                    action: 'apply_for_sell',
                    tempDisabled: true,
                    allowPrivilege: true
                },
                {
                    text: '申请退货',
                    id: 'privilege_button_apply_for_reject',
                    action: 'apply_for_reject',
                    tempDisabled: true,
                    allowPrivilege: true
                },
                {
                    text: '归还',
                    id: 'privilege_button_return',
                    action: 'return',
                    tempDisabled: true,
                    allowPrivilege: true
                }
            ]
        }
    ]
});