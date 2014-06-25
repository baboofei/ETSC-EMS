Ext.define('EIM.model.GridVendor', {
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
            name: 'vendor_unit>id',
            type: 'int'
        },
        {
            name: 'vendor_unit>(name|en_name|unit_aliases>unit_alias|short_code)',
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
            name: 'phone',
            type: 'string'
        },
        {
            name: 'mobile',
            type: 'string'
        },
        {
            name: 'im',
            type: 'string'
        },
        {
            name: 'fax',
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
            name: 'postcode',
            type: 'string'
        },
        {
            name: 'email',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'string'
        },
        {
            name: 'editable',
            type: 'boolean'
        }
    ]
});