/**
 * 拆开后单独加载“拆分”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.SplitForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'AdminInventorySNs'
    ],
    models: [
//        'AdminInventorySN'
    ],

    views: [
        'admin_inventory.SplitForm'
    ],

    //    refs: [{
    //        ref: 'list',
    //        selector: 'recommended_item_grid'
    //    }],

    init: function() {
        var me = this;

        me.control({
            'admin_inventory_split_form button[action=save]': {
                click: function(button) {
                    var win = button.up('window');
                    var form = win.down('form', false);
                    var split_field = form.down('numberfield', false);
                    var split_number = split_field.getValue();

                    var dragged_array = me.getController('AdminInventories').tempDraggedArray;
                    var source_grid = Ext.ComponentQuery.query('admin_inventory_grid[name=source_grid]')[0];
                    var source_store = source_grid.getStore();
                    var target_grid = Ext.ComponentQuery.query('admin_inventory_grid[name=target_grid]')[0];
                    var target_store = target_grid.getStore();
                    if(dragged_array.join("") === "") {
                        //无可拖的，则提示
                        Ext.example.msg('错误', '你选中的物品中没有可出库的，请检查后再选。')
                    } else {
                        //把“抓着的”数据一条条对比往下面的grid里加
                        for(var i = 0; i < dragged_array.length; i ++) {
                            //如果下面的grid里有internalId一样的，不加记录数，只加数量
                            var existed = false;
                            for(var j = 0; j < target_store.count(); j ++) {
                                if(target_store.getAt(j).data.id === dragged_array[i].data.id) {
                                    existed = true;
                                    var min_quantity = Ext.min([source_store.getById(dragged_array[i]['data']['id'])['data']['current_quantity'], split_number]);
                                    target_store.getAt(j).set('current_quantity', target_store.getAt(j)['data']['current_quantity'] + min_quantity);
                                    break;
                                }
                            }
                            if(!existed) {
                                var dragged_single_data = dragged_array[i];

                                var new_model = Ext.create('EIM.model.GridAdminInventory', dragged_single_data['data']);
                                //如果实际数量小于拖时的设定数量（另有多的“撑”着，所以输入是合法的）
                                var actually_quantity = Ext.min([new_model['data']['current_quantity'], split_number]);
                                new_model['data']['current_quantity'] = actually_quantity;
                                new_model['internalId'] = new_model['data']['id'];
                                //序列号和编号先不管了，实际出的时候再操作

                                target_store.add(new_model);
                            }
                            for(var j = 0; j < source_store.count(); j ++) {
                                //source_grid里的数量要相应减去
                                if(source_store.getAt(j).data.id === dragged_array[i].data.id) {
                                    var remain_number = source_store.getAt(j)['data']['current_quantity'] - split_number;
                                    if(remain_number <= 0) {
                                        source_store.remove(source_store.getAt(j));
                                    } else {
                                        source_store.getAt(j).set('current_quantity', remain_number);
                                    }
                                }
                            }
                            continue;
                        }

                    }
                    win.close();
                    me.getController('AdminInventories').checkTargetGrid();
                }
            }
        });
    }
});