/**
 * “公共单位管理”表格里用到的公共单位store
 */
Ext.define('EIM.store.GridPopUnits', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridPopUnit',

    autoLoad: true,

    proxy: {
        url: 'pop_units/get_grid_pop_units/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'pop_units',
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