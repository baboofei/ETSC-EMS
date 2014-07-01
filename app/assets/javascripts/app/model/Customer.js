/**
 * Grid的时候别改这个了………………
 */
Ext.define('EIM.model.Customer', {
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
            name: 'customer_unit_id',
            type: 'int'
        },
        {
            name: 'customer_unit_name',
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
            name: 'en_addr',
            type: 'string'
        },
        {
            name: 'lead_id',
            type: 'string'
        },
        {
            name: 'application_ids',
            type: 'string'
        },
        {
            name: 'created_at',
            type: 'date'
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
            name: 'comment',
            type: 'string'
        }
    ]
});