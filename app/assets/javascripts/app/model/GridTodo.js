Ext.define('EIM.model.GridTodo', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'function_id',
            type: 'int'
        },
        {
            name: 'function_name',
            type: 'string'
        },
        {
            name: 'category',//字典表里来的，字符串
            type: 'string'
        },
        {
            name: 'category_name',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'state',
            type: 'string'
        },
        {
            name: 'created_at',
            type: 'date'
        }
    ]
});