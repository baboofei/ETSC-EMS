/**
 * 选择个案的下拉列表用的store
 * 和个案列表中的不能用同一个，因为会有各种参数的过滤以及自定义添加内容
 */
Ext.define('EIM.store.ComboSalecases', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ComboSalecase',

    autoLoad: true,

    proxy: {
        type: 'ajax',
        url: 'salecases/get_combo_salecases/list.json',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'salecases',
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