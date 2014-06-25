Ext.define('EIM.model.GridSalecase', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'number',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'string'
        },
        {
            name: 'start_at',
            type: 'date'
        },
        {
            name: 'updated_at',
            type: 'date'
        },
        {
            name: 'has_signed_contract',
            type: 'string'
        },
        {
            name: 'user_id',
            type: 'int'
        },
        {
            name: 'user_name',
            type: 'string'
        },
        {
            name: 'group_id',
            type: 'int'
        },
        {
            name: 'group_name',
            type: 'string'
        },
        {
            name: 'customers>(name|en_name)',
            type: 'string'
        },
        {
            name: 'customers>id',
            type: 'string'
        },
        {
            name: 'customer_units>(name|en_name|unit_aliases>unit_alias)',
            type: 'string'
        },
        {
            name: 'priority',
            type: 'string'
        },
        {
            name: 'feasible',
            type: 'int'
        },
        {
            name: 'remind_at',
            type: 'date'
        },
        {
            name: 'editable',
            type: 'boolean'
        }
    ]
});
