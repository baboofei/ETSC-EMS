/**
 * 自定义的组件，包含一个VIP联系人的combo框以及一个“+”按钮
 */

Ext.define('EIM.view.etscux.ExpandableVipCombo', {
    extend: 'Ext.container.Container',
    alias: 'widget.expandable_vip_combo',

    initComponent: function() {
        Ext.tip.QuickTipManager.init();

        this.layout = 'hbox';

        this.items = [{
            xtype: 'combo',
            fieldLabel: (this.fieldLabel || '供方联系人'),
            name: 'vip_id',
            store: 'ComboVips',
            flex: 1,
            displayField: 'name',
            valueField: 'id',
            emptyText: '请选择供方联系人',
            allowBlank: false,
            editable: false,
            forceSelection: true,
            triggerAction: 'all'
        }, {
            xtype: 'button',
            fieldLabel: '',
            labelWidth: 0,
            text: '+',
            action: 'add_vip',
            tooltip: '新增联系人',
            hidden:(this.hiddenPlus || false),
            disabled:(this.disabledPlus || false)
        }];

        this.callParent(arguments);
    }
});