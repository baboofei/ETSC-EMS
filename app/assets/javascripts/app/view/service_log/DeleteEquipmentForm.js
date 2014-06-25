Ext.define('EIM.view.service_log.DeleteEquipmentForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.service_log_delete_equipment_form',

    title: '删除货品',
//    iconCls: 'btn_transfer',
    layout: 'fit',
    width: 300,
    modal: true,

    initComponent: function() {
        var userArray = filter_all_user();

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
                        xtype: 'hidden',
                        name: 'equipment_ids',
                        hidden: true
                    },
                    {
                        xtype: 'displayfield',
                        value: '确定要删除选中的货品？'
//                    },
//                    {
//                        xtype: 'textfield',
//                        name: 'sn',
//                        fieldLabel: '序列号'
//                    },
//                    {
//                        xtype: 'textfield',
//                        name: 'symptom',
//                        fieldLabel: '故障现象'
//                    },
//                    {
//                        xtype: 'datefield',
//                        format: 'Y-m-d',
//                        name: 'accepted_at',
//                        value: new Date(),
//                        fieldLabel: '到货日期'
//                    },
//                    {
//                        xtype: 'textfield',
//                        name: 'collect_account_number',
//                        fieldLabel: '到付单号'
//                    },
//                    {
//                        xtype: 'combo',
//                        name: 'is_in_warranty',
//                        fieldLabel: '保修状态',
//                        store: Ext.create('Ext.data.Store', {
//                            data: filter_all_dict('flow_sheet_in_warranty',false),
//                            model: 'EIM.model.AllDict',
//                            proxy: 'memory'
//                        }),
//                        displayField: 'display',
//                        valueField: 'value',
//                        triggerAction: 'all',
//                        editable: false,
//                        value: "1",
//                        emptyText: '请选择保修状态',
//                        allowBlank: false
//                    },
//                    {
//                        xtype: 'textfield',
//                        name: 'comment',
//                        fieldLabel: '备注'
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