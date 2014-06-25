/**
 * 弹出的和收件人对应的临时快递单表格里用到的快递单store
 */
Ext.define('EIM.store.TempGridExpressPeople', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.TempGridExpressPerson',

//    autoLoad: true,
//    remoteSort: true,

    proxy: {
        url: '',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'express_sheets',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});