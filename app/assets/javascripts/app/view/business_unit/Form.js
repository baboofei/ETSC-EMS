Ext.define('EIM.view.business_unit.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.business_unit_form',

    //    requires:['Ext.ux.form.field.BoxSelect'],

    title: '新增/修改商务相关单位',
    layout: 'fit',
    width: 450,
    height: 290,
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
                        fieldLabel: 'id'
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
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5',
                        defaults: {
                            xtype: 'textfield'
                        },
                        items: [
                            {
                                xtype: 'combo',
                                name: 'city_id',
                                fieldLabel: '所属城市',
                                store: 'dict.Cities',
                                forceSelection: true,
                                displayField: 'name',
                                valueField: 'id',
                                allowBlank: false,
                                mode: 'remote',
                                emptyText: '请输入所属城市名称',
                                triggerAction: 'query',
                                minChars: 1,
                                hideTrigger: true //伪成输入框
                            },
                            {
                                name: 'postcode',
                                fieldLabel: '邮政编码'
                            }
                        ]
                    },
                    {
                        name: 'addr',
                        fieldLabel: '地址',
                        emptyText: '不要写城市名称，因为已经选择了'
                    },
                    {
                        name: 'en_name',
                        fieldLabel: '英文名称'
                    },
                    {
                        name: 'en_addr',
                        fieldLabel: '英文地址'
                    },
                    {
                        xtype: 'textfield',
                        name: 'site',
                        fieldLabel: '网址'
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