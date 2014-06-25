/**
 * 自定义的组件，包含一个商务相关联系人的combo框以及一个“+”按钮
 */

Ext.define('EIM.view.etscux.ExpandableBusinessContactCombo', {
    extend: 'Ext.container.Container',
    alias: 'widget.expandable_business_contact_combo',

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
                    this.fieldLabel || '联系人'
                    ),
                name: 'business_contact_id',
                store: 'BusinessContacts',
                flex: 1,
                displayField: 'name',
                valueField: 'id',
                emptyText: '请选择商务相关联系人',
                allowBlank: (
                    this.allowBlank || false
                    ), //false,
                editable: false,
                //            mode: 'remote',
                triggerAction: 'all'
            },
            {
                xtype: 'button',
                fieldLabel: '',
                labelWidth: 0,
                text: '+',
                id: (
                    this.plusButtonId || ''
                    ),
                action: 'add_business_contact',
                tooltip: '新增商务相关联系人',
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