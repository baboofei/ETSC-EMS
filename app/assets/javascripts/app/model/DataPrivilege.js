Ext.define('EIM.model.DataPrivilege', {
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
            name: 'description',
            type: 'string'
        },
        {
            name: 'visible_to_roles>visible_role_id',
            type: 'string'
        },
        {
            name: 'visible_to_roles>visible_role_name',
            type: 'string'
        },
        {
            name: 'editable_to_ids',
            type: 'string'
        },
        {
            name: 'editable_to_names',
            type: 'string'
        },
        {
            name: 'partial_editable_to_ids',
            type: 'string'
        },
        {
            name: 'partial_editable_to_names',
            type: 'string'
        },
        {
            name: 'is_hierarchy',
            type: 'boolean'
        },
        {
            name: 'is_group_hierarchy',
            type: 'boolean'
        }
    ]
});