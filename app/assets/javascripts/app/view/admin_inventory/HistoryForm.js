/**
 * 装“操作历史列表”的表单
 */
Ext.define('EIM.view.admin_inventory.HistoryForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_history_form',

    title: '操作历史列表',
    layout: 'fit',
    width: 800,
    border: 0,
    modal: true,
    maximizable: true,

    initComponent: function() {
        this.items = [
            {
//                xtype: 'hidden',
//                name: 'out_stock_type'
//            },
//            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'admin_inventory_history_grid',
                        height: 400
                    }
                ]
            }
        ];
//
//        this.buttons = [
//            {
//                text: '审批通过',
//                action: 'pass_auditing'
//            },
//            {
//                text: '审批驳回',
//                action: 'refuse_auditing'
//            }
//        ];

        this.callParent(arguments);
    }
});