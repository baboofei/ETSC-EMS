Ext.define('EIM.model.GridOutStockQueryAdminInventory', {
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
            name: 'current_quantity',
            type: 'float'
        },
        {
            name: 'count_unit',
            type: 'string'
        },
        {
            name: 'rmb',
            type: 'float'
        },
        {
            name: 'project',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'string'
        },
        {
            name: 'apply_for_sn',
            type: 'string'
        },
        {
            name: 'keep_at',
            type: 'int'
        },
        {
            name: 'number',
            type: 'string'
        },
        {
            name: 'sn',
            type: 'string'
        }
    ]
});