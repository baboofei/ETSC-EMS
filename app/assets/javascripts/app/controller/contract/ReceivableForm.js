Ext.define('EIM.controller.contract.ReceivableForm', {
    extend:'Ext.app.Controller',

    stores:[
//        'dict.SendStatuses',
//        'dict.CheckAndAcceptStatuses',
//        'Terms'
    ],
    models:[
//        'dict.SendStatus',
//        'dict.CheckAndAcceptStatus',
//        'Term'
    ],

    views:[
        'contract.ReceivableForm'
    ],

//    refs:[
//        {
//            //            ref:'grid',
//            //            selector:'recommended_item_grid'
//            //                }, {
//            //            ref: 'form',
//            //            selector: 'receivable_form'
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
            'receivable_form': {
//                show: this.resetProductStore
            },
            'receivable_form button[action=save]': {
                click: this.validate
            },
            'receivable_form button[action=update]': {
//                click: function() {console.log("simple");}
                click: this.validate
            }
        });
    },

//    resetProductStore: function() {
//        console.log("AAA");
//    },

    /**
     * 提交前的校验。
     * 修改的时候要判断是否有改动过的数据(isDirty)，有的话要写理由
     * @param button
     */
    validate: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var values = form.getValues();
        var store = Ext.getStore('Receivables');
        if(form.form.isValid()) {
            if(button.action === "save") {
                //新增，直接存后台了，因为这里一起提交太复杂
//                store.add(values);
                form.submit({
                    url: 'receivables/save_receivable',
                    params: {
                        contract_id: Ext.ComponentQuery.query('contract_grid')[0].getSelectedItem().get('id')
                    },
                    submitEmptyText: false,
                    success: function(the_form, action) {
                        var response = action.response;
                        var msg = Ext.decode(response.responseText);
                        win.close();
                        Ext.example.msg('成功', msg.message);
                        Ext.getStore('Receivables').load();
                    },
                    failure: function() {
                        Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                    }
                });
            }else{
                //修改，判断某些字段是否改过
                var check_array = [
                    'expected_receive_at',
                    'amount'
                ];
                var is_dirty = false;
                Ext.Array.each(check_array, function(name, index) {
                    var item = Ext.ComponentQuery.query('receivable_form form')[0].down('[name='+name+']', false);
                    if(item.isDirty()) {
                        is_dirty = true;
                    }
                });
//                Ext.example.msg("DIRTY", String(is_dirty));
                if(is_dirty) {
                    //改动过，不输入理由了，但因为有真实改动的情况和无改动的情况提交是不一样的，所以还是分情况
//                    Ext.Msg.prompt("需要理由", "请输入修改的理由", function(btn, value) {
//                        if(btn === "ok" && value != "") {
                            form.submit({
                                url: 'receivables/save_receivable',
                                params: {
                                    contract_id: Ext.ComponentQuery.query('contract_grid')[0].getSelectedItem().get('id')/*,
                                    reason: value*/
                                },
                                submitEmptyText: false,
                                success: function(the_form, action) {
                                    var response = action.response;
                                    var msg = Ext.decode(response.responseText);
                                    win.close();
                                    Ext.example.msg('成功', msg.message);
                                    Ext.getStore('Receivables').load();
                                },
                                failure: function() {
                                    Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                                }
                            });
//                            //输入了理由则把理由存下来
//                            console.log(value);
//                            Ext.example.msg("注意", "要存理由<br>前台还要更新上面的进度条");
//                            win.close();
//                        }
//                    });
                } else {
                    win.close();
                }
            }
        }
    }
});