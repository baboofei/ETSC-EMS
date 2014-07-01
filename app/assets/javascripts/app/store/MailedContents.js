/**
 * 寄目录store
 */
Ext.define('EIM.store.MailedContents', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.MailedContent',

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