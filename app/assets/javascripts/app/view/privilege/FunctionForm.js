/**
 * “功能权限”的表单
 */
Ext.define('EIM.view.privilege.FunctionForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.privilege_function_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '功能权限',
    layout: 'fit',
    width: 400,
    height: 146,
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
                        xtype: 'textfield',
                        name: 'id',
                        hidden: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'name',
                        fieldLabel: '功能名称',
                        id: 'function_name'
                    },
                    {
                        xtype: 'boxselect',
                        height: 50,
                        name: 'visible_to_ids',
                        fieldLabel: '可见角色',
                        store: 'GridRoles',//[[1, 'NPS销售'], [2, 'RPS销售'], [3, '商务']]
                        displayField: 'name',
                        valueField: 'id'
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