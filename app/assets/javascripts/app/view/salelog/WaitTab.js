Ext.define('EIM.view.salelog.WaitTab', {
    extend: 'Ext.form.Panel',
    alias: 'widget.wait_tab',

    title: '等待',
    border: 0,
    padding: 4,
    layout: 'anchor',
    fieldDefaults: EIM_field_defaults,
    items: [
        {
            xtype: 'combo',
            fieldLabel: '等待原因',
            name: 'wait_reason',
            store: Ext.create('Ext.data.Store', {
                data: filter_all_dict('wait_reason'),
                model: 'EIM.model.AllDict',
                proxy: 'memory'
            }),
            displayField: 'display',
            valueField: 'value',
            triggerAction: 'all',
            allowBlank: false,
            value: '1',
            editable: false
        },
        {
            xtype: 'datefield',
            fieldLabel: '提醒时间',
            name: 'remind_at',
            format: 'Y-m-d',
            value: Ext.Date.add(new Date(), Ext.Date.DAY, 15)
        }
    ]
});