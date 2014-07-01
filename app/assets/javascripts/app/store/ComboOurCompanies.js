/**
 * 卖方公司的combo store
 */
Ext.define('EIM.store.ComboOurCompanies', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ComboOurCompany',

    autoLoad: false,

    proxy: {
        url: '',//our_companies/get_combo_our_companies/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'our_companies',
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