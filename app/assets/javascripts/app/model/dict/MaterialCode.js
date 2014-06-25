Ext.define('EIM.model.dict.MaterialCode', {
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
            name: 'actually_name',
            type: 'string'
        },
        {
            name: 'code',
            type: 'string'
        }
    ]
});
