Ext.define('EIM.view.contract.ContactPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.contract_contact_panel',

    title: '联系人信息',
    bodyPadding: 4,
    autoScroll: true,
    layout: 'border',
    fieldDefaults: EIM_field_defaults,

    items: [
        {
            xtype: 'tabpanel',
            region: 'center',
            items: [
                {
                    xtype: 'contract_customer_grid',
                    title: '客户联系人'
                },
                {
                    xtype: 'panel',
                    title: '商务相关联系人'
                },
                {
                    xtype: 'panel',
                    title: '卖方信息及掩护单位'
                }
            ]
        }
    ]
});