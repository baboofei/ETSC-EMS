Ext.define('EIM.model.ServiceLog', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'process',
        type: 'int'
    }, {
        name: 'natural_language',
        type: 'string'
    }, {
        name: 'start_at',
        type: 'date'
    }, {
        name: 'end_at',
        type: 'date'
    }, {
        name: 'comment',
        type: 'string'
    }]
});