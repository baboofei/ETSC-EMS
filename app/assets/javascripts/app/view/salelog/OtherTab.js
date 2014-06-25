Ext.define('EIM.view.salelog.OtherTab', {
    extend: 'Ext.form.Panel',
    alias: 'widget.other_tab',

    title: '进展',
    border: 0,
    padding: 4,
    layout: 'anchor',
    fieldDefaults: EIM_field_defaults,
    items: [{
    	name:'other',
        xtype: 'textarea',
        fieldLabel: '详情',
        allowBlank: false
    }]
});