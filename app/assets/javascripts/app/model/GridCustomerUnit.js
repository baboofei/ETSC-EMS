Ext.define('EIM.model.GridCustomerUnit', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'name|en_name|unit_aliases>unit_alias',
            type: 'string'
        },
        {
            name: 'city_id',
            type: 'int'
        },
        {
            name: 'customer_unit_addrs>city>name',
            type: 'string'
        },
        {
            name: 'customer_unit_addrs>postcode',
            type: 'string'
        },
        {
            name: 'customer_unit_addrs>addr',
            type: 'string'
        },
        {
            name: 'en_name',
            type: 'string'
        },
        {
            name: 'customer_unit_addrs>en_addr',
            type: 'string'
        },
        {
            name: 'site',
            type: 'string'
        },
        {
            name: 'sort_id',
            type: 'int'
        },
        {
            name: 'cu_sort',
            type: 'string'
        },
        {
            name: 'credit_level',
            type: 'string'
        },
        {
            name: 'unit_aliases>id',
            type: 'string'
        },
        {
            name: 'unit_aliases>unit_alias',
            type: 'string'
        },
        {
            name: 'all_city_ids',
            type: 'string'
        },
        {
            name: 'all_city_names',
            type: 'string'
        },
        {
            name: 'all_is_primes',
            type: 'string'
        },
        {
            name: 'all_addr_names',
            type: 'string'
        },
        {
            name: 'all_postcodes',
            type: 'string'
        },
        {
            name: 'all_addrs',
            type: 'string'
        },
        {
            name: 'all_en_addrs',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'string'
        }
    ]
});