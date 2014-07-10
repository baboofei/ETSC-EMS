Ext.define('EIM.view.customer.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.customer_panel',

    layout: 'border',
    padding: 4,
    items: [
        {
            xtype: 'customer_grid',
            name: 'source_grid',
            region: 'north',
            title: '客户列表',
            flex: 2,
            split: true,
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'sourceGridCustomers',
                    dropGroup: 'targetGridCustomers'
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
                    text: '新增客户',
                    iconCls: 'btn_add',
                    action: 'addCustomer'
                },
                {
                    xtype: 'button',
                    text: '共享客户',
                    iconCls: 'btn_share',
                    action: 'shareCustomer',
                    disabled: true
                },
                {
                    xtype: 'button',
                    text: '转让客户',
                    iconCls: 'btn_transfer',
                    action: 'transferCustomer',
                    disabled: true
                }
            ]
        },
        {
            xtype: 'customer_grid',
            name: 'target_grid',
            region: 'center',
            store: 'EmptyGridCustomers',
            title: '待操作客户',
            flex: 1,
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'sourceGridCustomers',
                    dropGroup: 'sourceGridCustomers'
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
                    name: 'customer_ids'
                },
                {
                    xtype: 'popup_express_grid_button'
//                },
//                {
//                    xtype: 'button',
//                    text: '发送推广邮件',
//                    iconCls: 'btn_mail',
//                    action: 'mailPromotion',
//                    disabled: true
                }
            ]
        }
    ]
});