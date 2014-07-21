Ext.define('EIM.view.customer_unit.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.customer_unit_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '新增/修改客户单位',
    layout: 'fit',
    width: 450,
//    height: 290,
    maximizable: true,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                defaults: {
                    xtype: 'textfield'
                },
                items: [
                    {
                        xtype: 'hidden',
                        name: 'id',
                        hidden: true
                    },
                    {
                        xtype: 'hidden',
                        name: 'source_element_id',
                        hidden: true
                    },
                    {
                        name: 'name|en_name|unit_aliases>unit_alias',
                        fieldLabel: '名称',
                        allowBlank: false
                    },
                    {
                        xtype: 'tabpanel',
                        name: 'addr_group_tab',
                        border: false,
                        height: 146,
                        items: [
                            {
                                xtype: 'addr_for_unit',
                                title: 'test',
                                addrIndex: 1
                            },
                            {
                                xtype: 'addr_for_unit',
                                addrIndex: 2
                            },
                            {
                                title: '+'
                            }
                        ]
                    },
                    {
                        name: 'en_name',
                        fieldLabel: '英文名称'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5',
                        defaults: {
                            xtype: 'textfield'
                        },
                        items: [
                            {
                                name: 'site',
                                fieldLabel: '网址'
                            },
                            {
                                xtype: 'combo',
                                name: 'cu_sort',
                                fieldLabel: '单位性质',
                                store: Ext.create('Ext.data.Store', {
                                    data: filter_all_dict('unit_properties'),
                                    model: 'EIM.model.AllDict',
                                    proxy: 'memory'
                                }),
                                displayField: 'display',
                                valueField: 'value',
                                editable: false,
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        name: 'unit_aliases>unit_alias',
                        fieldLabel: '别称',
                        emptyText: '多个别称用西文逗号“,”分开'
                    },
                    {
                        name: 'comment',
                        fieldLabel: '备注'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '保存',
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