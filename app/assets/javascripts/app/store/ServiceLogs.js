/**
 * 工作日志的列表store
 */
Ext.define('EIM.store.ServiceLogs', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ServiceLog',

    autoLoad: false,

    proxy: {
        type: 'ajax',
        url: 'service_logs/get_service_logs/list.json',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'service_logs',
            successProperty: 'success',
            totalProperty:'totalRecords'
        },
        writer: {
            getRecordData: function(record){
                return {user: record.data}
            }
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
            var flow_sheet_grid = Ext.ComponentQuery.query('flow_sheet_grid')[0];
            var selected_item = flow_sheet_grid.getSelectedItem();
            if(selected_item) {
                var selected_id = selected_item.get("id");
                this.proxy.setExtraParam('flow_sheet_id', selected_id);
            }
        }
    }
});