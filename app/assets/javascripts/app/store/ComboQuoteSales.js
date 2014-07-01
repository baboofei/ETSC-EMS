/**
 * 报价的时候能选的销售store
 * 对销售来说是自己或者下级（看配置的时候怎么配了）
 * 对商务来说是全部销售
 */
Ext.define('EIM.store.ComboQuoteSales', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ComboQuoteSale',

    autoLoad: true,

    proxy: {
        url: 'users/get_combo_quote_sales/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'quote_sales',
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