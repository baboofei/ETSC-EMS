/**
 * 寄加工件（往工厂）的store
 */
Ext.define('EIM.store.MailedProcessingPieceToVendors', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.MailedProcessingPieceToVendor',

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