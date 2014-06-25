/**
 * 客户单位的输入过滤下拉框用到的store，因为历史遗留原因没有加上combo
 * TODO
 */
Ext.define('EIM.store.CustomerUnits', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.CustomerUnit',

    autoLoad: false,

    proxy: {
        url: 'customer_units/get_combo_customer_units/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'customer_units',
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