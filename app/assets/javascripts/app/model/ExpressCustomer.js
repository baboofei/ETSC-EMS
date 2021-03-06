Ext.define('EIM.model.ExpressCustomer', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'customer_unit_name',
        type: 'string'
    }, {
        name: 'cu_sort',
        type: 'int'
    }, {
        name: 'city_id',
        type: 'int'
    }, {
        name: 'city_name',
        type: 'string'
    }, {
        name: 'area_id',
        type: 'int'
    }, {
        name: 'area_name',
        type: 'string'
    }, {
        name: 'phone',
        type: 'string'
    }, {
        name: 'mobile',
        type: 'string'
    }, {
        name: 'addr',
        type: 'string'
    }, {
        name: 'application_ids',
        type: 'string'
    }, {
        name: 'application_names',
        type: 'string'
    }, {
        name: 'comment',
        type: 'string'
    }]
});