Ext.define('EIM.view.todo.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.todo_form',

    title: '新增脑洞',
    layout: 'fit',
    modal: true,
    //    autoShow: true,

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
                        xtype: 'combo',
                        store: 'ComboFunctions',
                        mode: 'remote',
                        valueField: 'id',
                        displayField: 'name',
                        value: 1,
                        editable: false,
                        name: 'function_id',
                        fieldLabel: '所属模块',
                        allowBlank: false
                    },
                    {
                        name: 'description',
                        fieldLabel: '内容',
                        xtype: 'textarea',
                        allowBlank: false
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '类别',
                        name: 'category',
                        displayField: 'display',
                        valueField: 'value',
                        value: '1',
                        editable: false,
                        allowBlank: false,
                        store: Ext.create('Ext.data.Store', {
                            data: filter_all_dict('update_type'),
                            model: 'EIM.model.AllDict',
                            proxy:  'memory'
                        })
                    },
                    {
                        name: 'state',
                        fieldLabel: '状态'
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

