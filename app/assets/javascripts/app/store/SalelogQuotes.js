/**
 * 某报价下报价的store
 * 报价=Q1200586
 * 报价项=xx产品##个
 */
Ext.define('EIM.store.SalelogQuotes', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.SalelogQuote',

    autoLoad: false,

    proxy: {
        type: 'ajax',
        url: '/users/fake_for_salecase',
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