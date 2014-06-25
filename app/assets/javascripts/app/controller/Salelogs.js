/**
 * “新增销售工作日志“窗口上的controller
 * 这里只加载“推荐…”那一页的东西，别的页单做controller，分步加载
 */
Ext.define('EIM.controller.Salelogs', {
    extend: 'Ext.app.Controller',

    stores: [],
    models: [],

    views: ['salelog.ExtraInfo'],

//    refs: [{
//        ref: 'list',
//        selector: 'recommended_item_grid'
//    }],

    init: function() {
        var me = this;

        me.control({
            //当激活标签为“报价”时，下面的提交灰掉，而由上面的表格细节处理
            'salelog_form>container>tabpanel': {
                tabchange: function(tabPanel, newCard, oldCard, eOpts) {
                    var dialog = newCard.up("salelog_form");
                    var extra_info = dialog.down("salelog_extra_info", false);
                    if(newCard.xtype == "quote_tab") {
                        extra_info.disable();
                    }else{
                        extra_info.enable();
                    }
                }
            },
            //“确定”按钮的提交行为，要判断当前激活的是哪个标签
            'button[action=saveSalelog]': {
                click: this.validate
            },
            'salelog_form combo[name=wait_reason]': {
                change: this.resetCommentViaWait
            },
            'salelog_form [name=comment]': {
                focus: this.resetCommentOnFocus
            }
        });
//    },
//
//    addRecommendedItem: function() {
//        Ext.widget('recommend_item_form').show();
//    },
//    editRecommendedItem: function() {
//        var record = this.getList().getSelectedItem();
//        var view = Ext.widget('recommend_item_form');
//        view.down('form').loadRecord(record);
    },

    validate: function(button) {
        var me = this;
        var tab = Ext.ComponentQuery.query("salelog_form tabpanel")[0];
        switch(tab.getActiveTab().xtype){
            case "recommend_tab": {
                //“推荐”标签的提交
                if(Ext.getStore("RecommendedItems").getCount() === 0){
                    Ext.example.msg("错误", "表格中还没有数据！");
                }else{
                    //防双击
                    button.disable();

                    var grid_data = Ext.encode(Ext.pluck(Ext.getStore("RecommendedItems").data.items, "data"));
                    Ext.ComponentQuery.query("salelog_extra_info")[0].submit({
                        url: 'salelogs/add_salelog_from_form',
                        params: {
                            //root: {"grid_data": grid_data}//a: [{"number":1}, {"number":2}]}
                            //"grid_data": "{grid_data:" + grid_data + "}"
                            "type": "recommend_product",
                            "grid_data": grid_data,
                            "salecase_id": Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id")
                        },
                        success: me.closeAndRefresh
                    });
                }
                return false;
            }
            case "mail_tab": {
                var sub_tab = tab.down("tabpanel");
                switch(sub_tab.getActiveTab().xtype){
                    //“寄样品”标签的提交
                    case "mailed_sample_grid": {
                        if(Ext.getStore("MailedSamples").getCount() === 0){
                            Ext.example.msg("错误", "表格中还没有数据！");
                        }else{
                            //防双击
                            button.disable();

                            var grid_data = Ext.encode(Ext.pluck(Ext.getStore("MailedSamples").data.items, "data"));
                            Ext.ComponentQuery.query("salelog_extra_info")[0].submit({
                                url: 'salelogs/add_salelog_from_form',
                                params: {
                                    "type": "mailed_sample_grid",
                                    "grid_data": grid_data,
                                    "salecase_id": Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id")
                                },
                                success: me.closeAndRefresh
                            });
                        }
                        return false;
                    }
                    //“寄目录”标签的提交
                    case "mailed_content_grid": {
                        if(Ext.getStore("MailedContents").getCount() === 0){
                            Ext.example.msg("错误", "表格中还没有数据！");
                        }else{
                            //防双击
                            button.disable();

                            var grid_data = Ext.encode(Ext.pluck(Ext.getStore("MailedContents").data.items, "data"));
                            Ext.ComponentQuery.query("salelog_extra_info")[0].submit({
                                url: 'salelogs/add_salelog_from_form',
                                params: {
                                    "type": "mailed_content_grid",
                                    "grid_data": grid_data,
                                    "salecase_id": Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id")
                                },
                                success: me.closeAndRefresh
                            });
                        }
                        return false;
                    }
                    //“寄加工件(到工厂)”标签的提交
                    case "mailed_processing_piece_to_vendor_grid": {
                        if(Ext.getStore("MailedProcessingPieceToVendors").getCount() === 0){
                            Ext.example.msg("错误", "表格中还没有数据！");
                        }else{
                            //防双击
                            button.disable();

                            var grid_data = Ext.encode(Ext.pluck(Ext.getStore("MailedProcessingPieceToVendors").data.items, "data"));
                            Ext.ComponentQuery.query("salelog_extra_info")[0].submit({
                                url: 'salelogs/add_salelog_from_form',
                                params: {
                                    "type": "mailed_processing_piece_to_vendor_grid",
                                    "grid_data": grid_data,
                                    "salecase_id": Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id")
                                },
                                success: me.closeAndRefresh
                            });
                        }
                        return false;
                    }
                    //“寄加工件(到客户)”标签的提交
                    case "mailed_processing_piece_to_customer_grid": {
                        if(Ext.getStore("MailedProcessingPieceToCustomers").getCount() === 0){
                            Ext.example.msg("错误", "表格中还没有数据！");
                        }else{
                            //防双击
                            button.disable();

                            var grid_data = Ext.encode(Ext.pluck(Ext.getStore("MailedProcessingPieceToCustomers").data.items, "data"));
                            Ext.ComponentQuery.query("salelog_extra_info")[0].submit({
                                url: 'salelogs/add_salelog_from_form',
                                params: {
                                    "type": "mailed_processing_piece_to_customer_grid",
                                    "grid_data": grid_data,
                                    "salecase_id": Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id")
                                },
                                success: me.closeAndRefresh
                            });
                        }
                        return false;
                    }
                    //“寄产品”标签的提交
                    case "mailed_product_grid": {
                        if(Ext.getStore("MailedProducts").getCount() === 0){
                            Ext.example.msg("错误", "表格中还没有数据！");
                        }else{
                            //防双击
                            button.disable();

                            var grid_data = Ext.encode(Ext.pluck(Ext.getStore("MailedProducts").data.items, "data"));
                            Ext.ComponentQuery.query("salelog_extra_info")[0].submit({
                                url: 'salelogs/add_salelog_from_form',
                                params: {
                                    "type": "mailed_product_grid",
                                    "grid_data": grid_data,
                                    "salecase_id": Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id")
                                },
                                success: me.closeAndRefresh
                            });
                        }
                        return false;
                    }
                    default :{
                        return false;
                    }
                }
                return false;
            }
            //“报价”标签的提交
            case "quote_tab": {
                if(Ext.getStore("SalelogQuotedItems").getCount() === 0){
                    Ext.example.msg("错误", "表格中还没有数据！");
                }else{
                    //防双击
                    button.disable();

                    //不管是“新增报价”还是“修改报价”，都是生成一个新的报价。二者的区别在于“修改”时可以依照以前的数据来对比
                    var grid_data = Ext.encode(Ext.pluck(Ext.getStore("SalelogQuotedItems").data.items, "data"));
                    var form_data = Ext.encode(Ext.ComponentQuery.query("salelog_quote_form form")[0].form.getValues());
                    Ext.ComponentQuery.query("salelog_quote_form salelog_extra_info")[0].submit({
                        url: 'ABC',
                        params: {
                            grid_data: grid_data,
                            form_data: form_data
                        },
                        success: me.closeAndRefresh
                    });
                }
                return false;
            }
            //“合同”标签的提交
            case "contract_tab": {
                var tab = Ext.ComponentQuery.query("contract_tab")[0];
                if(tab.form.isValid()) {
                    //防双击
                    button.disable();

                    var form_data = Ext.encode(tab.getValues());
                    Ext.ComponentQuery.query("salelog_extra_info")[0].submit({
                        url: 'salelogs/add_salelog_from_form',
                        params: {
                            "type": "contract",
                            "form_data": form_data,
                            "salecase_id": Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id")
                        },
                        success: me.closeAndRefresh
                    });
                }
                return false;
            }
            //“等待”标签的提交
            case "wait_tab": {
                var tab = Ext.ComponentQuery.query("wait_tab")[0]
                if(tab.form.isValid()) {
                    //防双击
                    button.disable();

                    var form_data = Ext.encode(tab.getValues());
                    var comment_field = tab.up('window').down('[name=comment]', false);
                    if(tab.getValues()['wait_reason'] === '5' && comment_field.getValue() === "") {
                        //是“其他”的时候要填备注
                        comment_field.invalidMsg = "选择“其他”时必须填写备注！";
                        comment_field.validate();
                        button.enable();
                    } else {
                        comment_field.invalidMsg = "";
                        comment_field.validate();
                    }

                    Ext.ComponentQuery.query("salelog_extra_info")[0].submit({
                        url: 'salelogs/add_salelog_from_form',
                        params: {
                            "type": "wait",
                            "form_data": form_data,
                            "salecase_id": Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id")
                        },
                        success: me.closeAndRefresh
                    });
                }
                return false;
            }
            //“个案完结”标签的提交
            case "cancel_tab": {
                var tab = Ext.ComponentQuery.query("cancel_tab")[0]
                if(tab.form.isValid()) {
                    //防双击
                    button.disable();

                    var form_data = Ext.encode(tab.getValues());
                    var comment_field = tab.up('window').down('[name=comment]', false);
                    if((tab.getValues()['case_cancel_reason'] === '5' || tab.getValues()['case_cancel_reason'] === '100') && comment_field.getValue() === "") {
                        //是“其他”的时候要填备注
                        comment_field.invalidMsg = "选择“其他”或“其他渠道”时必须填写备注！";
                        comment_field.validate();
                        button.enable();
                    } else {
                        comment_field.invalidMsg = "";
                        comment_field.validate();
                    }

                    Ext.ComponentQuery.query("salelog_extra_info")[0].submit({
                        url: 'salelogs/add_salelog_from_form',
                        params: {
                            "type": "cancel",
                            "form_data": form_data,
                            "salecase_id": Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id")
                        },
                        success: me.closeAndRefresh
                    });
                }
                return false;
            }
            //“其它”标签的提交
            case "other_tab": {
                var tab = Ext.ComponentQuery.query("other_tab")[0]
                if(tab.form.isValid()) {
                    //防双击
                    button.disable();

                    var form_data = Ext.encode(tab.getValues());
                    Ext.ComponentQuery.query("salelog_extra_info")[0].submit({
                        url: 'salelogs/add_salelog_from_form',
                        params: {
                            "type": "other",
                            "form_data": form_data,
                            "salecase_id": Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id")
                        },
                        success: me.closeAndRefresh
                    });
                }
                return false;
            }
            default :{
                //                        	console.log(tab.getActiveTab());
                //                        	console.log(tab.getActiveTab().xtype);
                //                            console.log("默认……………………");
                return false;
            }
        }
        tab.up("window").close();
    },

    resetCommentViaWait: function(combo) {
        var comment_field = combo.up('window').down('[name=comment]', false);
        this.resetComment(comment_field);
    },

    resetCommentOnFocus: function(comment_field) {
        this.resetComment(comment_field);
    },

    resetComment: function(field) {
        field.invalidMsg = "";
        field.validate();
    },

    /**
     * 关闭“新增销售工作日志”标签并刷新表格
     */
    closeAndRefresh: function() {
        var tab = Ext.ComponentQuery.query("salelog_form tabpanel")[0];
        tab.up("window").close();
        Ext.getStore('Salelogs').load();
    }
});

