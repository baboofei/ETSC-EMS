Ext.define('EIM.store.dict.QuoteFormats', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.QuoteFormat',

    autoLoad:false,

    proxy:{
        url:'servlet/DictionaryServlet?dictionaries_type=quote_form',
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