/**
 * 商务相关联系人store
 */
Ext.define('EIM.store.BusinessContacts', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.BusinessContact',

    autoLoad: false,

    proxy: {
        url: 'business_contacts/get_combo_business_contacts/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'business_contacts',
            successProperty: 'success',
            totalProperty: 'totalRecords'
        },
        writer: {
            getRecordData: function(record) {
                return {user: record.data}
            }
        }
    }
});