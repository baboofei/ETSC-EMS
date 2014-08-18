Ext.define('EIM.model.Contract', {
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
            name: 'customer_number',
            type: 'string'
        },
        {
            name: 'quote>number',
            type: 'string'
        },
        {
            name: 'summary',
            type: 'string'
        },
        {
            name: 'signer_user_id',
            type: 'int'
        },
        {
            name: 'signer>name',
            type: 'string'
        },
        {
            name: 'dealer_user_id',
            type: 'int'
        },
        {
            name: 'dealer>name',
            type: 'string'
        },
        {
            name: 'customer_unit>id',
            type: 'int'
        },
        {
            name: 'customer_unit>(name|unit_aliases>unit_alias|en_name)',
            type: 'string'
        },
        {
            name: 'end_user_customer_id',
            type: 'int'
        },
        {
            name: 'end_user>(name|en_name)',
            type: 'string'
        },
        {
            name: 'end_user>phone',
            type: 'string'
        },
        {
            name: 'end_user>mobile',
            type: 'string'
        },
        {
            name: 'buyer_customer_id',
            type: 'int'
        },
        {
            name: 'buyer>(name|en_name)',
            type: 'string'
        },
        {
            name: 'buyer>phone',
            type: 'string'
        },
        {
            name: 'buyer>mobile',
            type: 'string'
        },
        {
            name: 'business_unit_id',
            type: 'int'
        },
        {
            name: 'business_unit>name',
            type: 'string'
        },
        {
            name: 'business_contact_id',
            type: 'int'
        },
        {
            name: 'business_contact>(name|en_name)',
            type: 'string'
        },
        {
            name: 'business_contact>phone',
            type: 'string'
        },
        {
            name: 'business_contact>mobile',
            type: 'string'
        },
        {
            name: 'our_company_id',
            type: 'int'
        },
        {
            name: 'our_company>name',
            type: 'string'
        },
        {
            name: 'requirement_id',
            type: 'string'
        },
        {
            name: 'currency_id',
            type: 'int'
        },
        {
            name: 'state',
            type: 'string'
        },
        {
            name: 'sum',
            type: 'float'
        },
        {
            name: 'exchange_rate',
            type: 'float'
        },
        {
            name: 'rmb',
            type: 'float'
        },
        {
            name: 'pay_mode_id',
            type: 'int'
        },
        {
            name: 'pay_mode>name',
            type: 'string'
        },
        {
            name: 'does_need_install',
            type: 'boolean'
        },
        {
            name: 'does_need_lc',
            type: 'boolean'
        },
        {
            name: 'lc_number',
            type: 'string'
        },
        {
            name: 'receive_lc_at',
            type: 'date'
        },
        {
            name: 'invoice',
            type: 'string'
        },
        {
            name: 'profit',
            type: 'float'
        },
        {
            name: 'total_collection',
            type: 'float'
        },
        {
            name: 'comment',
            type: 'string'
        },
        {
            name: 'quote_id',
            type: 'int'
        },
        {
            name: 'quote>number',
            type: 'string'
        },
        {
            name: 'contract_items>purchase_order>number',
            type: 'string'
        },
        {
            name: 'salelog_id',
            type: 'int'
        },
        {
            name: 'group_id',
            type: 'int'
        },
        {
            name: 'contract_type',
            type: 'string'
        },
        {
            name: 'signed_at',
            type: 'date'
        },
        {
            name: 'invoiced_at',
            type: 'date'
        },
        {
            name: 'editable',
            type: 'boolean'
        }
    ]
});