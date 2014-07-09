Ext.define('EIM.model.Salelog', {
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
        name: 'created_at',
        type: 'date'
    }, {
        name: 'contact_at',
        type: 'date'
    }, {
        name: 'comment',
        type: 'string'
    }]
});