/**
 * 装“待出库商品列表”（可点击出库）的表单
 */
Ext.define('EIM.view.admin_inventory.OutStockQueryForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_out_stock_query_form',

    title: '待出库物品',
    layout: 'fit',
    width: 800,
    border: 0,
    modal: true,
    maximizable: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'hidden',
                name: 'out_stock_type'
            },
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'admin_inventory_out_stock_query_grid',
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