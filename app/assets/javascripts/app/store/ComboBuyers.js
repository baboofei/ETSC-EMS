/**
 * 采购store
 */
Ext.define('EIM.store.ComboBuyers', {
    extend:'Ext.data.Store',
    model:'EIM.model.ComboBuyer',

    autoLoad:false,

    proxy:{
        url:'servlet/QuoteServlet?type=buyer',
        type:'ajax',
        format:'json',
        method:'GET',
        reader:{
            root:'buyers',
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