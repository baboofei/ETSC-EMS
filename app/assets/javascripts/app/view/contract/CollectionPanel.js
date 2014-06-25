Ext.define('EIM.view.contract.CollectionPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.collection_panel',

    title: '收款信息',
    bodyPadding: 4,
    autoScroll: true,
    layout: 'anchor',
    fieldDefaults: EIM_field_defaults,

    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'numberfield',
                    fieldLabel: '利润(RMB)',
                    name: 'profit',
                    emptyText: '请输入此合同的利润'
                },
                {
                    xtype: 'combo',
                    name: 'invoice',
                    fieldLabel: '开票状态',
                    store: Ext.create('Ext.data.Store', {
                        data: filter_all_dict('invoice'),
                        model: 'EIM.model.AllDict',
                        proxy:  'memory'
                    }),
                    valueField: 'value',
                    displayField: 'display',
                    editable: false
                },
                {
                    xtype: 'datefield',
                    name: 'invoiced_at',
                    fieldLabel: '开票时间',
                    format: 'Y-m-d'
                },
                {
                    xtype: 'button',
                    id: 'privilege_button_contract_change_financial_info',
                    allowPrivilege: true,
                    text: '确认修改'
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '已收款',
                    items: [
                        {
                            xtype: 'progressbar',
                            name: 'total_collection',
                            hideLabel: true,
                            id: 'total_collection'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            layout: 'border',
            border: 0,
            padding: '5 0 0',
            anchor: '100% -23',
            items: [
                {
                    xtype: 'contract_receivable_grid',
                    autoScroll: true,
                    flex: 1,
                    padding: '0 2 0 0',
                    region: 'center'
                },
                {
                    xtype: 'contract_collection_grid',
                    autoScroll: true,
                    flex: 1,
                    padding: '0 0 0 2',
                    region: 'east'
                }
            ]
        }
    ]
});