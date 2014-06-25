Ext.define('EIM.model.GridPop', {
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
            name: 'pop_unit>id',
            type: 'int'
        },
        {
            name: 'pop_unit>(name|unit_aliases>unit_alias)',
//            name: 'pop_unit>pop_unit_aliases>unit_alias',
            type: 'string'
        },
        {
            name: 'pop_unit>unit_aliases>unit_alias',
            type: 'string'
        },
        {
            name: 'pop_unit>cu_sort',
            type: 'int'
        },
        {
            name: 'pop_unit_sort_id', //
            type: 'int'
        },
        {
            name: 'pop_unit>city>id',
            type: 'int'
        },
        {
            name: 'pop_unit>city>name',
            type: 'string'
        },
        {
            name: 'pop_unit>city>prvc>area>id',
            type: 'int'
        },
        {
            name: 'pop_unit>city>prvc>area>name',
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
            name: 'lead_id',
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
            name: 'prod_applications>id',
            type: 'string'
        },
        {
            name: 'prod_applications>description',
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
            name: 'already_shared_to',
            type: 'string'
        },
        {
            name: 'editable',
            type: 'boolean'
        }
    ]
});