/**
 * 这个是VIP单位的store，用于combo中
 */
Ext.define('EIM.store.ComboVipUnits', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ComboVipUnit',

    autoLoad: false,

    proxy: {
        url: 'vip_units/get_combo_vip_units/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'vip_units',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});