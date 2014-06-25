Ext.define('EIM.view.service_log.ChangePartsForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.service_log_change_parts_form',

    title: '更换零部件',
//    iconCls: 'btn_change_parts',
    layout: 'fit',
    width: 600,
    height: 500,
    modal: true,
    maximizable: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                trackResetOnLoad: true,
                items: [
                    {
                        xtype: 'hidden',
                        name: 'flow_sheet_id',
                        hidden: true
                    },
                    {
                        xtype: 'container',
                        layout: 'anchor',
                        anchor: '100% -22',
                        items: [
                            {
                                xtype: 'admin_inventory_mini_grid',
                                name: 'source_grid',
                                anchor: '100% 60%',
                                displayPaging: true,
                                multiSelect: true,
                                viewConfig: {
                                    plugins: {
                                        ptype: 'gridviewdragdrop',
                                        dragGroup: 'miniGridAdminInventories',
                                        dropGroup: null
                                    }
                                }
                            },
                            {
                                xtype: 'admin_inventory_mini_grid',
                                name: 'target_grid',
                                title: '待处理物品',
                                anchor: '100% 40%',
                                padding: '0 0 4 0',
                                store: 'GridCopyMiniAdminInventories',
                                multiSelect: true,
                                viewConfig: {
                                    plugins: {
                                        ptype: 'gridviewdragdrop',
                                        dragGroup: 'miniGridAdminInventories',
                                        dropGroup: 'miniGridAdminInventories'
                                    }
                                },
                                bbar: [
                                    {
                                        text: '删除',
                                        iconCls: 'btn_delete',
                                        action: 'deleteSelection',
                                        disabled: true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                name: 'act_date',
                                value: new Date(),
                                fieldLabel: '日期'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '备注',
                                name: 'comment'
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