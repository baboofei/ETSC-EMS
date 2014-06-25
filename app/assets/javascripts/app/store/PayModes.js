/**
 * 这个是付款方式的store，要取的JSON值见model\PayMode
 */
Ext.define('EIM.store.PayModes', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.PayMode',

    autoLoad: false,

    proxy: {
        url: 'pay_modes/get_combo_pay_modes/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'pay_modes',
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