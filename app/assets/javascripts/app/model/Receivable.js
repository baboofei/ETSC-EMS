Ext.define('EIM.model.Receivable', {
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
            name: 'expected_receive_at',
            type: 'date'
        },
        {
            name: 'amount',
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