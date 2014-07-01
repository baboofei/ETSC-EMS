Ext.define('EIM.view.service_log.DeliverEquipmentForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.service_log_deliver_equipment_form',

    title: '发还货品',
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
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        name: 'act_date',
                        value: new Date(),
                        fieldLabel: '发还日期'
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