Ext.define('EIM.view.business_contact.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.business_contact_panel',

    layout: 'border',
    padding: 4,
    items: [
        {
            xtype: 'business_contact_grid',
            name: 'source_grid',
            region: 'north',
            title: '商务相关联系人列表',
            flex: 2,
            split: true,
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'sourceGridBusinessContacts',
                    dropGroup: 'targetGridBusinessContacts'
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
                    text: '新增商务相关联系人',
                    iconCls: 'btn_add',
                    action: 'addBusinessContact'
//                },
//                {
//                    xtype: 'button',
//                    text: '共享商务相关联系人',
//                    iconCls: 'btn_share',
//                    action: 'shareBusinessContact',
//                    disabled: true
//                },
//                {
//                    xtype: 'button',
//                    text: '转让商务相关联系人',
//                    iconCls: 'btn_transfer',
//                    action: 'transferBusinessContact',
//                    disabled: true
                }
            ]
        },
        {
            xtype: 'business_contact_grid',
            name: 'target_grid',
            region: 'center',
            store: 'EmptyGridBusinessContacts',
            title: '待操作商务相关联系人',
            flex: 1,
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'sourceGridBusinessContacts',
                    dropGroup: 'sourceGridBusinessContacts'
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
                    name: 'business_contact_ids'
                },
                {
                    xtype: 'pop_express_grid_button'
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