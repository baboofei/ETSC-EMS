Ext.define('EIM.model.GridExpressSheet', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'express_unit_id',
            type: 'int'
        },
        {
            name: 'express_unit_name',
            type: 'string'
        },
        {
            name: 'number',
            type: 'string'
        },
        {
            name: 'sender>id',
            type: 'int'
        },
        {
            name: 'sender>name',
//            name: 'express_sheet_unit>express_sheet_unit_aliases>unit_alias',
            type: 'string'
        },
//        {
//            name: 'receiver_unit_id',
//            type: 'int'
//        },
        {
            name: '^unit_receivable>(name|unit_aliases>unit_alias)',
//            name: 'unit_receivable>(vendor_unit#customer_unit#pop_unit#business_unit)>(name|unit_aliases>unit_alias)',
            type: 'string'
        },
//        {
//            name: 'receiver_id',
//            type: 'int'
//        },
        {
            name: '^person_receivable>(name|en_name)',
            type: 'string'
        },
        {
            name: '^vestable>(number)',
            type: 'string'
        },
        {
            name: 'currency_id',
            type: 'int'
        },
        {
            name: 'currency_name',
            type: 'string'
        },
        {
            name: 'cost',
            type: 'float'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'created_at',
            type: 'date'
        },
        {
            name: 'pdf_url',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'string'
        },
        {
            name: 'user_id',
            type: 'int'
        },
        {
            name: 'user_name',
            type: 'string'
        },
        {
            name: 'editable',
            type: 'boolean'
        }
    ]
});