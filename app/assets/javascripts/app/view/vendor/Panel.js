Ext.define('EIM.view.vendor.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.vendor_panel',

    layout: 'border',
    padding: 4,
    items: [
        {
            xtype: 'vendor_grid',
            name: 'source_grid',
            region: 'north',
            title: '供应商列表',
            flex: 2,
            split: true,
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'sourceGridVendors',
                    dropGroup: 'targetGridVendors'
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
                    text: '新增供应商',
                    iconCls: 'btn_add',
                    action: 'addVendor'
//                },
//                {
//                    xtype: 'button',
//                    text: '共享供应商',
//                    iconCls: 'btn_share',
//                    action: 'shareCustomer',
//                    disabled: true
//                },
//                {
//                    xtype: 'button',
//                    text: '转让供应商',
//                    iconCls: 'btn_transfer',
//                    action: 'transferCustomer',
//                    disabled: true
                }
            ]
        },
        {
            xtype: 'vendor_grid',
            name: 'target_grid',
            region: 'center',
            store: 'EmptyGridVendors',
            title: '待操作供应商',
            flex: 1,
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'sourceGridVendors',
                    dropGroup: 'sourceGridVendors'
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
                    name: 'vendor_ids'
                },
                {
                    xtype: 'pop_express_grid_button'/*,
                    disabled: true*/
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