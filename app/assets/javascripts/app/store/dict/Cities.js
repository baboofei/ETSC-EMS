/*
城市的输入过滤下拉框用到的store
 */

Ext.define('EIM.store.dict.Cities', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.dict.City',

    autoLoad: false,

    proxy: {
        url: 'cities/get_cities/list.json',
        type: 'ajax',
//        format: 'json',
        method: 'GET',
        reader: {
            type: 'json',
            root: 'cities',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});