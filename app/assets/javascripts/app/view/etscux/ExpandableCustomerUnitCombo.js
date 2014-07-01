/**
 * 自定义的组件，包含一个客户单位的提示combo框以及一个“+”按钮
 */

Ext.define('EIM.view.etscux.ExpandableCustomerUnitCombo', {
    extend: 'Ext.container.Container',
    alias: 'widget.expandable_customer_unit_combo',

    initComponent: function() {
        Ext.tip.QuickTipManager.init();

        this.layout = 'hbox';

        var me = this;

        this.items = [{
            xtype: 'combo',
            fieldLabel: (this.fieldLabel || '客户单位'),
            name: 'customer_unit_id',
            store: 'CustomerUnits',
            flex: 1,
            displayField: 'name',
            valueField: 'id',
            emptyText: '请输入并选择客户单位',
            hideTrigger: true,//伪成输入框
            allowBlank: false,
            mode: 'remote',
            minChars: 1,
            triggerAction: 'query'
        }, {
            xtype: 'button',
            fieldLabel: '',
            labelWidth: 0,
            text: '+',
            action: 'add_customer_unit',
            tooltip: '新增客户单位。提示不出来说明没有，加一个吧',
            hidden:(this.hiddenPlus || false),
            disabled:(this.disabledPlus || false)
        }]

        this.callParent(arguments);
    }
});