Ext.define('EIM.model.MailedContent', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'customer_id',
            type: 'int'
        },
        {
            name: 'customer_name',
            type: 'string'
        },
        {
            name: 'express_id',
            type: 'string'//字典项里来的，虽然是xx_id，但是string
        },
        {
            name: 'our_company_id',
            type: 'int'
        },
        {
            name: 'model',
            type: 'string'
        },
        {
            name: 'remind_at',
            type: 'date'
        },
        {
            name: 'tracking_number',
            type: 'string'
        },
        {
            name: 'timestamp',
            type: 'string'
        }
    ]
});