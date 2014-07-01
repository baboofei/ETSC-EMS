/**
 * 自定义的组件，包含一个选择物料编码的提示combo框以及一个“+”按钮
 * 点击“+”按钮弹出新增物料编码的form
 */

Ext.define('EIM.view.etscux.ExpandableMaterialCodeCombo', {
    extend: 'Ext.container.Container',
    alias: 'widget.expandable_material_code_combo',

    initComponent: function() {
        Ext.tip.QuickTipManager.init();

        this.layout = 'hbox';

        var me = this;

        this.items = [
            {
                xtype: 'combo',
                fieldLabel: (this.fieldLabel || '物料编码'),
//                name: 'material_code_id',
                name: 'inventory_type',
//                store: Ext.create('Ext.data.Store', {
//                    model: 'EIM.model.MaterialCode',
//                    proxy: {
//                        url: 'material_codes/get_material_codes/list.json',
//                        type: 'ajax',
//                        format: 'json',
//                        method: 'GET',
//                        reader: {
//                            root: 'material_codes',
//                            successProperty: 'success',
//                            totalProperty: 'totalRecords'
//                        }
//                    }
//                }),
                store: 'dict.MaterialCodes',
                flex: 1,
                displayField: 'name',
                valueField: 'id',
                emptyText: (this.emptyText || '请输入并选择物料编码'),
                hideTrigger: true, //伪成输入框
                allowBlank: false,
//                forceSelection: true,
                mode: 'remote',
                minChars: 1,
                triggerAction: 'query',
                validator: function(){
                    if(this.getValue() === this.getRawValue()) {
                        return "请实际选择一个物料编码！";
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
                action: 'add_material_code',
                tooltip: '新增物料编码。提示不出来说明没有，加一个吧',
                hidden:(this.hiddenPlus || false),
                disabled:(this.disabledPlus || false)
            }
        ]

        this.callParent(arguments);
//    },
//    isValid: function() {
//        if(this.hidden) {
//            return true;
//        } else {
//            return this.items.items[0].isValid();
//        }
    }
});