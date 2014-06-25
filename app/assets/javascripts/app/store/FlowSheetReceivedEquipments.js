/**
 * TSD水单中涉及的到货清单store
 */
Ext.define('EIM.store.FlowSheetReceivedEquipments', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.FlowSheetReceivedEquipment',

    autoLoad: false,

    proxy: {
        url: 'received_equipments/get_grid_received_equipments/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'received_equipments',
            successProperty: 'success'
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