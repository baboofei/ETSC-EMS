Ext.define('EIM.model.dict.Currency', {
    extend:'Ext.data.Model',
    fields:[
        {
            name:'id',
            type:'int'
        },
        {
            name:'name',
            type:'string'
        },
        {
            name: 'exchange_rate',
            type: 'float'
        }
    ]
});
