Ext.define('EIM.controller.service_log.CalibrateOrDebug', {
    extend: 'Ext.app.Controller',

    stores: [
//        'dict.SalecaseCancelReasons'
    ],
    models: [
//        'GridServiceLogInsertion'
    ],

    views: [
        'service_log.CalibrateOrDebugForm'/*,
        'service_log.SelectInsertLocationForm'*/
//        'salelog.QuoteTab',
//        'salelog.QuotedItemGrid',
//        'salelog.NewQuoteForm',
//        'salelog.QuoteItemForm'
    ],

//    refs: [{
//        ref: 'grid',
//        selector: 'salelog_quote_grid'
//    }],

    init: function() {
        var me = this;

        me.control({
            'service_log_calibrate_or_debug_form button[action=save]': {
                click: this.submit
            }
        });
    },

    submit: function(button) {
        var me = this;
        var win = button.up('window');
        var form = win.down('form', false);

        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: 'service_logs/add_service_log',
                params: {
                    "type": "calibrate_or_debug"
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);

                    var grid = Ext.ComponentQuery.query('flow_sheet_grid')[0];
                    var last_selected = grid.getSelectedItem();
                    grid.getStore().load({
                        callback: function() {
                            var rowIndex = this.find('id', last_selected.getId(), 0, false, false, true);
                            grid.getView().select(rowIndex);
                        }
                    });
                },
                failure: function(the_form, action) {
                    //TODO 可以用Ext.JSON.decode()来写，有空改
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
//                    console.log(msg['dup_log_list'].substring(1, msg['dup_log_list'].length - 1));
//                    console.log(msg['to_be_inserted']);
//                    console.log(typeof(eval(msg.to_be_inserted.replace(/=>/g, ":"))));

                    var dup_log_list_array = msg['dup_log_list'].substring(1, msg['dup_log_list'].length - 1).split("}, {");
                    var dup_log_list_obj_array = [];
                    Ext.Array.each(dup_log_list_array, function(item, index, array) {
                        var str = item.replace("{", "").replace("}", "");
                        var dup_log_info_array = str.split(", ");
                        var dup_log_info_obj = {};
                        Ext.Array.each(dup_log_info_array, function(info_item) {
//                            console.log(info_item);
                            var info_str = info_item.replace(/"/g, "");
                            dup_log_info_obj[info_str.split("=>")[0]] = info_str.split("=>")[1].replace(/"/g, "");
                        });
                        dup_log_list_obj_array.push(dup_log_info_obj);
                    });


                    var to_be_inserted_array = msg['to_be_inserted'].split(", ");
                    var to_be_inserted_obj = {};
                    Ext.Array.each(to_be_inserted_array, function(item, index, array) {
                        var str = item.replace("{", "").replace("}", "").replace(/"/g, "").replace(/:/, "");
                        to_be_inserted_obj[str.split("=>")[0]] = str.split("=>")[1];
                    });
//                    console.log(to_be_inserted_obj);
                    load_uniq_controller(me, 'service_log.SelectInsertLocationForm');
                    Ext.widget('service_log_select_insert_location_form').show('', function() {
//                        console.log(Ext.ComponentQuery.query('grid[name=to_be_inserted]')[0]);
//                        console.log(Ext.ComponentQuery.query('grid[name=to_be_inserted]')[0].getStore());
                        Ext.ComponentQuery.query('grid[name=to_be_inserted]')[0].getStore().loadData([to_be_inserted_obj]);
                        Ext.ComponentQuery.query('grid[name=insert_location]')[0].getStore().loadData(dup_log_list_obj_array);
                    });
                }
            });
        }
    }
});