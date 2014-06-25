Ext.define('EIM.store.dict.Expresses', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.dict.Express',

    autoLoad: false,

    proxy: {
        url: 'servlet/DictionaryServlet?dictionaries_type=express',
        type: 'ajax',
//        format: 'json',
        method: 'GET',
        reader: {
            type: 'json',
            root: 'dictionary',
            successProperty: 'success'
        }
    }
//    data: {
//        expresses: [{
//            id: 1,
//            name: '顺丰',
//            phoneNumber: '555 1234'
//        }, {
//            id: 2,
//            name: '天天',
//            phoneNumber: '666 1234'
//        }]
//    },
//    proxy: {
//        type: 'memory',
//        reader: {
//            type: 'json',
//            root: 'expresses'
//        }
//    }
});