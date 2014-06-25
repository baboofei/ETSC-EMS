Ext.define('EIM.model.GridVendorUnit', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'name|en_name|unit_aliases>unit_alias|short_code',
            type: 'string'
        },
        {
            name: 'unit_aliases>unit_alias',
            type: 'string'
        },
        {
            name: 'short_code',
            type: 'string'
        },
        {
            name: 'parent_id',
            type: 'int'
        },
        {
            name: 'parent_name',
            type: 'string'
        },
        {
            name: 'does_inherit',
            type: 'boolean'
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
            name: 'purchasers>id',
            type: 'string'
        },
        {
            name: 'purchasers>name',
            type: 'string'
        },
        {
            name: 'businesses>id',
            type: 'string'
        },
        {
            name: 'businesses>name',
            type: 'string'
        },
        {
            name: 'supporters>id',
            type: 'string'
        },
        {
            name: 'supporters>name',
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
            name: 'intro',
            type: 'string'
        },
        {
            name: 'en_intro',
            type: 'string'
        },
        {
            name: 'bank_info',
            type: 'string'
        },
        {
            name: 'established_at',
            type: 'date'
        },
        {
            name: 'scale',
            type: 'int'
        },
        {
            name: 'competitor',
            type: 'string'
        },
        {
            name: 'phone',
            type: 'string'
        },
        {
            name: 'fax',
            type: 'string'
        },
        {
            name: 'major_product',
            type: 'string'
        },
        {
            name: 'currency_id',
            type: 'int'
        },
        {
            name: 'is_partner',
            type: 'boolean'
        },
        {
            name: 'is_producer',
            type: 'boolean'
        },
        {
            name: 'is_seller',
            type: 'boolean'
        },
        {
            name: 'lead_time',
            type: 'string'
        },
        {
            name: 'term',
            type: 'string'
        },
        {
            name: 'product_quality',
            type: 'string'
        },
        {
            name: 'service_quality',
            type: 'string'
        },
        {
            name: 'delivery_quality',
            type: 'string'
        },
        {
            name: 'level',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'string'
        }
    ]
});