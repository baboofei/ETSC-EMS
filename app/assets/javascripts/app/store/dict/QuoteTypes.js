Ext.define('EIM.store.dict.QuoteTypes', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.QuoteType',

    autoLoad:false,

    proxy:{
        url:'servlet/DictionaryServlet?dictionaries_type=quote_type',
        type:'ajax',
//        format: 'json',
        method:'GET',
        reader:{
            type:'json',
            root:'dictionary',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    }
});