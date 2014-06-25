/**
 * 自定义的组件，包含一个商务相关单位的提示combo框以及一个“+”按钮
 */

Ext.define('EIM.view.etscux.ExpandableBusinessUnitCombo', {
    extend: 'Ext.container.Container',
    alias: 'widget.expandable_business_unit_combo',

    initComponent: function() {
        Ext.tip.QuickTipManager.init();

        this.layout = 'hbox';
        var plusButtonHidden, plusButtonDisabled;
        if(this.plusButtonId) {
            //如果专门为它设置了这个参数，说明小加号按钮要有权限设置
            plusButtonHidden = Ext.ComponentQuery.query('functree')[0].allElement["elements"][this.plusButtonId]['hidden'];
            plusButtonDisabled = Ext.ComponentQuery.query('functree')[0].allElement["elements"][this.plusButtonId]['disabled'];
        } else {
            plusButtonHidden = false;
            plusButtonDisabled = false;
        }

        var me = this;

        this.items = [
            {
                xtype: 'combo',
                fieldLabel: (
                    this.fieldLabel || '商务相关单位'
                    ),
                name: 'business_unit_id',
                store: 'BusinessUnits',
                flex: 1,
                displayField: 'name',
                valueField: 'id',
                emptyText: '请输入并选择商务相关单位',
                hideTrigger: true, //伪成输入框
                allowBlank: (
                    this.allowBlank || false
                    ),
                mode: 'remote',
                minChars: 1,
                triggerAction: 'query'
            },
            {
                xtype: 'button',
                fieldLabel: '',
                labelWidth: 0,
                text: '+',
                id: (
                    this.plusButtonId || ''
                    ),
                action: 'add_business_unit',
                tooltip: '新增商务相关单位。提示不出来说明没有，加一个吧',
                hidden: (
                    this.hiddenPlus || plusButtonHidden
                    ),
                disabled: (
                    this.disabledPlus || plusButtonDisabled
                    )
            }
        ];

        this.callParent(arguments);
    }
});