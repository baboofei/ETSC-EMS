Ext.define('EIM.store.dict.QuoteLanguages', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.QuoteLanguage',

    autoLoad:false,

    proxy:{
        url:'servlet/DictionaryServlet?dictionaries_type=quote_language',
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