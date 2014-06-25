/**
 * 在合同中选择报价的下拉列表用的store
 * 和报价本身列表中的不能用同一个，因为会有各种参数的过滤以及自定义添加内容
 */
Ext.define('EIM.store.ComboContractQuotes', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ComboContractQuote',

    autoLoad: true,

    proxy: {
        type: 'ajax',
        url: 'quotes/get_combo_quotes/list.json',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'quotes',
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