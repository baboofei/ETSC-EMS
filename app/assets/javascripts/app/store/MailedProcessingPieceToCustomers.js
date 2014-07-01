/**
 * 寄加工件（往客户）的store
 */
Ext.define('EIM.store.MailedProcessingPieceToCustomers', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.MailedProcessingPieceToCustomer',

    autoLoad: false,

    proxy: {
        type: 'ajax',
        url: '',//users/fake_for_salecase',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'salecases',
            successProperty: 'success',
            totalProperty:'totalRecords'
        },
        writer: {
            getRecordData: function(record){
                return {user: record.data}
            }
        }
    }
});