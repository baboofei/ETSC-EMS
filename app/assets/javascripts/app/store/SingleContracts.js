/**
 * 单条合同store，审批窗口专用
 */
Ext.define('EIM.store.SingleContracts', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.Contract',

    autoLoad: false,

    proxy: {
        url: 'contracts/get_single_contracts/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'contracts',
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