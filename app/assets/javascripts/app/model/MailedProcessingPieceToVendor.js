Ext.define('EIM.model.MailedProcessingPieceToVendor', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'vendor_id',
            type: 'int'
        },
        {
            name: 'vendor_name',
            type: 'string'
        },
        {
            name: 'vendor_unit_id',
            type: 'int'
        },
        {
            name: 'vendor_unit_name',
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
            name: 'quantity',
            type: 'int'
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