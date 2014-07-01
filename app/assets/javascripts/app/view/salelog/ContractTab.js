Ext.define('EIM.view.salelog.ContractTab', {
    extend: 'Ext.form.Panel',
    alias: 'widget.contract_tab',

    title: '合同',
    border: 0,
    padding: 4,
    layout: 'anchor',
    fieldDefaults: EIM_field_defaults,
    items: [{
        xtype: 'datefield',
        fieldLabel: '预计时间',
        name: 'plan_to_sign_on',
        allowBlank: false,
        format: 'Y-m-d',
        value: Ext.Date.add(new Date(), Ext.Date.DAY, 15),
        emptyText: '请选择预计能签署合同的时间(forecast用)'
    }]
});