/**
 * “页面资源权限”的表单
 */
Ext.define('EIM.view.privilege.ElementForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.privilege_element_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '页面资源权限',
    layout: 'fit',
    width: 400,
    height: 470,
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
                        name: 'function_name',
                        fieldLabel: '功能名称'
                    },
                    {
                        xtype: 'textfield',
                        name: 'element_id',
                        fieldLabel: '页面资源ID'
                    },
                    {
                        xtype: 'textfield',
                        name: 'description',
                        fieldLabel: '资源描述'
                    },
                    {
                        xtype: 'container',
                        padding: '0 0 4 0',
                        height: 300,
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [
                            {
                                xtype: 'grid',
                                name: 'all',
                                padding: '0 2 0',
                                flex: 1,
                                title: '所有角色',
                                store: Ext.create('Ext.data.Store', {
                                    model: 'EIM.model.GridRole'
                                }),
                                multiSelect: true,
                                columns: [{dataIndex: 'name', flex: 1}],
                                hideHeaders: true,
                                viewConfig: {
                                    plugins: {
                                        ptype: 'gridviewdragdrop',
                                        dragGroup: 'roles',
                                        dropGroup: 'roles'
                                    }
                                }
                            },
                            {
                                xtype: 'container',
                                padding: '0 0 0 2',
                                flex: 1,
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch'
                                },
                                items: [
                                    {
                                        xtype: 'grid',
                                        name: 'invisible_to',
                                        padding: '0 0 2 0',
                                        flex: 1,
                                        title: '不可见角色',
                                        store: Ext.create('Ext.data.Store', {
                                            model: 'EIM.model.GridRole'
                                        }),
                                        multiSelect: true,
                                        columns: [{dataIndex: 'name', flex: 1}],
                                        hideHeaders: true,
                                        viewConfig: {
                                            plugins: {
                                                ptype: 'gridviewdragdrop',
                                                dragGroup: 'roles',
                                                dropGroup: 'roles'
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'grid',
                                        name: 'disable_to',
                                        padding: '2 0 0',
                                        flex: 1,
                                        title: '可见不可用角色',
                                        store: Ext.create('Ext.data.Store', {
                                            model: 'EIM.model.GridRole'
                                        }),
                                        multiSelect: true,
                                        columns: [{dataIndex: 'name', flex: 1}],
                                        hideHeaders: true,
                                        viewConfig: {
                                            plugins: {
                                                ptype: 'gridviewdragdrop',
                                                dragGroup: 'roles',
                                                dropGroup: 'roles'
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        name: 'default_value',
                        labelWidth: 120,
                        fieldLabel: '不可用时显示为'
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