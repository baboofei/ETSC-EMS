/**
 * 装“待审批商品列表”的表单
 */
Ext.define('EIM.view.admin_inventory.AuditingQueryForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_auditing_query_form',

    title: '待审批物品',
    layout: 'fit',
    width: 800,
    border: 0,
    modal: true,
    maximizable: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'admin_inventory_auditing_query_grid',
                        height: 400
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '审批通过',
                action: 'pass_auditing'
            },
            {
                text: '审批驳回',
                action: 'refuse_auditing'
            }
        ];

        this.callParent(arguments);
    }
});