Ext.define('EIM.model.RealExchangeRate', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'date',
            type: 'date'
        },
        {
            name: 'eur',
            type: 'float'
        },
        {
            name: 'gbp',
            type: 'float'
        },
        {
            name: 'usd',
            type: 'float'
        },
        {
            name: 'cad',
            type: 'float'
        },
        {
            name: 'jpy',
            type: 'float'
        },
        {
            name: 'hkd',
            type: 'float'
        },
        {
            name: 'ntd',
            type: 'float'
        }
    ]
});
