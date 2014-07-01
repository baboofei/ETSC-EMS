Ext.define('EIM.model.GridAdminInventoryHistory', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'act_at',
            type: 'date'
        },
        {
            name: 'natural_language',
            type: 'string'
        }
    ]
});