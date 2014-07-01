/**
 * “数据权限”的表单
 */
Ext.define('EIM.view.privilege.DataForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.privilege_data_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '数据权限',
    layout: 'fit',
    width: 400,
    height: 524,
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
                        name: 'name',
                        fieldLabel: 'store名称'
                    },
                    {
                        xtype: 'textfield',
                        name: 'description',
                        fieldLabel: 'store描述'
                    },
                    {
                        xtype: 'container',
                        padding: '4 0 0 0',
                        height: 400,
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
                                        name: 'visible_to',
                                        padding: '0 0 2 0',
                                        flex: 3,
                                        title: '全部数据对其可见但不可改',
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
                                        name: 'editable_to',
                                        padding: '0 0 2 0',
                                        flex: 3,
                                        title: '全部数据对其可见可改',
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
                                        name: 'partial_editable_to',
                                        padding: '0 0 2 0',
                                        flex: 3,
                                        title: '部分数据对其可见可改',
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
                                        xtype: 'checkbox',
                                        name: 'is_hierarchy',
                                        boxLabel: '是否能查看下级人员的数据',
                                        padding: '0 0 0',
                                        flex: 0.3
                                    },
                                    {
                                        xtype: 'checkbox',
                                        name: 'is_group_hierarchy',
                                        boxLabel: '是否继承“父store”的分组',
                                        padding: '0 0 0',
                                        flex: 0.3
                                    }
                                ]
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