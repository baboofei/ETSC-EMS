Ext.define('EIM.view.salelog.ChangeTab', {
    extend: 'Ext.form.Panel',
    alias: 'widget.change_tab',

    title: '换货',
    border: 0,
    padding: 4,
    layout: 'anchor',
    fieldDefaults: EIM_field_defaults,
    items: [{
        xtype: 'combo',
        fieldLabel: '原因',
        store: [[1, "工厂原因"], [2, "客户环境原因"], [3, "其他"]],
        editable: false,
        allowBlank: false
    }, {
        xtype: 'textfield',
        fieldLabel: '对应合同号',
        name: 'contract_id',
        emptyText: '请输入并选择要换货的合同号'
    }]
});