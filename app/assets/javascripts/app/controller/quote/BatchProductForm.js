Ext.define('EIM.controller.quote.BatchProductForm', {
    extend:'Ext.app.Controller',

    stores:[
        'ComboVendorUnits'
    ],
    models:[
        'ComboVendorUnit'
    ],

    views:[
        'quote.BatchProductForm'
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
            'quote_batch_product_form button[action=save]': {
                click: function(button) {
                    var win = button.up('window');
                    var form = win.down('form', false);

                    if(form.form.isValid()) {
                        //如果选中节点的第一个节点是叶子，则以其父节点为目标
                        //如果是非叶子，则以其为目标
                        //如果未选中任何节点，则以根为目标
                        var tree = Ext.ComponentQuery.query('quote_item_tree')[0];
                        var root = tree.getRootNode();
                        var selection_node = tree.getSelectedItem();
                        var target_node;// = root;
                        if(selection_node) {
                            if(!selection_node.data.leaf) {
                                target_node = selection_node;
                            }else{
                                target_node = selection_node.parentNode;
                            }
                        }else{
                            target_node = root;
                        }

                        //循环存产品ID到树
                        var products = Ext.ComponentQuery.query('functree')[0].tempBatchProduct;
                        Ext.Object.each(products, function(key, value) {
                            var current_store_data = value['data'];
                            var data = form.getValues();

                            data["custom_tax"] = current_store_data['custom_tax'];

                            //按报价语种取描述，没填默认为中文
                            var panel = tree.up('panel');
                            var quote_info = panel.up('panel').down('quote_info', false);
                            var language = quote_info.down('[name=language]', false).getValue();
                            if(language === "2") {
                                data["description"] = current_store_data['simple_description_en'];
                            }else{
                                data["description"] = current_store_data['simple_description_cn'];
                            }

                            //默认数量为1
                            data["quantity"] = 1;

                            //按报价币种取产品币种，“混合”则全用RMB
                            data["currency_id"] = 11;
                            data["currency_name"] = "RMB";
                            var currency_field = panel.down('[name=currency_id]', false);
                            if(currency_field.getValue() != 1 && currency_field.getValue() != null) {
                                data["currency_id"] = currency_field.getValue();
                                data["currency_name"] = currency_field.getRawValue();
                            }
                            data["is_leaf"] = true;
                            data["leaf"] = true;
                            data["product_id"] = key;
                            data["product_model"] = current_store_data['model'];
                            data["vendor_unit_name"] = form.down('[name=vendor_unit_id]', false).getRawValue();
                            target_node.insertChild(99, data);
                        });

                        win.close();
                        this.getController('Quotes').reCalculateTree();
                    }
                }
            }
        });
    }
});