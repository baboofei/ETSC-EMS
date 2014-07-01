Ext.define('EIM.model.dict.OurCompany', {
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
            name: 'en_name',
            type: 'string'
        },
        {
            name: 'bank_info',
            type: 'string'
        },
        {
            name: 'vat_info',
            type: 'string'
        }
    ]
});
