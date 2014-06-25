Ext.define('EIM.view.salelog.CancelTab', {
    extend: 'Ext.form.Panel',
    alias: 'widget.cancel_tab',

    title: '个案完结',
    border: 0,
    padding: 4,
    layout: 'anchor',
    fieldDefaults: EIM_field_defaults,
    items: [{
        xtype: 'combo',
        fieldLabel: '完结原因',
        name: 'case_cancel_reason',
        store: Ext.create('Ext.data.Store', {
            data: filter_all_dict('case_cancel_reason'),
            model: 'EIM.model.AllDict',
            proxy:  'memory'
        }),
        displayField: 'display',
        valueField: 'value',
        triggerAction: 'all',
        allowBlank: false,
        value: '1',
        editable: false
    }]
});