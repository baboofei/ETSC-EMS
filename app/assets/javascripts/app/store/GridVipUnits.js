/**
 * “VIP单位管理”表格里用到的VIP单位store
 */
Ext.define('EIM.store.GridVipUnits', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridVipUnit',

    autoLoad: true,

    proxy: {
        url: 'vip_units/get_grid_vip_units/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'vip_units',
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