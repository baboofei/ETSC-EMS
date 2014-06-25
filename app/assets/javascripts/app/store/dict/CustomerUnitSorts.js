Ext.define('EIM.store.dict.CustomerUnitSorts', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.dict.CustomerUnitSort',

    autoLoad: false,

    proxy: {
        url: 'servlet/DictionaryServlet?dictionaries_type=unit_properties',
        type: 'ajax',
//        format: 'json',
        method: 'GET',
        reader: {
            type: 'json',
            root: 'dictionary',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});