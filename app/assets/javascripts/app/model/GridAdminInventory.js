Ext.define('EIM.model.GridAdminInventory', {
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
            name: 'model',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'sn',
            type: 'string'
        },
        {
            name: 'number',
            type: 'string'
        },
        //        {
        //            name: 'inventory_type',
        //            type: 'int'
        //        },
        {
            name: 'material_code>(name|code|description)',
            type: 'string'
        },
        {
            name: 'material_code>id',
            type: 'int'
        },
        {
            name: 'inventory_level',
            type: 'int'
        },
        {
            name: 'keep_at',
            type: 'int'
        },
        {
            name: 'current_quantity',
            type: 'float'
        },
        {
            name: 'count_unit',
            type: 'string'
        },
        {
            name: 'buy_price',
            type: 'float'
        },
        {
            name: 'financial_price',
            type: 'float'
        },
        {
            name: 'currency_id',
            type: 'int'
        },
        {
            name: 'rmb',
            type: 'float'
        },
        {
            name: 'state',
            type: 'string'
        },
        {
            name: 'project',
            type: 'string'
        },
        {
            name: 'keeper>id',
            type: 'int'
        },
        {
            name: 'keeper_user_name',
            type: 'string'
        },
        {
            name: 'buyer>id',
            type: 'int'
        },
        {
            name: 'buyer_user_name',
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
            name: 'ownership',
            type: 'int'
        },
        {
            name: 'ownership_name',
            type: 'string'
        },
        {
            name: 'vendor_unit_id',
            type: 'int'
        },
        {
            name: 'bought_from>(name|en_name|unit_aliases>unit_alias)',
            type: 'string'
        },
        {
            name: 'vendor_id',
            type: 'int'
        },
        {
            name: 'vendor_name',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'string'
        },
        {
            name: 'created_at',
            type: 'date'
        },
        {
            name: 'expire_at',
            type: 'date'
        },
        {
            name: 'expire_warranty_at',
            type: 'date'
        }
    ]
});