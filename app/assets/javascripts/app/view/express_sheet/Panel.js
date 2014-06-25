Ext.define('EIM.view.express_sheet.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.express_sheet_panel',

    layout: 'border',
    padding: 4,
    items: [
        {
            xtype: 'express_sheet_search_grid',
            name: 'source_grid',
            region: 'north',
            title: '筛选客户',
            flex: 1,
            split: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'sourceExpressCustomers',
                    dropGroup: 'targetExpressCustomers'
                }
            },
            displayPaging: true
        },
        {
            xtype: 'container',
            region: 'center',
            layout: 'anchor',
            flex: 1,
            items: [
                {
                    xtype: 'express_sheet_search_grid',
                    name: 'target_grid',
                    store: '',
                    anchor: '100% -80',
                    title: '确认要寄',
                    viewConfig: {
                        plugins: {
                            ptype: 'gridviewdragdrop',
                            dragGroup: 'sourceExpressCustomers',
                            dropGroup: 'sourceExpressCustomers'
                        }
                    },
                    displayPaging: false,
                    bbar: [{
                        xtype: 'button',
                        text: '删除',
                        iconCls: 'btn_delete',
                        action: 'deleteSelection',
                        disabled: true
                    }]
                },
                {
                    xtype: 'form',
                    height: 80,
                    title: '选快递',
                    bodyPadding: 4,
                    fieldDefaults: EIM_field_defaults,
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'combo',
                                    fieldLabel: '快递公司',
                                    name: 'express_id',
                                    allowBlank: false,
                                    store: Ext.create('Ext.data.Store', {
                                        data: filter_all_dict('express', true),
                                        model: 'EIM.model.AllDict',
                                        proxy:  'memory'
                                    }),
                                    displayField: 'display',
                                    valueField: 'value',
                                    editable: false
                                },
                                {
                                    xtype: 'combo',
                                    fieldLabel: '发件公司',
                                    name: 'our_company_id',
                                    allowBlank: false,
                                    editable: false,
                                    store: 'ComboOurCompanies',
                                    valueField: 'id',
                                    displayField: 'name'
                                },
                                {
                                    xtype: 'button',
                                    text: '确定',
                                    action: 'submit'
                                }
                            ]
                        },
                        {
                            xtype: 'displayfield',
                            value: '<p style="text-align: right;">注意：因不同快递公司的单据高度不同，所以如要批量打印(一次大于5张)时去找Terry手动更改打印机设置。</p>'
                        }
                    ]
                }
            ]
        }
    ]
});