Ext.define('EIM.model.GridPopUnit', {
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
            name: 'city>name',
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
            name: 'unit_aliases>id',
            type: 'string'
        },
        {
            name: 'unit_aliases>unit_alias',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'string'
        }
    ]
});