/**
 * 自定义的组件，包含一个工厂的提示combo框以及一个“+”按钮
 * 点击“+”按钮只弹出一个小型的form，供销售快速填写
 */

Ext.define('EIM.view.etscux.ExpandableVendorUnitCombo', {
    extend: 'Ext.container.Container',
    alias: 'widget.expandable_vendor_unit_combo',

    initComponent: function() {
        Ext.tip.QuickTipManager.init();

        this.layout = 'hbox';

        var me = this;

        this.items = [
            {
                xtype: 'combo',
                fieldLabel: (this.fieldLabel || '生产厂家'),
                name: 'vendor_unit_id',
                store: Ext.create('Ext.data.Store', {
                    model: 'EIM.model.VendorUnit',
                    proxy: {
                        url: 'vendor_units/get_combo_vendor_units/list.json',
                        type: 'ajax',
                        format: 'json',
                        method: 'GET',
                        reader: {
                            root: 'vendor_units',
                            successProperty: 'success',
                            totalProperty: 'totalRecords'
                        }
                    }
                }),
                flex: 1,
                displayField: 'name',
                valueField: 'id',
                emptyText: (this.emptyText || '请输入并选择生产厂家'),
                hideTrigger: true, //伪成输入框
                allowBlank: false,
//                forceSelection: true,
                mode: 'remote',
                minChars: 1,
                triggerAction: 'query',
                validator: function(){
                    if(this.getValue() === this.getRawValue()) {
                        return "请实际选择一个生产厂家！";
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
                action: 'add_vendor_unit',
                tooltip: '新增生产厂家。提示不出来说明没有，加一个吧'
            }
        ]

        this.callParent(arguments);
    },
    isValid: function() {
        if(this.hidden) {
            return true;
        } else {
            return this.items.items[0].isValid();
        }
    }
});