Ext.define('EIM.model.AllDict', {
    extend:'Ext.data.Model',
    fields:[
        {
            name:'id',
            type:'int'
        },
        {
            name:'data_type',
            type:'string'
        },
        {
            name:'display',
            type:'string'
        },
        {
            name: 'value',
            type: 'string'
        },
        {
            name: 'available',
            type: 'boolean'
        }
    ]
});