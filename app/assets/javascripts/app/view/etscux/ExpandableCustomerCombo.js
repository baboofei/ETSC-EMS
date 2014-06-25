/**
 * 自定义的组件，包含一个客户的combo框以及一个“+”按钮
 */

Ext.define('EIM.view.etscux.ExpandableCustomerCombo', {
    extend: 'Ext.container.Container',
    alias: 'widget.expandable_customer_combo',

    initComponent: function() {
        Ext.tip.QuickTipManager.init();

        this.layout = 'hbox';

        this.items = [{
            xtype: 'combo',
            fieldLabel: (this.fieldLabel || '客户'),
            name: 'customer_id',
            store: 'Customers',
            flex: 1,
            displayField: 'name',
            valueField: 'id',
            emptyText: '请选择客户',
            allowBlank: false,
            editable: false,
            forceSelection: true,
//            mode: 'remote',
            triggerAction: 'all'
        }, {
            xtype: 'button',
            fieldLabel: '',
            labelWidth: 0,
            text: '+',
            action: 'add_customer',
            tooltip: '新增客户',
            hidden:(this.hiddenPlus || false),
            disabled:(this.disabledPlus || false)
        }];

        this.callParent(arguments);
    }
});