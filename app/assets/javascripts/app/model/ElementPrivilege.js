Ext.define('EIM.model.ElementPrivilege', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'function_name',
            type: 'string'
        },
        {
            name: 'element_id',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'invisible_to_ids',
            type: 'string'
        },
        {
            name: 'invisible_to_names',
            type: 'string'
        },
        {
            name: 'disable_to_ids',
            type: 'string'
        },
        {
            name: 'disable_to_names',
            type: 'string'
        },
        {
            name: 'default_value',
            type: 'string'
        }
    ]
});