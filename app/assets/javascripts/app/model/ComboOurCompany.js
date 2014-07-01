Ext.define('EIM.model.ComboOurCompany', {
    extend:'Ext.data.Model',
    fields:[
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
        }
    ]
});