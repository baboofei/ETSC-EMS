Ext.define('EIM.model.GridRemind', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'remind_at',
            type: 'date'
        },
        {
            name: 'remind_text',
            type: 'string'
        },
        {
            name: 'flag',
            type: 'boolean'
        },
        {
            name: 'user_id',
            type: 'int'
        }
    ]
});