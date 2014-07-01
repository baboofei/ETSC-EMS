/**
 * 销售store
 */
Ext.define('EIM.store.ComboSales', {
    extend:'Ext.data.Store',
    model:'EIM.model.ComboSale',

    autoLoad:false,

    proxy:{
        url:'servlet/QuoteServlet?type=engineer',
        type:'ajax',
        format:'json',
        method:'GET',
        reader:{
            root:'sales',
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