Ext.define('EIM.view.flow_sheet.Info', {
    extend: 'Ext.form.Panel',
    alias: 'widget.flow_sheet_info',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '水单信息',
    bodyPadding: 4,
    //    frame: true,
    autoScroll: true,
    layout: 'anchor',
    fieldDefaults: EIM_field_defaults,

    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            padding: '4 0 0 0',
            items: [
                {
                    xtype: 'combo',
                    name: 'flow_sheet_type',
                    fieldLabel: '类别',
                    store: Ext.create('Ext.data.Store', {
                        data: filter_all_dict('flow_sheet_type', false),
                        model: 'EIM.model.AllDict',
                        proxy: 'memory'
                    }),
                    displayField: 'display',
                    valueField: 'value',
                    triggerAction: 'all',
                    editable: false,
                    emptyText: '请选择类别',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '服务单号',
                    name: 'number',
                    disabled: true
                },
                {
                    xtype: 'textfield',
                    name: 'contract_number',
                    fieldLabel: '维修合同号'
                }
            ]
        },
        {
            xtype: 'container',
            layout: 'hbox',
            padding: '4 0 0 0',
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: '描述',
                    name: 'description',
                    allowBlank: false
                },
                {
                    xtype: 'combo',
                    name: 'priority',
                    fieldLabel: '优先级',
                    store: Ext.create('Ext.data.Store', {
                        data: filter_all_dict('sales_priority',false),
                        model: 'EIM.model.AllDict',
                        proxy: 'memory'
                    }),
                    displayField: 'display',
                    valueField: 'value',
                    triggerAction: 'all',
                    editable: false,
                    value: "1",
                    emptyText: '请选择优先级',
                    allowBlank: false
                },
                {
                    xtype: 'combo',
                    name: 'deal_requirement',
                    fieldLabel: '处理要求',
                    store: Ext.create('Ext.data.Store', {
                        data: filter_all_dict('flow_sheet_deal_requirement',false),
                        model: 'EIM.model.AllDict',
                        proxy: 'memory'
                    }),
                    displayField: 'display',
                    valueField: 'value',
                    triggerAction: 'all',
                    editable: false,
                    value: "1",
                    emptyText: '请选择处理要求',
                    allowBlank: false
                }
            ]
        },
        {
            xtype: 'container',
            layout: 'hbox',
            padding: '4 0 0 0',
            items: [
                {
                    xtype: 'combo',
                    name: 'deliver_by',
                    fieldLabel: '发货依据',
                    store: Ext.create('Ext.data.Store', {
                        data: filter_all_dict('flow_sheet_deliver_by',false),
                        model: 'EIM.model.AllDict',
                        proxy: 'memory'
                    }),
                    displayField: 'display',
                    valueField: 'value',
                    triggerAction: 'all',
                    editable: false,
                    value: "1",
                    emptyText: '请选择发货依据',
                    allowBlank: false,
                    flex: 1
                },
                {
                    xtype: 'textfield',
                    name: 'comment',
                    fieldLabel: '备注',
                    flex: 2
                }
            ]
        },
        {
            xtype: 'container',
//            id: 'privilege_container_update_flow_sheet_info',
            layout: 'hbox',
            padding: '5 0 0',
            items: [
                {
                    xtype: 'displayfield',
                    flex: 1
                },
                {
                    xtype: 'button',
//                    id: 'privilege_button_update_flow_sheet_info',
//                    allowPrivilege: true,
                    text: '确认修改',
                    action: 'submitFlowSheetInfo',
                    disabled: true
                }
            ]
        }


    ],

    initComponent: function() {
        this.callParent(arguments);
    }
});