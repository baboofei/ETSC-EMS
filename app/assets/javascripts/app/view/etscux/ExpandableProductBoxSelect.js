/**
 * 自定义的组件，包含一个多选产品的boxselect以及一个“+”按钮
 * 点击“+”按钮也弹出一个小型的form，供销售快速填写
 */

Ext.define('EIM.view.etscux.ExpandableProductBoxSelect', {
    extend: 'Ext.container.Container',
    alias: 'widget.expandable_product_box_select',

    requires: ['Ext.ux.form.field.BoxSelect'],

    initComponent: function() {
        Ext.tip.QuickTipManager.init();

        this.layout = 'hbox';

        this.items = [{
            xtype: 'boxselect',
            fieldLabel: (this.fieldLabel || '产品'),
            name: 'product_id',
            store: 'Products',
            flex: 1,
            displayField: 'model',
            valueField: 'id',
            emptyText: '请选择产品',
            allowBlank: false,
//            editable: false,
//            queryCaching: false,
            queryMode: 'remote',
            forceSelection: true,
            triggerAction: 'query',
            minChars: 1,
            height: 70
        }, {
            xtype: 'button',
            fieldLabel: '',
            labelWidth: 0,
            text: '+',
            action: 'add_product',
            tooltip: '新增产品'
        }];

        this.callParent(arguments);
    }
});