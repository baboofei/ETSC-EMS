/**
 * 个案中涉及的客户和客户单位列表
 */
Ext.define('EIM.store.ServiceMiniCustomers', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ServiceMiniCustomer',

    autoLoad: false,

    proxy: {
        url: 'customers/get_service_mini_customers/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'service_mini_customers',
            successProperty: 'success'
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