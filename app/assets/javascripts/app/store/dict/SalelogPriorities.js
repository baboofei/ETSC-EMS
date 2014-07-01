Ext.define('EIM.store.dict.SalelogPriorities', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.dict.SalelogPriority',

    autoLoad: false,

    proxy: {
        url: 'servlet/DictionaryServlet?dictionaries_type=salse_priority',//要改
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
//            type: 'json',
            root: 'dictionary',
            successProperty: 'success'
        }
    }
});