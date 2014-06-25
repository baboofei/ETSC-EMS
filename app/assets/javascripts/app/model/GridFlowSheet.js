Ext.define('EIM.model.GridFlowSheet', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'number',
            type: 'string'
        },
        {
            name: 'created_at',
            type: 'date'
        },
        {
            name: 'flow_sheet_type',
            type: 'string'
        },
        {
            name: 'users>id',
            type: 'string'
        },
        {
            name: 'users>name',
            type: 'string'
        },
        {
            name: 'customers>(name|en_name)',
            type: 'string'
        },
        {
            name: 'customers>id',
            type: 'string'
        },
        {
            name: 'customer_units>(name|en_name|unit_aliases>unit_alias)',
            type: 'string'
        },
        {
            name: 'customer_units>id',
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
            name: 'priority',
            type: 'string'
        },
        {
            name: 'deal_requirement',
            type: 'string'
        },
        {
            name: 'deliver_by',
            type: 'string'
        },
        {
            name: 'is_in_warranty',
            type: 'string'
        },
        {
            name:'contract>number',
            type: 'string'
        },
        {
            name:'contract>id',
            type: 'int'
        },
        {
            name: 'comment',
            type: 'string'
        }
    ]
});