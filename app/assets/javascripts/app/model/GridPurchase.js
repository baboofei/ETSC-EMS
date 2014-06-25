Ext.define('EIM.model.GridPurchase', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'contract_project',
            type: 'string'
        },
        {
            name: 'contract_number',
            type: 'string'
        },
        {
            name: 'sign_at',
            type: 'date'
        },
        {
            name: 'seller',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'model',
            type: 'string'
        },
        {
            name: 'quantity',
            type: 'int'
        },
        {
            name: 'first_quoted',
            type: 'float'
        },
        {
            name: 'unit_price',
            type: 'float'
        },
        {
            name: 'price',
            type: 'float'
        },
        {
            name: 'discount',
            type: 'float'
        },
        {
            name: 'invoice',
            type: 'string'
        },
        {
            name: 'pay_method',
            type: 'string'
        },
        {
            name: 'expected_pay_at',
            type: 'date'
        },
        {
            name: 'pay_status',
            type: 'string'
        },
        {
            name: 'invoice_status',
            type: 'string'
        },
        {
            name: 'warranty',
            type: 'string'
        },
        {
            name: 'expected_deliver_at',
            type: 'date'
        },
        {
            name: 'actually_deliver_at',
            type: 'date'
        },
        {
            name: 'deliver_place',
            type: 'string'
        },
        {
            name: 'vendor_unit',
            type: 'string'
        },
        {
            name: 'end_user',
            type: 'string'
        },
        {
            name: 'user',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'string'
        }
    ]
});