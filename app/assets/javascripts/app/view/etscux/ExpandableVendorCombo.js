/**
 * 自定义的组件，包含一个供应商联系人的combo框以及一个“+”按钮
 */

Ext.define('EIM.view.etscux.ExpandableVendorCombo', {
    extend: 'Ext.container.Container',
    alias: 'widget.expandable_vendor_combo',

    initComponent: function() {
        Ext.tip.QuickTipManager.init();

        this.layout = 'hbox';

        this.items = [{
            xtype: 'combo',
            fieldLabel: (this.fieldLabel || '供方联系人'),
            name: 'vendor_id',
            store: 'ComboVendors',
            flex: 1,
            displayField: 'name',
            valueField: 'id',
            emptyText: '请选择供方联系人',
            allowBlank: false,
            hideTrigger: true,
//            editable: false,
            mode: 'remote',
            minChars: 1,
//            forceSelection: true,
            triggerAction: 'query',
            validator: function(){
                if(this.getValue() === this.getRawValue()) {
                    return "请实际选择一个联系人！";
                } else {
                    this.clearInvalid();
                    return true;
                }
            }
        }, {
            xtype: 'button',
            fieldLabel: '',
            labelWidth: 0,
            text: '+',
            action: 'add_vendor',
            tooltip: '新增联系人',
            hidden:(this.hiddenPlus || false),
            disabled:(this.disabledPlus || false)
        }];

        this.callParent(arguments);
    }
});