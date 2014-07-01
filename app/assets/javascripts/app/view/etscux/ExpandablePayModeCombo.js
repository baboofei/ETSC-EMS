/**
 * 自定义的组件，包含一个选付款方式的combo框以及一个“+”按钮
 * 点击“+”按钮弹出输入付款方式的form
 */

Ext.define('EIM.view.etscux.ExpandablePayModeCombo', {
    extend: 'Ext.container.Container',
    alias: 'widget.expandable_pay_mode_combo',

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

        this.items = [
            {
                xtype: 'combo',
                fieldLabel: (
                    this.fieldLabel || '付款方式'
                    ),
                name: 'pay_mode_id',
                store: 'PayModes',
                flex: 1,
                mode: 'remote',
                vtype: 'pay_mode',
                valueField: 'id',
                displayField: 'name',
                emptyText: '格式：签合同后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，发货前#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，发货后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])，验收后#[天|周|月]内付[##%|USD###]([电汇|信用证|现金])',
                triggerAction: 'query',
                minChars: 1,
                hideTrigger: true,
                allowBlank: false,
                validator: function() {
                    if(this.getValue() === this.getRawValue()) {
                        return "请实际选择一种付款方式！";
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
                action: 'add_pay_mode',
                tooltip: '新增付款方式',
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