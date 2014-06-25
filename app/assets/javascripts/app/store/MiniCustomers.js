/**
 * 个案中涉及的客户和客户单位列表
 */
Ext.define('EIM.store.MiniCustomers', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.MiniCustomer',

    autoLoad: false,

    proxy: {
        url: 'customers/get_mini_customers/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'mini_customers',
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
            var salecase_grid = Ext.ComponentQuery.query('salecase_grid')[0];
            var selected_item = salecase_grid.getSelectedItem();
            if(selected_item) {
                var selected_id = selected_item.get("id");
                this.proxy.setExtraParam('salecase_id', selected_id);
            }
        }
    }
});