/**
 * 空的“商务相关联系人管理”表格里用到的商务相关联系人store，用来放“待操作商务相关联系人”
 */
Ext.define('EIM.store.EmptyGridBusinessContacts', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridBusinessContact',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: '',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'business_contacts',
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