/**
 * “导出为Excel”填条件的表单
 */
Ext.define('EIM.view.admin_inventory.ExportConditionForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_export_condition_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '选择导出条件',
    layout: 'fit',
    width: 400,
    border: 0,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                defaults: {
                },
                items: [
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: '起止日期',
                        layout: 'hbox',
                        defaults: {
                            xtype: 'datefield',
                            format: 'Y-m-d'
                        },
                        items: [
                            {
                                name: 'start_at',
                                flex: 1
                            },
                            {
                                xtype: 'displayfield',
                                value: '~'
                            },
                            {
                                name: 'end_at',
                                flex: 1
                            }
                        ]
                    },
                    {
                        xtype: 'boxselect',
                        fieldLabel: '供应商单位',
                        name: 'vendor_unit_id',
                        store: 'ComboVendorUnits',
                        queryMode: 'remote',
                        forceSelection: true,
                        triggerAction: 'query',
                        minChars: 1,
                        displayField: 'name',
                        valueField: 'id',
                        height: 50,
                        emptyText: '可多选'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '关键字',
                        name: 'keyword'
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: '单价范围',
                        layout: 'hbox',
                        defaults: {
                            xtype: 'numberfield'
                        },
                        items: [
                            {
                                name: 'min_unit_price',
                                flex: 1
                            },
                            {
                                xtype: 'displayfield',
                                value: '~'
                            },
                            {
                                name: 'max_unit_price',
                                flex: 1
                            }
                        ]
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定',
                action: 'save'
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