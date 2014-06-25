Ext.define('EIM.store.dict.SalelogProcesses', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.dict.SalelogProcess',

    autoLoad: false,

    proxy: {
        url: 'servlet/DictionaryServlet?dictionaries_type=salse_processes',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
//            type: 'json',
            root: 'dictionary',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});