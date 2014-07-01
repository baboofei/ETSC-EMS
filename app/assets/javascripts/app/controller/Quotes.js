/**
 * 报价标签页上的controller
 * TODO 很多事件应该用on来加载，但先这么用着吧，以后有空改……
 */
Ext.define('EIM.controller.Quotes', {
    extend:'Ext.app.Controller',

    stores:[
        'Quotes',
        'QuoteItems',
        'ComboSalecases',
        'ComboOurCompanies',
        'ComboGroups',
        'ComboQuoteSales',
        'ComboSupporters',
        'dict.QuoteTypes',
        'dict.QuoteLanguages',
        'dict.QuoteFormats'
    ],
    models:[
        'Quote',
        'QuoteItem',
        'ComboSalecase',
        'ComboOurCompany',
        'ComboGroup',
        'ComboQuoteSale',
        'ComboSupporter',
        'dict.QuoteType',
        'dict.QuoteLanguage',
        'dict.QuoteFormat'
    ],

    views:[
        'etscux.AmountWithCurrency',
        'quote.Panel',
        'quote.Grid',
        'quote.Detail',
        'quote.Info',
        'quote.ItemPanel',
        'quote.ItemConfig',
        'quote.ItemTree',
        'quote.ItemFoot',
        'quote.ItemFee',
        'quote.Term'
    ],

    refs:[
        {
            ref: 'grid',
            selector: 'quote_grid'
        },
        {
            ref: 'itemgrid',
            selector: 'quote_item_tree'
        }
    ],

    init:function () {
        var me = this;
        me.control({
            'quote_panel button[isInWorkflow=true], quote_panel button[action=save_as]': {
                click: this.workflow_submit
            },


            'quote_grid': {
                afterrender: this.applyFilter,
                selectionchange: this.quoteSelectionChange
            },
            'quote_grid button[action=addQuote]': {
                click: this.addQuote
            },
            '[name=exchange_rate_hash]': {
                render: function(field) {
                    field.setValue(Ext.encode(Ext.ComponentQuery.query('functree')[0].allCurrency));
                }
            },

            'quote_info combo[name=sale>id], quote_form combo[name=sale>id]': {
                select: this.addParamsToComboSalecaseStore
            },
            'quote_info combo[name=salelog>salecase>id], quote_form combo[name=salelog>salecase>id]': {
                beforequery: function(queryEvent, records, eOpts) {
                    delete queryEvent.combo.lastQuery;
                }
            },
            'quote_item_tree': {
                selectionchange: this.selectionChange,
                itemdblclick: this.editOrExpand
            },
            'quote_item_tree button[action=addQuoteBlock]': {
                click: this.addQuoteBlock
            },
            'quote_item_tree button[action=addQuoteItem]': {
                click: this.addQuoteItem
            },
            'quote_item_tree button[action=batchAddProduct]': {
                click: this.batchAddProduct
            },
            'quote_item_tree button[action=editQuoteBlock]': {
                click: this.editQuoteBlock
            },
            'quote_item_tree button[action=editQuoteItem]': {
                click: this.editQuoteItem
            },
            'quote_item_tree button[action=batchMarkUpDown]': {
                click: this.batchMarkUpDown
            },
            'quote_item_tree button[action=deleteSelection]': {
                click: this.deleteSelection
            },
            'button[action=exchange_rate_manage]': {
                click: this.manageExchangeRate
            },

//            'quote_item_fee combo[name=currency_id]': {
////                change: this.triggerFIF
//            },
//            'quote_item_fee checkbox[name=does_count_ctvat]': {
////                change: this.triggerTaxes
//            },

            'quote_term combo[name=price_type_of_term]': {
                change: this.triggerCity
            },
            'quote_term combo[name=pay_way1]': {
                change: this.triggerFlagTTLC
            },
            'quote_term checkbox': {
                change: this.triggerFlagUnify
            },

            'quote_item_tree treeview': {
                drop: this.reCalculateTree
            },

//            'quote_item_foot [name=total]': {
////                change: this.calculateFinalPriceWithTotalPrice
//            },
//            'quote_item_foot [name=x_discount]': {
////                change: this.calculateDiscountWithXDiscount
//            },
//            'quote_item_foot [name=total_discount]': {
////                change: this.calculateFinalPriceWithLessSpecialDiscount
//            },
//            'quote_item_foot [name=fif]': {
////                change: this.calculateFinalPriceWithFreightInsuranceCost
//            },
//            'quote_item_fee [name=max_custom_tax]': {
////                change: this.calculateFinalPriceWithMaxCustomTax,
////                enable: this.calculateFinalPriceWithMaxCustomTaxZ,
////                disable: this.calculateFinalPriceWithMaxCustomTaxZ
//            },
//            'quote_item_fee [name=vat]': {
////                change: this.calculateRmbWithVat,
////                enable: this.calculateRmbWithVatZ,
////                disable: this.calculateRmbWithVatZ
//            },
//            'quote_item_fee [name=declaration_fee]': {
////                change: this.calculateRmbWithDeclarationFee
//            },
//            'quote_item_foot [name=final_price]': {
////                change: this.calculateRmbWithFinalPrice
//            },

            'quote_panel button[action=save], quote_panel button[action=save_as], quote_panel button[action=generate_pdf]': {
//                click: this.submit
            },
            'quote_panel button[action=generate_log]': {
                click: this.addLog
            }
        });
    },

    /**
     * 如果全局过滤条件有值存在，则清空之前的过滤，改为过滤全局变量
     * @param grid
     */
    applyFilter: function(grid) {
        if(!Ext.isEmpty(globeFilter)) {
            grid.filters.clearFilters();
            var gridFilter = grid.filters.addFilter({
                active: true,
                type: 'string',
                dataIndex: 'number'
            });
            gridFilter.setValue(globeFilter);
            gridFilter.setActive(true, false);
        }
        globeFilter = ""; //过滤完清空
    },
    /**
     * 上面的“报价列表”里选中时，下面“报价信息”、“报价项目”、“报价条款”里加载数据
     * @param selectionModel
     * @param selected
     * @param eOpts
     */
    quoteSelectionChange: function(selectionModel, selected, eOpts) {
        var me = this;
        var root = Ext.ComponentQuery.query("quote_tab")[0];
        var info_form = Ext.ComponentQuery.query('quote_info', root)[0];
        var item_fee_form = Ext.ComponentQuery.query('quote_item_fee', root)[0];
        var item_foot_form = Ext.ComponentQuery.query('quote_item_foot', root)[0];
        var pdf_form = Ext.ComponentQuery.query('quote_item_config', root)[0];
        var term_form = Ext.ComponentQuery.query('quote_term', root)[0];

        var btn_save_as = Ext.ComponentQuery.query('quote_panel button[action=save_as]')[0];
        var btn_sale_create = Ext.ComponentQuery.query('button#privilege_button_sale_create')[0];
        var btn_business_check = Ext.ComponentQuery.query('button#privilege_button_business_check')[0];
        var btn_business_first_done = Ext.ComponentQuery.query('button#privilege_button_business_first_done')[0];
        var btn_sale_check_fail = Ext.ComponentQuery.query('button#privilege_button_sale_check_fail')[0];
        var btn_sale_check_ok = Ext.ComponentQuery.query('button#privilege_button_sale_check_ok')[0];
        var btn_business_fix = Ext.ComponentQuery.query('button#privilege_button_business_fix')[0];

        if (selected.length > 0) {
            //先un掉一些trigger
            var total_discount_field = Ext.ComponentQuery.query('quote_item_foot [name=total_discount]')[0];
            total_discount_field.un('change', me.triggerTotalDiscountCheck, this);
            total_discount_field.un('change', me.calculateFinalPriceWithLessSpecialDiscount, this);
            var fif_field = Ext.ComponentQuery.query('quote_item_foot [name=fif]')[0];
            fif_field.un('change', me.triggerFIFCheck, this);
            fif_field.un('change', me.calculateFinalPriceWithFreightInsuranceCost, this);
            var quote_language_combo = Ext.ComponentQuery.query('quote_info combo[name=language]')[0];
            quote_language_combo.un('change', me.triggerRMBCheck, this);
            var currency_id_combo = Ext.ComponentQuery.query('quote_item_fee combo[name=currency_id]')[0];
            currency_id_combo.un('change', me.triggerFIF, this);
            var does_count_ctvat_checkbox = Ext.ComponentQuery.query('quote_item_fee checkbox[name=does_count_ctvat]')[0];
            does_count_ctvat_checkbox.un('change', me.triggerTaxes, this);
            var total_field = Ext.ComponentQuery.query('quote_item_foot [name=total]')[0];
            total_field.un('change', me.calculateFinalPriceWithTotalPrice, this);
            var x_discount_field = Ext.ComponentQuery.query('quote_item_foot [name=x_discount]')[0];
            x_discount_field.un('change', me.calculateDiscountWithXDiscount, this);
            var max_custom_tax_field = Ext.ComponentQuery.query('quote_item_fee [name=max_custom_tax]')[0];
            max_custom_tax_field.un('change', me.calculateFinalPriceWithMaxCustomTax, this);
            max_custom_tax_field.un('enable', me.calculateFinalPriceWithMaxCustomTaxZ, this);
            max_custom_tax_field.un('disable', me.calculateFinalPriceWithMaxCustomTaxZ, this);
            var vat_field = Ext.ComponentQuery.query('quote_item_fee [name=vat]')[0];
            vat_field.un('change', me.calculateRmbWithVat, this);
            vat_field.un('enable', me.calculateRmbWithVatZ, this);
            vat_field.un('disable', me.calculateRmbWithVatZ, this);
            var declaration_fee_field = Ext.ComponentQuery.query('quote_item_fee [name=declaration_fee]')[0];
            declaration_fee_field.un('change', me.calculateRmbWithDeclarationFee, this);
            var final_price_field = Ext.ComponentQuery.query('quote_item_foot [name=final_price]')[0];
            final_price_field.un('change', me.calculateRmbWithFinalPrice, this);

            Ext.ComponentQuery.query('quote_info')[0].enable();
            Ext.ComponentQuery.query('quote_item_panel')[0].enable();
            Ext.ComponentQuery.query('quote_term')[0].enable();

            //直接从record里读数据的form
            info_form.loadRecord(selected[0]);
            item_fee_form.loadRecord(selected[0]);
            item_foot_form.loadRecord(selected[0]);

            //树的store加载
            Ext.ComponentQuery.query('quote_item_tree')[0].getSelectionModel().select([]);//先把下面quote_item_tree选中的清空，不然加载不上……
            Ext.getStore('QuoteItems').load({
                params:{
                    quote_id: selected[0].get("id")
                },
                callback: function(records) {
                    Ext.ComponentQuery.query('quote_item_tree')[0].expandAll();
//                    me.reCalculateTree();//为了刷新出“最大关税”来
                }
            });
            Ext.getStore('QuoteItems').sort([{
                sorterFn: function(o1, o2){
                    var getInnerId = function(o){
                            return o.get('inner_id');
                        },
                        inner_id1 = getInnerId(o1),
                        inner_id2 = getInnerId(o2);
                    //TODO 可递归优化
                    if(eval(inner_id1.split("-")[0]) === eval(inner_id2.split("-")[0])) {
                        if(eval(inner_id1.split("-")[1]) === eval(inner_id2.split("-")[1])) {
                            if(eval(inner_id1.split("-")[2]) === eval(inner_id2.split("-")[2])) {
                                if(eval(inner_id1.split("-")[3]) === eval(inner_id2.split("-")[3])) {
                                    return 0;
                                } else {
                                    return eval(inner_id1.split("-")[3]) < eval(inner_id2.split("-")[3]) ? -1 : 1;
                                }
                            } else {
                                return eval(inner_id1.split("-")[2]) < eval(inner_id2.split("-")[2]) ? -1 : 1;
                            }
                        } else {
                            return eval(inner_id1.split("-")[1]) < eval(inner_id2.split("-")[1]) ? -1 : 1;
                        }
                    } else {
                        return eval(inner_id1.split("-")[0]) < eval(inner_id2.split("-")[0]) ? -1 : 1;
                    }
                }
            }], 'ASC');

            //PDF设置面板的重置
            if(!Ext.isEmpty(selected[0]["data"]["pdf"])) {
                var pdf_obj = {};
                pdf_obj["data"] = Ext.decode(selected[0]["data"]["pdf"]);
                var all_check_fields = Ext.ComponentQuery.query('quote_item_config checkbox', root);
                Ext.Array.each(all_check_fields, function(item) {
                    item.setValue(false);
                });
                if(selected[0]["data"]['currency_id'] === 1) {
                    //币种为“混合”时，运保费币种带回来
                    item_fee_form.down('[name=fif_currency_id]', false).setValue(pdf_obj["data"]["fif_currency_id"]);
                }else{
                    //币种不为“混合”时，运保费币种同产品币种
                    item_fee_form.down('[name=fif_currency_id]', false).setValue(selected[0]['data']["currency_id"]);
                }
            }

            //如果是新报价，则默认一个PDF选项的选中值
            if(selected[0].get("total") === 0 || selected[0].get("total") === null) {
                pdf_form.down('[name=show_original_price_product]').setValue(true);
                pdf_form.down('[name=show_total_product]').setValue(true);
                pdf_form.down('[name=show_footer_total]').setValue(true);
                pdf_form.down('[name=show_footer_discount]').setValue(true);
                pdf_form.down('[name=show_footer_freight_insurance_cost]').setValue(true);
                pdf_form.down('[name=show_footer_final_price]').setValue(true);
                pdf_form.down('[name=show_footer_rmb]').setValue(false);
            }else{
                if(!Ext.isEmpty(selected[0]["data"]["pdf"])) {
//                    pdf_obj["data"] = Ext.decode(selected[0]["data"]["pdf"]);
                    pdf_form.loadRecord(pdf_obj);
                }
            }
            //term面板的重置
            var term_obj = {};
            term_form.form.reset();
            if(!Ext.isEmpty(selected[0]["data"]["term"])) {
                term_obj["data"] = Ext.decode(selected[0]["data"]["term"]);
                term_form.loadRecord(term_obj);
            }

            if(selected[0].get("editable")) {
                //“另存为新报价”亮起
                btn_save_as.enable();
                //涉及权限的按钮全部hide起来，再根据流程show当前的
                Ext.Array.each(Ext.ComponentQuery.query('quote_panel button[isInWorkflow=true]'), function(item) {
                    item.disable();
                });
//                console.log(selected[0].get("editable"));
                switch(selected[0].get("state")) {
                    case "start":
                        break;
                    case "pre_quote":
                        btn_sale_create.enable();
                        break;
                    case "progressing":
                        btn_business_check.enable();
                        btn_business_first_done.enable();
                        break;
                    case "checking":
                        btn_business_check.enable();
                        btn_business_first_done.enable();
                        break;
                    case "downloadable":
                        btn_sale_check_fail.enable();
                        btn_sale_check_ok.enable();
                        break;
                    case "need_change":
                        btn_business_fix.enable();
                        break;
                    case "complete":
                        break;
                    default:
                        break;
                }
            }else{
                btn_save_as.disable();
            }

            //给combo做一个假的store以正确显示值
            var customer_unit_field = info_form.down('[name=customer_unit_id]', false);
            customer_unit_field.getStore().loadData([[selected[0].get('customer_unit>id'), selected[0].get('customer_unit>(name|unit_aliases>unit_alias)')]]);
            customer_unit_field.setValue(selected[0].get('customer_unit>id'));

            var customer_field = info_form.down('[name=customer_id]', false);
            customer_field.getStore().loadData([[selected[0].get('customer>id'), selected[0].get('customer>name')]]);
            customer_field.setValue(selected[0].get('customer>id'));
            customer_field.getStore().getProxy().setExtraParam('customer_unit_id', selected[0].get('customer_unit>id'))

//            var quote_number_field = info_form.down('[name=number]', false);
//            quote_number_field.setRawValue(selected[0].get('number'));

//            var salecase_field = info_form.down('[name=salelog>salecase>id]', false);
//            salecase_field.setRawValue(selected[0].get('salelog>salecase>number'));

            //加载完数据后把trigger事件再on回来
            total_discount_field.on('change', me.triggerTotalDiscountCheck, this);//这样添加一个事件
            total_discount_field.on('change', me.calculateFinalPriceWithLessSpecialDiscount, this);
            fif_field.on('change', me.triggerFIFCheck, this);
            fif_field.on('change', me.calculateFinalPriceWithFreightInsuranceCost, this);
            quote_language_combo.on('change', me.triggerRMBCheck, this);
            currency_id_combo.on('change', me.triggerFIF, this);
            does_count_ctvat_checkbox.on('change', me.triggerTaxes, this);
            total_field.on('change', me.calculateFinalPriceWithTotalPrice, this);
            x_discount_field.on('change', me.calculateDiscountWithXDiscount, this);
            max_custom_tax_field.on('change', me.calculateFinalPriceWithMaxCustomTax, this);
            max_custom_tax_field.on('enable', me.calculateFinalPriceWithMaxCustomTaxZ, this);
            max_custom_tax_field.on('disable', me.calculateFinalPriceWithMaxCustomTaxZ, this);
            vat_field.on('change', me.calculateRmbWithVat, this);
            vat_field.on('enable', me.calculateRmbWithVatZ, this);
            vat_field.on('disable', me.calculateRmbWithVatZ, this);
            declaration_fee_field.on('change', me.calculateRmbWithDeclarationFee, this);
            final_price_field.on('change', me.calculateRmbWithFinalPrice, this);

            //最后“合理化”一下各个disable的情况
            var fif_currency_id_field = Ext.ComponentQuery.query('[name=fif_currency_id]')[0];
            if(Ext.ComponentQuery.query('[name=currency_id]')[0].getValue() === 1) {
                fif_currency_id_field.setDisabled(false);
                fif_currency_id_field.setValue(selected[0]['data']['fif_currency_id']);
                Ext.ComponentQuery.query('[name=final_price]')[0].setDisabled(true);
            }
            max_custom_tax_field.setDisabled(!does_count_ctvat_checkbox.getValue());
            vat_field.setDisabled(!does_count_ctvat_checkbox.getValue());

        } else {
            Ext.ComponentQuery.query('quote_info')[0].disable();
            Ext.ComponentQuery.query('quote_item_panel')[0].disable();
            Ext.ComponentQuery.query('quote_term')[0].disable();

            info_form.form.reset();
            item_fee_form.form.reset();
            item_foot_form.form.reset();
            Ext.ComponentQuery.query('quote_item_tree')[0].getRootNode().removeAll();
            pdf_form.form.reset();
            term_form.form.reset();

            btn_sale_create.disable();
            btn_business_first_done.disable();
            btn_sale_check_fail.disable();
            btn_sale_check_ok.disable();
            btn_business_fix.disable();
            btn_save_as.disable();
//            //涉及权限的按钮全部hide起来，再根据流程show当前的
//            Ext.Array.each(Ext.ComponentQuery.query('button[isInWorkflow=true]'), function(item) {
//                item.disable();
//            });
        }
    },

    addQuote: function() {
        var me = this;
        load_uniq_controller(me, 'quote.Form');
        var view = Ext.widget('quote_form').show();
        view.down('[name=customer_id]', false).getStore().removeAll();
        view.down('[name=customer_id]', false).getStore().proxy.setExtraParam('customer_unit_id', null);
        view.down('[name=salelog>salecase>id]', false).getStore().proxy.setExtraParam('customer_id', null);
        view.down('[name=salelog>salecase>id]', false).getStore().proxy.setExtraParam('user_id', null);
    },

//    /**
//     * 当全体汇率的hash(exchange_rate_hash)改变的时候，判断有无报价项/报价块的窗口
//     * 有则改变其中的汇率值
//     */
//    updateExchangeRateInItemAndBlockForm: function(hidden) {
//        var form;
//        if(Ext.ComponentQuery.query('quote_item_form').length > 0) {
//            form = Ext.ComponentQuery.query('quote_item_form form')[0];
//        }else if(Ext.ComponentQuery.query('quote_block_form').length > 0) {
//            form = Ext.ComponentQuery.query('quote_block_form form')[0];
//        }else{
//            return false;
//        }
//
//        var original_currency_field = form.down('[name=source_price_currency_id]');
//        var original_exchange_rate_field = form.down('[name=original_exchange_rate]');
//        var currency_field = form.down('[name=total_currency_id]');
//        var exchange_rate_field = form.down('[name=exchange_rate]');
//
//        var exchange_rate_hash = Ext.decode(hidden.getValue());
//        Ext.Array.each(exchange_rate_hash, function(item, index, allItems) {
//            if(original_currency_field.getRawValue() === item['currency']) {
//                original_exchange_rate_field.setValue(item['exchange_rate']);
//            }
//            if(currency_field.getRawValue() === item['currency']) {
//                exchange_rate_field.setValue(item['exchange_rate']);
//            }
//        });
//    },

    /**
     * 选了负责工程师后要把值作为参数赋给个案的combo
     */
    addParamsToComboSalecaseStore: function(combo, records, eOpts) {
        var case_combo = combo.up('form').down('[name=salelog>salecase>id]', false)
        if(case_combo){
            case_combo.getStore().getProxy().setExtraParam('user_id', records[0]["data"]["id"])
            case_combo.reset();
        }
    },

    selectionChange: function(model, selected, eOpts) {
        var item_grid = this.getItemgrid();
        var edit_block_btn = item_grid.down('[action=editQuoteBlock]', false);
        var edit_item_btn = item_grid.down('[action=editQuoteItem]', false);
        var batch_btn = item_grid.down('[action=batchMarkUpDown]', false);
        var delete_btn = item_grid.down('[action=deleteSelection]', false);
        if(selected.length === 1) {
            //如果选中的只有一个，视选中的是何种类型而显示出对应的“修改”按钮
            var is_leaf = Ext.pluck(Ext.pluck(selected, 'data'), 'leaf')[0];
            if(is_leaf) {
                edit_block_btn.hide();
                edit_block_btn.disable();
                edit_item_btn.show();
                edit_item_btn.enable();
            }else{
                edit_block_btn.show();
                edit_block_btn.enable();
                edit_item_btn.hide();
                edit_item_btn.disable();
            }

            batch_btn.disable();
            delete_btn.enable();
        }else if(selected.length === 0) {
            //如果选中零个，则“修改”按钮的状态复原
            edit_block_btn.show();
            edit_block_btn.disable();
            edit_item_btn.hide();
            edit_item_btn.disable();

            batch_btn.disable();
            delete_btn.disable();
        }else{
            //如果选中的多于一个，则“修改”按钮的状态复原，且根据情况判断“批量加/减价”按钮是否可用
            edit_block_btn.show();
            edit_block_btn.disable();
            edit_item_btn.hide();
            edit_item_btn.disable();

            var leaf_array = Ext.pluck(Ext.pluck(selected, 'data'), 'leaf');
            var uniq_leaf_array = Ext.Array.unique(leaf_array);
            var depth_array = Ext.pluck(Ext.pluck(selected, 'data'), 'depth');
            var uniq_depth_array = Ext.Array.unique(depth_array);
            if(uniq_leaf_array.length === 1 && uniq_depth_array.length === 1 && uniq_leaf_array[0] === true) {
                //如果是全部选的同一层级的叶子，则允许批量加/减价
                batch_btn.enable();
            }else{
                batch_btn.disable();
            }
            delete_btn.enable();
        }
    },

    deleteSelection: function() {
        var me = this;
        Ext.Msg.confirm('确认删除', '真的要删除选中的所有报价项？', function(button){
            if (button === 'yes') {
                Ext.Array.each(me.getItemgrid().getSelectedItems(), function(item, index, allItems) {
                    item.remove();
                });
//                me.getController('Quotes').reCalculateTree();
                me.reCalculateTree();
                Ext.ComponentQuery.query('quote_item_tree')[0].getSelectionModel().select([]);//先把下面quote_item_tree选中的清空，不然新增的产品挂不上
//                me.reCalculateTree();
            } else {
                return false;
            }
        });
    },
    
    editOrExpand: function(view, record, item, index, e, eOpts) {
        if(record.data.leaf) {
            this.editQuoteItem()
        }else{
            this.editQuoteBlock();
        }
    },

    addQuoteBlock: function() {
        var me = this;
        load_uniq_controller(me, 'quote.BlockForm');
        var view = Ext.widget('quote_block_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.show();
        btn_update.hide();
//        this.getCurrencyFromHidden();
    },
    addQuoteItem: function() {
        var me = this;
        load_uniq_controller(me, 'quote.ItemForm');
        var view = Ext.widget('quote_item_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.show();
        btn_update.hide();
        var product_combo = view.down('[name=product_id]', false);
        product_combo.getStore().getProxy().setExtraParam('vendor_unit_id', null)

//        this.getCurrencyFromHidden();
    },
//    /**
//     * 从allCurrency值中找到汇率，赋给两个form中的hidden
//     */
//    getCurrencyFromHidden: function() {
//        Ext.Ajax.request({
//            url:'servlet/OtherJson?dictionaries_type=exchange_rate',
//            params: {
//                query: 4
//            },
//            method: 'get',
//            success:function(response){
//                //                Ext.example.msg("OK", "修改成功！");
//                var exchange_rate_hash_field = Ext.ComponentQuery.query('[name=exchange_rate_hash]')[0];
//                var source_array = Ext.decode(response.responseText)['currencies'];
//                var target_array = [];
//                Ext.Array.each(source_array, function(item, index, allItems) {
//                    var o = {
//                        'currency': item['name'],
//                        'exchange_rate': item['exchange_rate']
//                    }
//                    target_array.push(o);
//                });
//                exchange_rate_hash_field.setValue(Ext.encode(target_array));
//            },
//            failure:function(){
//                Ext.Msg.alert('错误','获取后台汇率失败，请检查网络。');
//            }
//        });
//    },

    /**
     * 批量新增报价项的窗口
     */
    batchAddProduct: function() {
        var me = this;
        load_uniq_controller(me, 'quote.BatchProductForm');
        Ext.ComponentQuery.query('functree')[0].tempBatchProduct = {};
        var view = Ext.widget('quote_batch_product_form').show();
        var product_box_field = view.down('expandable_product_box_select', false);
        var product_box = product_box_field.down('boxselect', false);
        product_box.getStore().getProxy().setExtraParam('vendor_unit_id', null);
        product_box.reset();
    },

    editQuoteBlock: function() {
        var me = this;
        load_uniq_controller(me, 'quote.BlockForm');
        var record = this.getItemgrid().getSelectedItem();
        var view = Ext.widget('quote_block_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.hide();
        btn_update.show();

        record['data']['source_price_amount'] = record['data']['original_unit_price'];
        record['data']['source_price_currency_id'] = record['data']['original_currency_id'];

        record['data']['system_price_amount'] = record['data']['system_price'];
        record['data']['system_price_currency_id'] = record['data']['currency_id'];

        record['data']['system_discount_amount'] = record['data']['system_discount'];
        record['data']['system_discount_currency_id'] = record['data']['currency_id'];

        if(isNaN(Number(record['data']['item_total_amount']))) {
            record['data']['unit_price_amount'] = record['data']['system_price_amount'] - record['data']['system_discount_amount'];
        }else{
            record['data']['unit_price_amount'] = record['data']['item_total_amount'] - record['data']['system_discount_amount'];
        }
        record['data']['unit_price_currency_id'] = record['data']['currency_id'];

        record['data']['discount_to_amount'] = record['data']['discount_to'];
        record['data']['discount_to_currency_id'] = record['data']['currency_id'];

        record['data']['discount_amount'] = record['data']['discount'];
        record['data']['discount_currency_id'] = record['data']['currency_id'];

        record['data']['total_currency_id'] = record['data']['currency_id'];

        if(record['data']['quantity_2'] === 0) record['data']['quantity_2'] = "";
        if(record['data']['times_1'] === 0 || record['data']['times_1'] === 1) record['data']['times_1'] = "";
        if(record['data']['times_2'] === 0 || record['data']['times_2'] === 1) record['data']['times_2'] = "";
        if(record['data']['divide_1'] === 0 || record['data']['divide_1'] === 1) record['data']['divide_1'] = "";
        if(record['data']['divide_2'] === 0 || record['data']['divide_2'] === 1) record['data']['divide_2'] = "";
        
        //赋汇率
        var exchange_rate_field = view.down('[name=exchange_rate]', false);
        var currency = Ext.ComponentQuery.query('quote_item_fee [name=currency_id]')[0].getValue();
        var exchange_rate_hash = Ext.ComponentQuery.query('functree')[0].allCurrency;
        Ext.Array.each(exchange_rate_hash, function(item, index, allItems) {
            if(item["id"] === currency) {
                exchange_rate_field.setValue(item["exchange_rate"]);
                record['data']['exchange_rate'] = item["exchange_rate"];
                return false;
            }
        });

        //TODO 感觉上修改的时候还要把当前记录中的值赋给exchange_rate_hash，但好像不赋也没问题……
        view.down('form', false).loadRecord(record);
//        console.log(record.get('exchange_rate'));
//        console.log();

        //给combo做一个假的store以正确显示值
        var vendor_unit_combo = view.down('[name=vendor_unit_id]', false);
        vendor_unit_combo.getStore().loadData([[record.get('vendor_unit_id'), record.get('vendor_unit_name')]]);
        vendor_unit_combo.setValue(record.get('vendor_unit_id'));

//        Ext.getStore('dict.Currencies').load(
//            {
//                callback: function(records, operation, success) {
////                    console.log(record['data']['item_total_amount']);
//                }
//            }
//        );
    },
    editQuoteItem: function() {
        var me = this;
        load_uniq_controller(me, 'quote.ItemForm');
        var record = this.getItemgrid().getSelectedItem();
        var view = Ext.widget('quote_item_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.hide();
        btn_update.show();

        record['data']['source_price_amount'] = record['data']['original_unit_price'];
        record['data']['source_price_currency_id'] = record['data']['original_currency_id'];

        record['data']['unit_price_amount'] = record['data']['unit_price'];
        record['data']['unit_price_currency_id'] = record['data']['currency_id'];

        record['data']['discount_amount'] = record['data']['discount'];
        record['data']['discount_currency_id'] = record['data']['currency_id'];

        record['data']['discount_to_amount'] = record['data']['discount_to'];
        record['data']['discount_to_currency_id'] = record['data']['currency_id'];

        record['data']['total_currency_id'] = record['data']['currency_id'];

        if(record['data']['quantity_2'] === 0) record['data']['quantity_2'] = "";
        if(record['data']['times_1'] === 0 || record['data']['times_1'] === 1) record['data']['times_1'] = "";
        if(record['data']['times_2'] === 0 || record['data']['times_2'] === 1) record['data']['times_2'] = "";
        if(record['data']['divide_1'] === 0 || record['data']['divide_1'] === 1) record['data']['divide_1'] = "";
        if(record['data']['divide_2'] === 0 || record['data']['divide_2'] === 1) record['data']['divide_2'] = "";

        //赋汇率
        var exchange_rate_field = view.down('[name=exchange_rate]', false);
        var currency = Ext.ComponentQuery.query('quote_item_fee [name=currency_id]')[0].getValue();
        var exchange_rate_hash = Ext.ComponentQuery.query('functree')[0].allCurrency;
        Ext.Array.each(exchange_rate_hash, function(item, index, allItems) {
            if(item["id"] === currency) {
                exchange_rate_field.setValue(item["exchange_rate"]);
                record['data']['exchange_rate'] = item["exchange_rate"];
                return false;
            }
        });

        //TODO 感觉上修改的时候还要把当前记录中的值赋给exchange_rate_hash，但好像不赋也没问题……
        view.down('form', false).loadRecord(record);
        //给combo做一个假的store以正确显示值
        var vendor_unit_combo = view.down('[name=vendor_unit_id]', false);
        vendor_unit_combo.getStore().loadData([[record.get('vendor_unit_id'), record.get('vendor_unit_name')]]);
        vendor_unit_combo.setValue(record.get('vendor_unit_id'));

        var product_combo = view.down('[name=product_id]', false);
        product_combo.getStore().loadData([{'id': record.get('product_id'), 'model': record.get('product_model')}]);
        product_combo.setValue(record.get('product_id'));
        product_combo.getStore().getProxy().setExtraParam('vendor_unit_id', record.get('vendor_unit_id'))
    },

    batchMarkUpDown: function() {
        var me = this;
        load_uniq_controller(me, 'quote.BatchMarkUpDownForm');
        Ext.widget('quote_batch_mark_up_down_form').show();
    },

    manageExchangeRate: function() {
        var me = this;
        load_uniq_controller(me, 'exchange_rate.Form');
        Ext.widget('exchange_rate_form').show();
    },

    /**
     * “运保费”下拉框的可用/不可用切换，同时设置成和报价的币种一致
     * @param combo
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    triggerFIF: function(combo, newValue, oldValue, eOpts) {
        var container = combo.up('container');
        var fif_field = container.down('[name=fif_currency_id]', false);
        var final_field = container.up('quote_detail').down('[name=final_price]', false);
        var show_final_field = container.up('quote_detail').down('[name=show_footer_final_price]', false);
        var show_rmb_field = container.up('quote_detail').down('[name=show_footer_rmb]', false);
        
        //产品币种是“混合”，则亮起“运保费币种”(并设为默认“RMB”)、灰掉“总计”、不勾选“PDF设置”里的“显示‘总计’”
        if(newValue === 1) {
            fif_field.enable();
            fif_field.setValue(11);
            final_field.disable();
            show_final_field.setValue(false);
            show_final_field.disable();
        }else{
            fif_field.disable();
            fif_field.setValue(newValue);
            final_field.enable();
            show_final_field.enable();
        }
        
        //产品币种是RMB或者“混合”，则灰掉“清关费用”、灰掉“折合人民币”、不勾选“PDF设置”里的“显示‘折合人民币’”
//        if(newValue != 11 || newValue === 1) {
//            declaration_fee_field.disable();
//        }else{
//            declaration_fee_field.enable();
//        }
        //目前是：不管何时都不灰掉任何东西，最后在PDF里显示时判断一下 20130122
        if(newValue === 11 || newValue === 1) {
//            rmb_field.disable();
            show_rmb_field.setValue(false);
//            show_rmb_field.disable();
        }else{
//            rmb_field.enable();
//            show_rmb_field.enable();
        }

//        //另外由它的值控制新增报价/系统/子系统按钮的可用/不可用，以免忘记选
        var tree = Ext.ComponentQuery.query('quote_item_tree')[0];
//        var add_sys_btn = tree.down('button[action=addQuoteBlock]', false);
//        var add_itm_btn = tree.down('button[action=addQuoteItem]', false);
//        var batch_add_itm_btn = tree.down('button[action=batchAddProduct]', false);
//        add_sys_btn.setDisabled(Ext.isEmpty(newValue));
//        add_itm_btn.setDisabled(Ext.isEmpty(newValue));
//        batch_add_itm_btn.setDisabled(Ext.isEmpty(newValue));

        //当树中已经有内容时，全部改币种并提示
        var root = tree.getRootNode();
        var array = [];
        this.getAllChildrenNode(root, array);
        if(newValue > 10) {
            Ext.Array.each(array, function(item, index, allItems) {
                item.set('currency', combo.getRawValue());
                item.set('currency_id', newValue);
            });
            Ext.example.msg('<span style="color: red; ">注意</span>', '产品币种已经修改，请及时调整报价项目的价格！');
        }
    },

    /**
     * “增值税”和“最大关税”两项的可用/不可用切换
     * @param checkbox
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    triggerTaxes: function(checkbox, newValue, oldValue, eOpts) {
        var container = checkbox.up('container');
        var max_custom_tax_field = container.down('[name=max_custom_tax]', false);
        var vat_field = container.down('[name=vat]', false);
        max_custom_tax_field.setDisabled(!newValue);
        vat_field.setDisabled(!newValue);
        if(newValue) vat_field.setValue(17);
        var panel = container.up('panel').up('panel');
        var show_footer_rmb_checkbox = panel.down('quote_item_config [name=show_footer_rmb]', false);
        show_footer_rmb_checkbox.setValue(newValue);
    },

    triggerCity: function(combo, newValue, oldValue, eOpts) {
        var field = combo.up().down('textfield', false);
        field.setDisabled(newValue === 3);
    },

    /**
     * “签合同后”付款方式的TT/LC切换
     * @param combo
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    triggerFlagTTLC: function(combo, newValue, oldValue, eOpts) {
        var form = combo.up('form');
        var field1 = form.down('[name=flag_1]', false);
        var field2 = form.down('[name=flag_2]', false);
        var field3 = form.down('[name=flag_3]', false);
        field1.setDisabled(newValue === "1");
        field2.setDisabled(newValue != "1");
        field3.setDisabled(newValue != "1");
    },

    /**
     * 下面一排checkbox对其后内容的可用/不可用切换
     * @param checkbox
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    triggerFlagUnify: function(checkbox, newValue, oldValue, eOpts) {
        var name_array = ['is_include_tax', 'is_delivery', 'is_warranty', 'has_warranty_priority', 'need_disassemble', 'need_on-site', 'is_special_discount'];
        if(Ext.Array.contains(name_array, checkbox.name)) {
            var container = checkbox.up('fieldcontainer').down('container', false);
            container.setDisabled(!newValue);
        }
    },

    reCalculateTree: function() {
        var root = Ext.getStore('QuoteItems').getRootNode();
        var sum_total = 0;
        var max_custom_tax_field = Ext.ComponentQuery.query('[name=max_custom_tax]')[0];
        max_custom_tax_field.setValue(0);
        this.updateAllNodes(root, sum_total);
    },
    /**
     * 递归更新树中所有的元素数据
     * @param node
     * @param sum
     */
    updateAllNodes: function updateNodes(node, sum) {
        if(node.childNodes.length > 0) {
            sum = 0;
            for(var i = 0; i < node.childNodes.length; i++) {
                //第一次递归的时候node是root，所以用node.parentNode来判断
                //node.childNode[i]才表示的是人类思维中的“本层”
                if(node.parentNode) {
                    node.childNodes[i].set('inner_id', node.data['inner_id'] + '-' + String(i + 1));
                }else{
                    node.childNodes[i].set('inner_id', String(i + 1));
                }
//                console.log(node.childNodes[i].get('custom_tax'));
//                console.log(max_custom_tax);
                var max_custom_tax_field = Ext.ComponentQuery.query('[name=max_custom_tax]')[0];
                if(node.childNodes[i].get('custom_tax') * 100 > max_custom_tax_field.getValue()) {
                    max_custom_tax_field.setValue((node.childNodes[i].get('custom_tax') * 100).toFixed(0));
                }
                updateNodes(node.childNodes[i], sum);
            }
        }
        for(var j = 0; j < node.childNodes.length; j++) {
            sum += node.childNodes[j].data['total'];
            node.set('unit_price', sum);
            node.set('total', (sum - node.get('discount')) * node.get('quantity'));
            if(node.childNodes.length > 0) {
                node.set('item_total_amount', sum);
                node.set('item_total_currency_id', null);
                node.set('discount_to', (sum - node.get('discount')));
            }
        }

        if(node === Ext.getStore('QuoteItems').getRootNode()) {
            var total_price_field = Ext.ComponentQuery.query('quote_item_foot [name=total]')[0];
            total_price_field.setValue(sum);
        }
    },

    /**
     * 当“合计”区域改变的时候计算“总计”
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateFinalPriceWithTotalPrice: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var panel = form.up('panel');
        var total_price = newValue;

//        var custom_tax_field = panel.down('[name=max_custom_tax]', false);
//        var custom_tax = custom_tax_field.isDisabled() ? 0 : custom_tax_field.getValue();

        var vat_field = panel.down('[name=vat]', false);
        var vat = vat_field.isDisabled() ? 0 : Number(vat_field.getValue());//displayfield，取出来是字符串，要Number一下

        var less_special_discount_field = form.down('[name=total_discount]', false);
        var less_special_discount = less_special_discount_field.getValue();

        var freight_insurance_cost_field = form.down('[name=fif]', false);
        var freight_insurance_cost = freight_insurance_cost_field.getValue();

        var final_price_field = form.down('[name=final_price]', false);
        var final_price = this.calculateFinalPrice(total_price, less_special_discount, freight_insurance_cost);
        final_price_field.setValue(final_price);

        //再根据“合计”和“折”算出总折扣
        var x_discount_field = form.down('[name=x_discount]', false);
        var x_discount = x_discount_field.getValue();
        this.calculateFinalDiscount(newValue, x_discount);
    },

    calculateDiscountWithXDiscount: function(numberfield, newValue) {
        var form = numberfield.up('form');
        var total_price_field = form.down('[name=total]', false);
        var total_price = total_price_field.getValue();

        this.calculateFinalDiscount(total_price, newValue);
    },

    /**
     * 根据“合计”和“折”算出总折扣
     * @param final_price
     * @param x_discount
     * 总折扣 = 合计 * (1 - 折)，再往下取整至5或10
     * 比如算出来是折掉8.30元，就算成折掉5元；算出来是折掉13.30元，就算成折掉10元
     */
    calculateFinalDiscount: function(final_price, x_discount) {
        if (x_discount === 0 || x_discount === null) x_discount = 1;
        var total_discount_field = Ext.ComponentQuery.query('[name=total_discount]')[0];
        total_discount_field.setValue(Math.floor((final_price * (1 - x_discount)).toFixed(2) / 5) * 5);
    },

    /**
     * 当“总折扣”区域改变的时候计算“总计”
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateFinalPriceWithLessSpecialDiscount: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var panel = form.up('panel');
        var total_price_field = form.down('[name=total]', false);
        var total_price = total_price_field.getValue();

//        var custom_tax_field = panel.down('[name=max_custom_tax]', false);
//        var custom_tax = custom_tax_field.isDisabled() ? 0 : custom_tax_field.getValue();

        var vat_field = panel.down('[name=vat]', false);
        var vat = vat_field.isDisabled() ? 0 : Number(vat_field.getValue());//displayfield，取出来是字符串，要Number一下

        var less_special_discount = newValue;

        var freight_insurance_cost_field = form.down('[name=fif]', false);
        var freight_insurance_cost = freight_insurance_cost_field.getValue();

        var final_price_field = form.down('[name=final_price]', false);
        var final_price = this.calculateFinalPrice(total_price, less_special_discount, freight_insurance_cost);
        final_price_field.setValue(final_price);
    },

    /**
     * 当“运保费”区域改变的时候计算“总计”
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateFinalPriceWithFreightInsuranceCost: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var panel = form.up('panel');
        var total_price_field = form.down('[name=total]', false);
        var total_price = total_price_field.getValue();

        var custom_tax_field = panel.down('[name=max_custom_tax]', false);
        var custom_tax = custom_tax_field.isDisabled() ? 0 : custom_tax_field.getValue();

        var vat_field = panel.down('[name=vat]', false);
        var vat = vat_field.isDisabled() ? 0 : Number(vat_field.getValue());//displayfield，取出来是字符串，要Number一下

        var less_special_discount_field = form.down('[name=total_discount]', false);
        var less_special_discount = less_special_discount_field.getValue();

        var freight_insurance_cost = newValue;

        var final_price_field = form.down('[name=final_price]', false);
        var final_price = this.calculateFinalPrice(total_price, less_special_discount, freight_insurance_cost);
        final_price_field.setValue(final_price);
    },

    /**
     * 当“最大关税”区域改变的时候计算“总计”
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateFinalPriceWithMaxCustomTax: function(displayfield, newValue, oldValue, eOpts) {
        var form = displayfield.up('form');
        var panel = form.up('panel');
        var total_price_field = panel.down('[name=total]', false);
        var total_price = total_price_field.getValue();

        var custom_tax_field = form.down('[name=max_custom_tax]', false);
        var custom_tax = custom_tax_field.isDisabled() ? 0 : custom_tax_field.getValue();

        var vat = displayfield.isDisabled() ? 0 : Number(newValue);//displayfield，取出来是字符串，要Number一下

        var less_special_discount_field = panel.down('[name=total_discount]', false);
        var less_special_discount = less_special_discount_field.getValue();

        var freight_insurance_cost_field = panel.down('[name=fif]', false);
        var freight_insurance_cost = freight_insurance_cost_field.getValue();

        var final_price_field = panel.down('[name=final_price]', false);
        var final_price = this.calculateFinalPrice(total_price, less_special_discount, freight_insurance_cost);
        final_price_field.setValue(final_price);
    },
    calculateFinalPriceWithMaxCustomTaxZ: function(displayfield, eOpts) {
        this.calculateFinalPriceWithMaxCustomTax(displayfield, displayfield.getValue(), null, null);
    },

    /**
     * 当“增值税”区域改变的时候计算“折合人民币”
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateRmbWithVat: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var panel = form.up('panel');
        var final_price_field = panel.down('[name=final_price]', false);
        var final_price = final_price_field.getValue();

        var custom_tax_field = form.down('[name=max_custom_tax]', false);
        var custom_tax = custom_tax_field.isDisabled() ? 0 : Number(custom_tax_field.getValue());//displayfield，取出来是字符串，要Number一下

        var vat = numberfield.isDisabled() ? 0 : newValue;

        var declaration_fee_field = panel.down('[name=declaration_fee]', false);
        var declaration_fee = declaration_fee_field.getValue();

        var rmb_field = panel.down('[name=rmb]', false);
        var rmb = this.calculateRmb(final_price, custom_tax, vat, declaration_fee);
        rmb_field.setValue(rmb);
    },
    calculateRmbWithVatZ: function(numberfield, eOpts) {
        this.calculateRmbWithVat(numberfield, numberfield.getValue(), null, null);
    },

    /**
     * 根据“合计”、“总折扣”、“运保费”得出“总计”
     * @param total_price
     * @param less_special_discount
     * @param freight_insurance_cost
     * 总计 = 合计 + 运保费 - 总折扣
     */
    calculateFinalPrice: function(total_price, less_special_discount, freight_insurance_cost) {
        var final_price = total_price + freight_insurance_cost - less_special_discount;
        return Math.ceil(final_price);
    },
    
    /**
     * 当“总计”区域改变时计算“折合人民币”
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateRmbWithFinalPrice: function(numberfield, newValue, oldValue, eOpts) {
        var panel = numberfield.up('panel').up('panel');
        var declaration_fee_field = panel.down('[name=declaration_fee]', false);
        var declaration_fee = declaration_fee_field.getValue();
        var custom_tax_field = panel.down('[name=max_custom_tax]', false);
        var custom_tax = custom_tax_field.isDisabled() ? 0 : custom_tax_field.getValue();

        var vat_field = panel.down('[name=vat]', false);
        var vat = vat_field.isDisabled() ? 0 : Number(vat_field.getValue());//displayfield，取出来是字符串，要Number一下

        var rmb_field = panel.down('[name=rmb]', false);
        var rmb = this.calculateRmb(newValue, custom_tax, vat, declaration_fee);
        rmb_field.setValue(rmb);
    },
    /**
     * 当“清关费用”区域改变时计算“折合人民币”
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateRmbWithDeclarationFee: function(numberfield, newValue, oldValue, eOpts) {
        var panel = numberfield.up('panel').up('panel');
        var final_price_field = panel.down('[name=final_price]', false);
        var custom_tax_field = panel.down('[name=max_custom_tax]', false);
        var custom_tax = custom_tax_field.isDisabled() ? 0 : custom_tax_field.getValue();

        var vat_field = panel.down('[name=vat]', false);
        var vat = vat_field.isDisabled() ? 0 : Number(vat_field.getValue());//displayfield，取出来是字符串，要Number一下

        var rmb_field = panel.down('[name=rmb]', false);
        var rmb = this.calculateRmb(final_price_field.getValue(), custom_tax, vat, newValue);
        rmb_field.setValue(rmb);
    },

    /**
     * 根据“总计”、“最大关税”、“增值税”和“清关费用”得出“折合人民币”
     * @param final_price
     * @param custom_tax
     * @param vat
     * @param declaration_fee
     * 折合人民币 = (总计 * (1 + 最大关税) * (1 + 增值税) * 汇率 / 100) + 清关费用
     */
    calculateRmb: function(final_price, custom_tax, vat, declaration_fee) {
        var exchange_rate_hash = Ext.ComponentQuery.query('functree')[0].allCurrency;

        var quote_currency_field = Ext.ComponentQuery.query('combo[name=currency_id]')[0];
        var quote_currency = quote_currency_field.getValue();

        var quote_exchange_rate = 100;
        Ext.Array.each(exchange_rate_hash, function(item, index, array) {
            if(item['id'] === quote_currency) {
                quote_exchange_rate = item['exchange_rate'];
                return false;
            }
        });

        return (Math.ceil((final_price * (1 + custom_tax * 0.01) * (1 + vat * 0.01) * quote_exchange_rate / 100) + declaration_fee));
    },

    submit: function(button) {
//        var info_field = Ext.ComponentQuery.query('quote_info')[0];
//        var item_config_field = Ext.ComponentQuery.query('quote_item_config')[0];
//        var item_fee_field = Ext.ComponentQuery.query('quote_item_fee')[0];
//        var item_foot_field = Ext.ComponentQuery.query('quote_item_foot')[0];
//        var term_field = Ext.ComponentQuery.query('quote_term')[0];
//
//        var city_of_term_field = term_field.down('[name=city_of_term]', false);
//        var price_type_of_term_field = term_field.down('[name=price_type_of_term]', false);
//
//        if(city_of_term_field.getValue() === '' && price_type_of_term_field.getValue() != 3) {
//            city_of_term_field.markInvalid('请填写城市！');
//            term_field.form.isOK = false;
//        }else{
//            city_of_term_field.clearInvalid();
//            term_field.form.isOK = true;
//        }
//
//        if(!info_field.form.isValid() || !item_config_field.form.isValid() || !item_fee_field.form.isValid() || !item_foot_field.form.isValid() || !term_field) {
//            Ext.example.msg("不行", EIM_multi_field_invalid);
//            return false;
//        }
//
//        var node = Ext.getStore('QuoteItems').getRootNode();
//        var tree_array = [];
//        this.getAllNodes(node, tree_array);
//        //递归的结果是每一行都把children算进去了一次，所以要去掉
//        Ext.Array.each(tree_array, function(item, index, array) {
//            delete item["children"];
//
//            //生成id和父id传到后台
//            item["id"] = index + 1;
//            if(item["inner_id"].indexOf("-") === -1) {
//                //如果不包含“-”，则父id是0
//                item["parent_id"] = 0;
//            }else{
//                var parent_id;
//                var target_number = item["inner_id"].split("-").reverse().slice(1).reverse().join("-");
//                //如果包含，则父id是(inner_id为最后一个“-”之前部分的)那个节点
//                Ext.Array.each(tree_array, function(item, index, array) {
//                    if(item["inner_id"] === target_number) {
//                        parent_id = item["id"];
//                        return false;
//                    }
//                });
//                item["parent_id"] = parent_id;
//            }
//        });
//        //name不能改的自定义组件的提交预处理
//        var submit_info_value = info_field.getValues();
////        submit_info_value['customer_unit_id'] = submit_info_value['hidden_customer_unit_id'];
//
//        var huge_json = Ext.Object.merge(submit_info_value,
//            item_fee_field.getValues(),
//            item_foot_field.getValues()
//        );
//        huge_json['tree'] = Ext.encode(tree_array);
//
//        //一些“私货”的保存，包括：
//        // “是否计算关税/增值税”的选项、最大关税
//        // “混合”时的“运保费币种”、“清关费用”
//        // “最后计算的‘折’”
//        //没地方存了，放这里吧
//        var v = item_config_field.getValues();
////        v['fif_currency_id'] = item_fee_field.down('[name=fif_currency_id]', false).getValue();
////        v['does_count_ctvat'] = item_fee_field.down('[name=does_count_ctvat]', false).getValue();
////        v['vat'] = item_fee_field.down('[name=vat]', false).getValue();
////        v['max_custom_tax'] = item_fee_field.down('[name=max_custom_tax]', false).getValue();
////        v['declaration_fee'] = item_fee_field.down('[name=declaration_fee]', false).getValue();
////        v['x_discount'] = item_foot_field.down('[name=x_discount]', false).getValue();
//        huge_json['item_config'] = Ext.encode(v);
//        huge_json['term'] = Ext.encode(term_field.getValues());
        
        var selection = Ext.ComponentQuery.query('quote_grid')[0].getSelectedItem();
        var quote_number = selection.get('quote_number');
        
        if(button.action === "save") {
            Ext.getBody().mask('报价保存中……');
            Ext.Ajax.request({
                url:'servlet/QuoteServlet?type=quote_item_add',
                params: huge_json,
                success: function(response) {
                    Ext.example.msg('成功', '报价保存成功');
                    Ext.getBody().unmask();
                    Ext.getStore('Quotes').load();
                },
                failure: function() {
                    Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                }
            });
        }else if(button.action === "save_as"){
            Ext.getBody().mask('新报价保存中……');
            Ext.Ajax.request({
                url:'servlet/QuoteServlet?type=quote_saveas',
                params: huge_json,
                success: function(response) {
                    Ext.example.msg('成功', '报价保存成功');
                    Ext.getBody().unmask();
                    Ext.getStore('Quotes').load();
                },
                failure: function() {
                    Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                }
            });
        }else{
            Ext.getBody().mask('PDF生成中……');
            Ext.Ajax.request({
                url:'servlet/QuoteServlet?type=quote_pdf',
                params: huge_json,
                success: function(response) {
                    Ext.example.msg('成功', 'PDF生成成功，现在就<a href=\'servlet/QuoteServlet?type=downpdf&quote_number=' + quote_number + '\' target=\'_blank\'>下载</a>吗？', null, null, 5000);
                    Ext.getBody().unmask();
                    Ext.getStore('Quotes').load();
                },
                failure: function() {
                    Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                }
            });
        }
    },

    addLog: function(button) {
        Ext.Ajax.request({
            url: 'servlet/QuoteServlet?type=quote_finish',
            params: {
                'quote_id': button.up('panel').down('[name=quote_id]', false).getValue()
            },
            success: function(response) {
                Ext.example.msg('成功', '报价已经彻底做好，销售将得到通知。');
                Ext.getStore('Quotes').load();
            },
            failure: function() {
                Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
            }
        });
    },
    /**
     * 递归取得树中所有的元素数据
     * @param node
     * @param array
     */
    getAllNodes: function getNodesData(node, array) {
//        console.log(node.data);
        if(node.data['inner_id'] != "") array.push(node.data);
        if(node.childNodes.length > 0) {
            for(var i = 0; i < node.childNodes.length; i++) {
                getNodesData(node.childNodes[i], array);
            }
        }
    },
    /**
     * 递归取得树中所有的节点
     * @param node
     * @param array
     */
    getAllChildrenNode: function getNodes(node, array) {
//        console.log(node.data);
        array.push(node);
        if(node.childNodes.length > 0) {
            for(var i = 0; i < node.childNodes.length; i++) {
                getNodes(node.childNodes[i], array);
            }
        }
    },
    
    /*
     * 总折扣是0时默认不显示在PDF上
     * @param numberfield
     * @param newValue
     */
    triggerTotalDiscountCheck: function(numberfield, newValue) {
        var form = numberfield.up('form');
        var panel = form.up('panel');
        var checkbox = panel.down('checkbox[name=show_footer_discount]', false);
        if(newValue === 0 || newValue === null) {
            checkbox.setValue(false);
        }else{
            checkbox.setValue(true);
        }
    },
    
    /*
     * 运保费是0时默认不显示在PDF上
     * @param numberfield
     * @param newValue
     */
    triggerFIFCheck: function(numberfield, newValue) {
        var form = numberfield.up('form');
        var panel = form.up('panel');
        var checkbox = panel.down('checkbox[name=show_footer_freight_insurance_cost]', false);
        if(newValue === 0 || newValue === null) {
            checkbox.setValue(false);
        }else{
            checkbox.setValue(true);
        }
    },

    /**
     * 选成英文报价时，默认不折合人民币
     * @param combo
     * @param newValue
     */
    triggerRMBCheck: function(combo, newValue) {
        var checkbox = combo.up('tabpanel').down('checkbox[name=show_footer_rmb]', false);
        if(newValue === 2) {
            //“混合”的时候灰掉
            checkbox.setValue(false);
            checkbox.disable();
        }else{
            checkbox.enable();
        }
    },

    /**
     * 工作流状态下多按钮提交，合并之后的事件
     */
    workflow_submit: function(button) {
        var me = this;
        var quote_id = (me.getGrid().getSelectedItem()).get("id");

        var info_field = Ext.ComponentQuery.query('quote_info')[0];
        var item_config_field = Ext.ComponentQuery.query('quote_item_config')[0];
        var item_fee_field = Ext.ComponentQuery.query('quote_item_fee')[0];
        var item_foot_field = Ext.ComponentQuery.query('quote_item_foot')[0];
        var term_field = Ext.ComponentQuery.query('quote_term')[0];

        var city_of_term_field = term_field.down('[name=city_of_term]', false);
        var price_type_of_term_field = term_field.down('[name=price_type_of_term]', false);

        if(city_of_term_field.getValue() === '' && price_type_of_term_field.getValue() != 3) {
            city_of_term_field.markInvalid('请填写城市！');
            term_field.form.isOK = false;
        }else{
            city_of_term_field.clearInvalid();
            term_field.form.isOK = true;
        }

        var leafCount = 0;
        me.getGrid().up().down('quote_item_tree', false).getRootNode().cascadeBy(function(){leafCount++;});
        if(leafCount === 1) {
            Ext.example.msg("不行", '没有报价项！');
            return false;//没有产品不让提交
        }

        if(button.action != "sale_create") {
            //初次提交不校验
            if(!info_field.form.isValid() || !item_config_field.form.isValid() || !item_fee_field.form.isValid() || !item_foot_field.form.isValid() || !term_field.form.isOK) {
                Ext.example.msg("不行", EIM_multi_field_invalid);
                return false;
            }
        }

        var node = Ext.getStore('QuoteItems').getRootNode();
        var tree_array = [];
        this.getAllNodes(node, tree_array);
        //递归的结果是每一行都把children算进去了一次，所以要去掉
        Ext.Array.each(tree_array, function(item, index, array) {
            delete item["children"];

            //生成id和父id传到后台
            item["id"] = index + 1;
            if(item["inner_id"].indexOf("-") === -1) {
                //如果不包含“-”，则父id是0
                item["parent_id"] = 0;
            }else{
                var parent_id;
                var target_number = item["inner_id"].split("-").reverse().slice(1).reverse().join("-");
                //如果包含，则父id是(inner_id为最后一个“-”之前部分的)那个节点
                Ext.Array.each(tree_array, function(item, index, array) {
                    if(item["inner_id"] === target_number) {
                        parent_id = item["id"];
                        return false;
                    }
                });
                item["parent_id"] = parent_id;
            }
        });
        //name不能改的自定义组件的提交预处理
        var submit_info_value = info_field.getValues();
        //        submit_info_value['customer_unit_id'] = submit_info_value['hidden_customer_unit_id'];

        var huge_json = Ext.Object.merge(submit_info_value,
            item_fee_field.getValues(),
            item_foot_field.getValues()
        );
        //“最大关税”、“增值税”灰掉仍提交
        huge_json['max_custom_tax'] = item_fee_field.down('[name=max_custom_tax]', false).getValue();
        huge_json['vat'] = item_fee_field.down('[name=vat]', false).getValue();
        huge_json['tree'] = Ext.encode(tree_array);
        //一些“私货”的保存，包括：
        // “混合”时的“运保费币种”、“清关费用”
        // “最后计算的‘折’”
        //没地方存了，放这里吧
        //TODO 新的数据结构应该精简这些
        var v = item_config_field.getValues();
//        v['x_discount'] = item_foot_field.down('[name=x_discount]', false).getValue();
        huge_json['pdf'] = Ext.encode(v);
        huge_json['term'] = Ext.encode(term_field.getValues());

        switch(button.action){
            case "sale_create":
                huge_json['id'] = quote_id;
                huge_json['event'] = 'sale_create';//交至商务
                Ext.Ajax.request({
                    url:'quotes/process_workflow',
                    params: huge_json,
                    success: function() {
                        Ext.example.msg('成功', '报价请求已发送给商务');
                        Ext.getStore('Quotes').load();
                    },
                    failure: function() {

                    }
                });
                break;
            case "business_check":
                huge_json['id'] = quote_id;
                huge_json['event'] = 'business_check';//报价生成
                Ext.Ajax.request({
                    url:'quotes/process_workflow',
                    params: huge_json,
                    success: function() {
                        Ext.example.msg('成功', '报价已保存');
                        Ext.getStore('Quotes').load();
                    },
                    failure: function() {

                    }
                });
                break;
            case "business_first_done":
                huge_json['id'] = quote_id;
                huge_json['event'] = 'business_first_done';//报价生成
                Ext.Ajax.request({
                    url:'quotes/process_workflow',
                    params: huge_json,
                    success: function() {
                        Ext.example.msg('成功', '报价已生成，消息已发送给销售');
                        Ext.getStore('Quotes').load();
                    },
                    failure: function() {

                    }
                });
                break;
            case "sale_check_fail":
                Ext.MessageBox.prompt("问题描述", "请输入具体问题描述", function(button, text) {
                    if(button === "ok") {
                        huge_json['id'] = quote_id;
                        huge_json['event'] = 'sale_check_fail';//有问题
                        huge_json['issue'] = text;
                        Ext.Ajax.request({
                            url:'quotes/process_workflow',
                            params: huge_json,
                            success: function(response) {
                                Ext.example.msg('成功', '问题已发送给商务');
                                Ext.getStore('Quotes').load();
                            },
                            failure: function() {

                            }
                        });
                    }
                });
                break;
            case "business_fix":
                huge_json['id'] = quote_id;
                huge_json['event'] = 'business_fix';//商务改完
                Ext.Ajax.request({
                    url:'quotes/process_workflow',
                    params: huge_json,
                    success: function(response) {
                        Ext.example.msg('成功', '报价修改完成的消息已发送给销售');
                        Ext.getStore('Quotes').load();
                    },
                    failure: function() {

                    }
                });
                break;
            case "sale_check_ok":
                huge_json['id'] = quote_id;
                huge_json['event'] = 'sale_check_ok';//商务改完
                Ext.Ajax.request({
                    url:'quotes/process_workflow',
                    params: huge_json,
                    success: function(response) {
                        Ext.example.msg('成功', '报价已完结');
                        Ext.getStore('Quotes').load();
                    },
                    failure: function() {

                    }
                });
                break;
            case "save_as":
                huge_json['id'] = null;
                huge_json['event'] = 'save_as';//保存为新报价
                Ext.Ajax.request({
                    url:'quotes/process_workflow',
                    params: huge_json,
                    success: function() {
                        Ext.example.msg('成功', '报价请求已发送给商务');
                        Ext.getStore('Quotes').load();
                    },
                    failure: function() {

                    }
                });
                break;
            default:
                break;
        }
    }
});