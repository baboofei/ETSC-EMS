/**
 * 寄样品的store
 */
Ext.define('EIM.store.MailedSamples', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.MailedSample',

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