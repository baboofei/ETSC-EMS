Ext.define('EIM.store.dict.SalecaseWaitReasons', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.dict.SalecaseWaitReason',

    autoLoad: false,

    proxy: {
        url: 'servlet/DictionaryServlet?dictionaries_type=wait_reason',
        type: 'ajax',
//        format: 'json',
        method: 'GET',
        reader: {
            type: 'json',
            root: 'dictionary',
            successProperty: 'success'
        }
    }
});