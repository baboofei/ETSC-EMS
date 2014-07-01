/**
 * 装“申请入库商品列表”的表单
 */
Ext.define('EIM.view.admin_inventory.ForStockForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_for_stock_form',

    title: '申请入库',
    layout: 'fit',
    width: 600,
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
                        xtype: 'admin_inventory_for_stock_grid',
                        height: 400
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定',
                action: 'save'
            },
            {
                text: '取消',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});