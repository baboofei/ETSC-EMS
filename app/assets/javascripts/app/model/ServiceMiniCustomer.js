Ext.define('EIM.model.ServiceMiniCustomer', {
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
            name: 'customer_unit>name',
            type: 'string'
        },
        {
            name: 'phone',
            type: 'string'
        },
        {
            name: 'mobile',
            type: 'string'
        },
        {
            name: 'email',
            type: 'string'
        },
        {
            name: 'fax',
            type: 'string'
        }
    ]
});