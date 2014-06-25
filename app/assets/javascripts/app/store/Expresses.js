Ext.define('EIM.store.Expresses', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.Express',

    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'servlet/DictionaryServlet?dictionaries_type=express',//TODO 要改
        format: 'json',
        method: 'GET',
        reader: {
            root: 'dictionary',
            successProperty: 'success'
        },
        writer: {
            getRecordData: function(record){
                return {user: record.data}
            }
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