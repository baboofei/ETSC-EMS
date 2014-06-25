Ext.define('EIM.model.GridBusinessContact', {
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
            name: 'en_name',
            type: 'string'
        },
        {
            name: 'business_unit>id',
            type: 'int'
        },
        {
            name: 'business_unit>(name|en_name|unit_aliases>unit_alias)',
            type: 'string'
        },
        {
            name: 'business_unit>unit_aliases>unit_alias',
            type: 'string'
        },
        {
            name: 'business_unit>city>id',
            type: 'int'
        },
        {
            name: 'business_unit>city>name',
            type: 'string'
        },
        {
            name: 'business_unit>city>prvc>area>id',
            type: 'int'
        },
        {
            name: 'business_unit>city>prvc>area>name',
            type: 'string'
        },
        {
            name: 'phone',
            type: 'string'
        },
        {
            name: 'mobile',
            type: 'string'
        },
        {
            name: 'fax',
            type: 'string'
        },
        {
            name: 'email',
            type: 'string'
        },
        {
            name: 'im',
            type: 'string'
        },
        {
            name: 'department',
            type: 'string'
        },
        {
            name: 'position',
            type: 'string'
        },
        {
            name: 'addr',
            type: 'string'
        },
        {
            name: 'postcode',
            type: 'string'
        },
        {
            name: 'en_addr',
            type: 'string'
        },
        {
            name: 'created_at',
            type: 'string'
        },
        {
            name: 'comment',
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
            name: 'editable',
            type: 'boolean'
        }
    ]
});