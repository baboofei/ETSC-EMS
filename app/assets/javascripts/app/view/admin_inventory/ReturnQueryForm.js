/**
 * 装“待归还商品列表”（可点击入库）的表单
 */
Ext.define('EIM.view.admin_inventory.ReturnQueryForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_return_query_form',

    title: '待归还物品',
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
                        xtype: 'admin_inventory_return_query_grid',
                        height: 400
                    }
                ]
            }
        ];

//        this.buttons = [
//            {
//                text: '确定',
//                action: 'save'
//            },
//            {
//                text: '取消',
//                scope: this,
//                handler: this.close
//            }
//        ];

        this.callParent(arguments);
    }
});