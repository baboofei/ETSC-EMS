/**
 * “商务相关联系人管理”表格里用到的商务相关联系人store
 */
Ext.define('EIM.store.GridBusinessContacts', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridBusinessContact',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'business_contacts/get_grid_business_contacts/list.json',
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