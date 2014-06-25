Ext.define('EIM.controller.contract.ItemForm', {
    extend:'Ext.app.Controller',

    stores:[
        'dict.SendStatuses',
        'dict.CheckAndAcceptStatuses',
        'Terms'
    ],
    models:[
        'dict.SendStatus',
        'dict.CheckAndAcceptStatus',
        'Term'
    ],

    views:[
        'contract.ItemForm'
    ],

//    refs:[
//        {
//            //            ref:'grid',
//            //            selector:'recommended_item_grid'
//            //                }, {
//            //            ref: 'form',
//            //            selector: 'contract_item_form'
//            //    }, {
//            //        ref: 'btnCreate',
//            //        selector: 'recommend_item_form button[action=create]'
//            //    }, {
//            //        ref: 'btnUpdate',
//            //        selector: 'recommend_item_form button[action=update]'
//        }
//    ],

    init:function () {
        var me = this;

        me.control({
            'contract_item_form': {
                show: this.resetProductStore
            },
            'contract_item_form button[action=save]': {
                click: this.validate
            },
            'contract_item_form button[action=save_apply]': {
                click: this.validate
            },
            'contract_item_form button[action=update]': {
                click: this.validate
            }
        });
    },

    /**
     * 打开窗口时，把产品combo里带的生产厂家过滤条件清除掉
     * @param window
     */
    resetProductStore: function(window) {
        var expandable_combo = window.down('expandable_product_combo', false);
        var product_combo = expandable_combo.down('combo', false);
        product_combo.getStore().getProxy().setExtraParam('vendor_unit_id', null);
    },

    /**
     * 提交前的校验。
     * 修改的时候要判断是否有改动过的数据(isDirty)，有的话要写理由
     * @param button
     */
    validate: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        //        console.log(form.down('[name=expected_leave_factory_at]', false).isDirty());

        var store = Ext.getStore('ContractItems');

        if(form.form.isValid()) {
            if(button.action === "save" || button.action === "save_apply") {
                //新增，直接存后台了，因为这里一起提交太复杂
//                store.add(values);
                form.submit({
                    url: 'contract_items/save_contract_item',
                    params: {
                        contract_id: Ext.ComponentQuery.query('contract_grid')[0].getSelectedItem().get('id')
                    },
                    submitEmptyText: false,
                    success: function(the_form, action) {
                        var response = action.response;
                        var msg = Ext.decode(response.responseText);
                        if(button.action === "save") win.close();
                        Ext.example.msg('成功', msg.message);
                        store.load();
                    },
                    failure: function() {
                        Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                    }
                });
            } else {
                //修改，判断某些字段是否改过
                var check_array = [
                    'product_id',
                    'quantity',
//                    'expected_leave_factory_at',
                    'appointed_leave_factory_at',
                    'warranty_term_id'
                ];
                var is_dirty = false;
                Ext.Array.each(check_array, function(name, index) {
                    var item = Ext.ComponentQuery.query('contract_item_form form')[0].down('[name='+name+']', false);
                    if(item.isDirty()) {
                        is_dirty = true;
                    }
                });
//                Ext.example.msg("DIRTY", String(is_dirty));
                if(is_dirty) {
                    //改动过，提示输入理由
                    Ext.Msg.prompt("需要理由", "请输入修改的理由", function(btn, value) {
                        if(btn === "ok" && value != "") {
                            //输入了理由则把理由存下来
                            Ext.example.msg("注意", "要存理由");
                            form.submit({
                                url: 'contract_items/save_contract_item',
                                params: {
                                    contract_id: Ext.ComponentQuery.query('contract_grid')[0].getSelectedItem().get('id'),
                                    reason: value
                                },
                                submitEmptyText: false,
                                success: function(the_form, action) {
                                    var response = action.response;
                                    var msg = Ext.decode(response.responseText);
                                    win.close();
                                    Ext.example.msg('成功', msg.message);
                                    store.load();
                                },
                                failure: function() {
                                    Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                                }
                            });
                        }
                    });
                } else {
                    form.submit({
                        url: 'contract_items/save_contract_item',
                        params: {
                            contract_id: Ext.ComponentQuery.query('contract_grid')[0].getSelectedItem().get('id')
                        },
                        submitEmptyText: false,
                        success: function(the_form, action) {
                            var response = action.response;
                            var msg = Ext.decode(response.responseText);
                            win.close();
                            Ext.example.msg('成功', msg.message);
                            store.load();
                        },
                        failure: function() {
                            Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                        }
                    });
                }
            }
        }

    }
});