Ext.define('EIM.model.FunctionPrivilege', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'visible_to_ids',
        type: 'string'
    }, {
        name: 'visible_to_names',
        type: 'string'
    }]
});