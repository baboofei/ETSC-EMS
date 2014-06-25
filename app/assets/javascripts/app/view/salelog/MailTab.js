Ext.define('EIM.view.salelog.MailTab', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mail_tab',

    title: '寄…',
    border: 0,
    padding: '0 4',
    layout: 'fit',
    fieldDefaults: EIM_field_defaults,
    items: [{
        xtype: 'tabpanel',
        padding: '5 0 0 0',
        items: [{
            title: '样品',
            xtype: 'mailed_sample_grid',
            iconCls: 'ttl_sample'
        }, {
            title: '目录/文件',
            xtype: 'mailed_content_grid',
            iconCls: 'ttl_content'
        }, {
            title: '加工件(往工厂)',
            xtype: 'mailed_processing_piece_to_vendor_grid',
            iconCls: 'ttl_component_out'
        }, {
            title: '加工件(往客户)',
            xtype: 'mailed_processing_piece_to_customer_grid',
            iconCls: 'ttl_component_in'
        }, {
            title: '产品',
            xtype: 'mailed_product_grid',
            iconCls: 'ttl_product'
        }]
    }]
});