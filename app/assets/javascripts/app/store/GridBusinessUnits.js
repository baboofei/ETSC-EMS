/**
 * “商务相关单位管理”表格里用到的商务相关单位store
 */
Ext.define('EIM.store.GridBusinessUnits', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridBusinessUnit',

    autoLoad: true,

    proxy: {
        url: 'business_units/get_grid_business_units/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'business_units',
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