Ext.define('EIM.model.dict.Lead', {
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
            name:'description',
            type:'string'
        }
    ]
});
