Ext.define('EIM.controller.contract.ItemSnForm', {
    extend:'Ext.app.Controller',

    stores:[
    ],
    models:[
    ],

    views:[
        'contract.ItemSnForm'
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
            'contract_item_sn_form [name=serial_number]': {
                change: this.validateSn
            },
            'contract_item_sn_form button[action=update]': {
                click: this.validate
            }
        });
    },
    validateSn: function(textfield) {
        var grid = Ext.ComponentQuery.query('contract_item_grid')[0];
        var selection = grid.getSelectedItem();
        var quantity = selection.get('quantity');

        var text = textfield.getValue();
        if(!Ext.isEmpty(text)) {
            if(text.split(",").length != quantity) {
                textfield.invalidMsg = '数量和序列号个数不一致，请检查！';
            } else {
                textfield.invalidMsg = '';
            }
            textfield.validate();
        }
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
        var values = form.getValues();

        var store = Ext.getStore('ContractItems');

        if(form.form.isValid()) {
                //修改
            form.submit({
                url: 'contract_items/update_serial_number',
                params: {
                    contract_id: Ext.ComponentQuery.query('contract_grid')[0].getSelectedItem().get('id')/*,
                    id: record.get('id'),
                    serial_number: value*/
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('ContractItems').load();
                },
                failure: function() {
                    Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                }
            });
            }
        }
});