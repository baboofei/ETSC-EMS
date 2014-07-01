/**
 * “报损”、“报废”、“充抵”三合一的表单，只有按钮不同
 */
Ext.define('EIM.view.admin_inventory.DamageScrapChargeForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_damage_scrap_charge_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    layout: 'fit',
    width: 400,
//    height: 174,
    border: 0,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'hidden',
                        name: 'id',
                        hidden: true
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '新地点',
                        name: 'keep_at',
                        displayField: 'display',
                        valueField: 'value',
                        value: '1',
                        triggerAction: 'all',
                        editable: false,
                        allowBlank: false,
                        store: Ext.create('Ext.data.Store', {
                            data: filter_all_dict('stock_keep_at'),
                            model: 'EIM.model.AllDict',
                            proxy:  'memory'
                        })
                    },
                    {
                        xtype: 'expandable_vendor_unit_combo',
                        fieldLabel: '新所有权',
                        padding: '0 0 5',
                        emptyText: '请输入并选择此物品的所有权单位',
                        flex: 1
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '数量',
                        name: 'outstock_count',
                        allowBlank: false,
                        minValue: 0.01
                    },
                    {
                        xtype: 'boxselect',
                        fieldLabel: '资产编号',
                        name: 'outstock_numbers',
                        store: Ext.create('Ext.data.Store', {
                            model: 'EIM.model.dict.Member',
                            proxy:  'memory'
                        }),
                        queryMode: 'local',
                        height: 40,
                        displayField: 'name',
                        valueField: 'id',
                        emptyText: '可多选',
                        editable: false,
                        validator: function(){
                            if(this.invalidMsg === '') {
                                this.clearInvalid();
                                return true;
                            } else {
                                return this.invalidMsg;
                            }
                        },
                        invalidMsg: ''
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '原因',
                        name: 'project',
                        allowBlank: false
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: '日期',
                        name: 'created_at',
                        value: new Date(),
                        allowBlank: false,
                        format: 'Y-m-d'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定d',
                action: 'save_damage'
            },
            {
                text: '确定s',
                action: 'save_scrap'
            },
            {
                text: '确定c',
                action: 'save_charge'
            },
            {
                text: '确定l',
                action: 'save_change_location'
            },
            {
                text: '确定o',
                action: 'save_change_ownership'
            },
            {
                text: '取消',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});