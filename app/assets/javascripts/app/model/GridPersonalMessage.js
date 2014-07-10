Ext.define('EIM.model.GridPersonalMessage', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'sender>name',
        type: 'string'
    }, {
        name: 'sender>id',
        type: 'int'
    }, {
        name: 'content',
        type: 'string'
    }, {
        name: 'send_at',
        type: 'date'
    }, {
        name: 'flag',
        type: 'boolean'
    }]
});