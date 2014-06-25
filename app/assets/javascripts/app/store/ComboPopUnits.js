/**
 * 这个是公共单位的store，用于combo中
 */
Ext.define('EIM.store.ComboPopUnits', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ComboPopUnit',

    autoLoad: false,

    proxy: {
        url: 'pop_units/get_combo_pop_units/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'pop_units',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});