Ext.define('EIM.model.Collection', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'contract_id',
            type: 'int'
        },
        {
            name: 'received_at',
            type: 'date'
        },
        {
            name: 'amount',
            type: 'float'
        },
        {
            name: 'compensation_amount',
            type: 'float'
        },
        {
            name: 'reason',
            type: 'string'
        },
        {
            name: 'user_id',
            type: 'int'
        },
        {
            name: 'created_at',
            type: 'date'
        },
        {
            name: 'updated_at',
            type: 'date'
        }
    ]
});