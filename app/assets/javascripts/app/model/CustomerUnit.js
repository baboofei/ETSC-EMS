Ext.define('EIM.model.CustomerUnit', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'city_id',
            type: 'int'
        },
        {
            name: 'city_name',
            type: 'string'
        },
        {
            name: 'postcode',
            type: 'string'
        },
        {
            name: 'addr',
            type: 'string'
        },
        {
            name: 'en_name',
            type: 'string'
        },
        {
            name: 'en_addr',
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
            name: 'alias',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'string'
        }
    ]
});