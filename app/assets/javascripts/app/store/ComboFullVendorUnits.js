/**
 * 这个是生产厂家的store，带全部的数据
 * 用于新增/修改供应商信息的表单中的选“上级单位”的combo
 */
Ext.define('EIM.store.ComboFullVendorUnits', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ComboFullVendorUnit',

    autoLoad: false,

    proxy: {
        url: 'vendor_units/get_full_combo_vendor_units/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'vendor_units',
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