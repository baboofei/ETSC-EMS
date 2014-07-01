/**
 * 用于寄快递的客户store
 */
Ext.define('EIM.store.ExpressCustomers', {
    extend:'Ext.data.Store',
    model:'EIM.model.ExpressCustomer',

    autoLoad: true,

    proxy:{
        url:'servlet/CustomerServlet', //TODO 要改的……
        type:'ajax',
        format:'json',
        method:'GET',
        reader:{
            root:'customers',
            successProperty:'success',
            totalProperty:'totalRecords'
        },
        writer:{
            getRecordData:function (record) {
                return {user:record.data}
            }
        }
    }
});