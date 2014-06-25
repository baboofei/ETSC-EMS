/**
 * 自定义的组件，包含一个产品的combo框以及一个“+”按钮
 * 点击“+”按钮只弹出一个小型的form，供销售快速填写
 */

Ext.define('EIM.view.etscux.ExpandableProductCombo', {
    extend: 'Ext.container.Container',
    alias: 'widget.expandable_product_combo',

    initComponent: function() {
        Ext.tip.QuickTipManager.init();

        this.layout = 'hbox';

        this.items = [
            {
                xtype: 'combo',
                fieldLabel: (
                    this.fieldLabel || '产品'
                    ),
                name: 'product_id',
                store: 'Products',
                flex: 1,
                displayField: 'model',
                valueField: 'id',
                emptyText: '请选择产品',
                hideTrigger: true, //伪成输入框
                allowBlank: false,
                //            editable: false,
                mode: 'remote',
                minChars: 1,
                triggerAction: 'query',
                validator: function(){
                    if(this.getValue() === this.getRawValue()) {
                        return "请实际选择一个产品！";
                    } else {
                        this.clearInvalid();
                        return true;
                    }
                }
            },
            {
                xtype: 'button',
                fieldLabel: '',
                labelWidth: 0,
                text: '+',
                action: 'add_product',
                tooltip: '新增产品'
            }
        ];

        this.callParent(arguments);
    }
});