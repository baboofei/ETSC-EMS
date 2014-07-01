/**
 * 商务相关单位store
 */
Ext.define('EIM.store.BusinessUnits', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.BusinessUnit',

    autoLoad: false,

    proxy: {
        url: 'business_units/get_combo_business_units/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'business_units',
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