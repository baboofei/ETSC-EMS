/**
 * “修好”的表单
 */
Ext.define('EIM.view.admin_inventory.FixForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_fix_form',

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
                        fieldLabel: '存放地点',
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
                text: '确定',
                action: 'save_fix'
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