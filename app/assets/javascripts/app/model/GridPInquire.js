Ext.define('EIM.model.GridPInquire', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'id',
            type: 'int'
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'en_name',
            type: 'string'
        }, {
            name: 'customer_unit_name',
            type: 'string'
        }, {
            name: 'email',
            type: 'string'
        }, {
            name: 'mobile',
            type: 'string'
        }, {
            name: 'phone',
            type: 'string'
        }, {
            name: 'fax',
            type: 'string'
        }, {
            name: 'im',
            type: 'string'
        }, {
            name: 'department',
            type: 'string'
        }, {
            name: 'position',
            type: 'string'
        }, {
            name: 'addr',
            type: 'string'
        }, {
            name: 'postcode',
            type: 'string'
        }, {
            name: 'en_addr',
            type: 'string'
        }, {
            name: 'comment',
            type: 'string'
        },
        //        {
        //            name: 'transferred',
        //            type: 'boolean'
        //        },
        {
            name: 'vendor_unit_id',
            type: 'string'
        }, {
            name: 'editable',
            type: 'boolean'
        }
    ]
});