Ext.define('EIM.model.GridContractMiniCustomer', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'vendor_unit_id',
            type: 'int'
        },
        {
            name: 'vendor_unit_name',
            type: 'string'
        },
        {
            name: 'contract_id',
            type: 'int'
        },
        {
            name: 'product_id',
            type: 'int'
        },
        {
            name: 'product>model',
            type: 'string'
        },
        {
            name: 'serial_number',
            type: 'string'
        },
        {
            name: 'quantity',
            type: 'int'
        },
        {
            name: 'purchase_order_id',
            type: 'int'
        },
        {
            name: 'purchase_order>number',
            type: 'string'
        },
        {
            name: 'send_status',
            type: 'string'
        },
        {
            name: 'expected_leave_factory_at',
            type: 'date'
        },
        {
            name: 'appointed_leave_factory_at',
            type: 'date'
        },
        {
            name: 'actually_leave_factory_at',
            type: 'date'
        },
        {
            name: 'leave_etsc_at',
            type: 'date'
        },
        {
            name: 'reach_customer_at',
            type: 'date'
        },
        {
            name: 'check_and_accept_status',
            type: 'string'
        },
        {
            name: 'check_and_accept_at',
            type: 'date'
        },
        {
            name: 'warranty_term_id',
            type: 'int'
        },
        {
            name: 'warranty_term>name',
            type: 'string'
        }
    ]
});