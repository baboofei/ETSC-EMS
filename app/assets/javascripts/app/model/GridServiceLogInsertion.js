Ext.define('EIM.model.GridServiceLogInsertion', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'process',
            type: 'int'
        },
        {
            name: 'flow_sheet_id',
            type: 'int'
        },
        {
            name: 'start_at',
            type: 'date'
        },
        {
            name: 'end_at',
            type: 'date'
        },
        {
            name: 'content',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'string'
        },
        {
            name: 'inner_id',
            type: 'int'
        },
        {
            name: 'natural_language',
            type: 'string'
        }
    ]
});