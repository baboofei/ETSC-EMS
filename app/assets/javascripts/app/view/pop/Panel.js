Ext.define('EIM.view.pop.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pop_panel',

    layout: 'border',
    padding: 4,
    items: [
        {
            xtype: 'pop_grid',
            name: 'source_grid',
            region: 'north',
            title: '公共联系人列表',
            flex: 2,
            split: true,
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'sourceGridPops',
                    dropGroup: 'targetGridPops'
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
                    text: '新增公共联系人',
                    iconCls: 'btn_add',
                    action: 'addPop'
                }
            ]
        },
        {
            xtype: 'pop_grid',
            name: 'target_grid',
            region: 'center',
            store: 'EmptyGridPops',
            title: '待操作公共联系人',
            flex: 1,
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'sourceGridPops',
                    dropGroup: 'sourceGridPops'
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
                    name: 'pop_ids'
                },
                {
                    xtype: 'pop_express_grid_button',
                    disabled: true
                }
            ]
        }
    ]
});