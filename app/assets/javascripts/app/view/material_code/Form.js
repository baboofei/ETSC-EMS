Ext.define('EIM.view.material_code.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.material_code_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '新增/修改物料编码',
    layout: 'fit',
    width: 450,
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
//                    {
//                        name: 'name',
//                        fieldLabel: '名称',
//                        allowBlank: false
//                    },
                    {
                        xtype: 'combo',
                        name: 'name',
                        fieldLabel: '名称',
                        store: 'dict.MaterialCodes',
                        displayField: 'actually_name',
                        valueField: 'id',
                        emptyText: '请输入并选择物料编码',
                        hideTrigger: true, //伪成输入框
                        allowBlank: false,
                        //                forceSelection: true,
                        mode: 'remote',
                        minChars: 1,
                        triggerAction: 'query'
                    },
                    {
                        name: 'code',
                        fieldLabel: '编码',
                        allowBlank: false
                    },
                    {
                        name: 'description',
                        fieldLabel: '描述',
                        allowBlank: false
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