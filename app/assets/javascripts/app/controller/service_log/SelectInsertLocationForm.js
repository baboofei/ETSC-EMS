Ext.define('EIM.controller.service_log.SelectInsertLocationForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'dict.SalecaseCancelReasons'
    ],
    models: [
        'GridServiceLogInsertion'
    ],

    views: [
//        'service_log.ConfirmQuitForm',
        'service_log.SelectInsertLocationForm'
//        'salelog.QuoteTab',
//        'salelog.QuotedItemGrid',
//        'salelog.NewQuoteForm',
//        'salelog.QuoteItemForm'
    ],

    refs: [
        {
            ref: 'sourceGrid',
            selector: 'service_log_select_insert_location_form grid[name=to_be_inserted]'
        },
        {
            ref: 'targetGrid',
            selector: 'service_log_select_insert_location_form grid[name=insert_location]'
        }
    ],

    init: function() {
        var me = this;

        me.control({
            'service_log_select_insert_location_form grid[name=insert_location] dataview': {
                beforedrop: this.sourceDropFilter
            },
            'service_log_select_insert_location_form button[action=save]': {
                click: this.submit
            }
        });
    },

    /**
     * 只能拖动从上面拖下来的那一条记录，以防拖乱
     * @param node
     * @param data
     * @return {Boolean}
     */
    sourceDropFilter: function(node, data) {
        if(data.records[0].get("id") != 0) {
            return false;
        }
    },

    submit: function(button) {
        var me = this;
        var win = button.up('window');

        if(this.getSourceGrid().getStore().count() != 0) {
            Ext.example.msg("错误", "你还没有把新增的日志拖到正确的时间点上！");
        } else {
            //防双击
            button.disable();

            var grid_data = Ext.encode(Ext.pluck(this.getTargetGrid().getStore().data.items, "data"));
            var service_log_cache = Ext.ComponentQuery.query('functree')[0].serviceLogCache;
            var ajax_params;
            console.log(service_log_cache);
            if(service_log_cache['change_parts']) {
                ajax_params = {
                    "grid_data": grid_data,
                    "service_log_cache": Ext.encode(service_log_cache)
                };
                Ext.ComponentQuery.query('functree')[0].serviceLogCache = null;
            } else if(service_log_cache['add_equipment']) {
                ajax_params = {
                    "grid_data": grid_data,
                    "service_log_cache": Ext.encode(service_log_cache)
                };
                Ext.ComponentQuery.query('functree')[0].serviceLogCache = null;
            } else if(service_log_cache['delete_equipment']) {
                ajax_params = {
                    "grid_data": grid_data,
                    "service_log_cache": Ext.encode(service_log_cache)
                };
                Ext.ComponentQuery.query('functree')[0].serviceLogCache = null;
            } else if(service_log_cache['package_equipment']) {
                ajax_params = {
                    "grid_data": grid_data,
                    "service_log_cache": Ext.encode(service_log_cache)
                };
                Ext.ComponentQuery.query('functree')[0].serviceLogCache = null;
            } else if(service_log_cache['return_equipment']) {
                ajax_params = {
                    "grid_data": grid_data,
                    "service_log_cache": Ext.encode(service_log_cache)
                };
                Ext.ComponentQuery.query('functree')[0].serviceLogCache = null;
            } else if(service_log_cache['receive_equipment']) {
                ajax_params = {
                    "grid_data": grid_data,
                    "service_log_cache": Ext.encode(service_log_cache)
                };
                Ext.ComponentQuery.query('functree')[0].serviceLogCache = null;
            } else if(service_log_cache['deliver_equipment']) {
                ajax_params = {
                    "grid_data": grid_data,
                    "service_log_cache": Ext.encode(service_log_cache)
                };
                Ext.ComponentQuery.query('functree')[0].serviceLogCache = null;
            } else {
                ajax_params = {
                    "grid_data": grid_data
                };
            }

            Ext.Ajax.request({
                url: 'service_logs/insert_service_log',
                params: ajax_params,
                success: function(response) {
                    var msg = Ext.decode(response.responseText);
                    console.log(response);
                    console.log(response.responseText);
                    console.log(msg);
                    Ext.example.msg('成功', msg.message);
                    win.close();

                    var grid = Ext.ComponentQuery.query('flow_sheet_grid')[0];
                    var last_selected = grid.getSelectedItem();
                    grid.getStore().load({
                        callback: function() {
                            var rowIndex = this.find('id', last_selected.getId(), 0, false, false, true);
                            grid.getView().select(rowIndex);
                        }
                    });
                },
                failure: function() {
                }
            });
        }
    }
});