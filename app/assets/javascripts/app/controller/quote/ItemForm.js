Ext.define('EIM.controller.quote.ItemForm', {
    extend:'Ext.app.Controller',

    stores:[
        'ComboVendorUnits'
    ],
    models:[
        'ComboVendorUnit'
    ],

    views:[
        'quote.ItemForm'
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
            'quote_item_form': {
                show: this.initFields
            },
            'quote_item_form amount_with_currency combo': {
                change: this.linkCurrency
            },
            'quote_item_form combo[name=product_id]': {
                change: function(combo, newValue, oldValue, eOpts){
                    var form = combo.up('form');
                    var source_combo = form.down('[name=source]', false);
                    var source_price_combo = form.down('[name=source_price_currency_id]', false);
                    var source_price_numberfield = form.down('[name=source_price_amount]', false);
                    source_combo.select();
                    source_price_combo.select();
                    source_price_numberfield.setValue();
                },
                select: this.setCustomTaxAndDescription
            },

            'quote_item_form [name=original_exchange_rate]': {
                change: this.calculateUnitPriceWithOriginalExchangeRate
            },
            'quote_item_form [name=exchange_rate]': {
                change: this.calculateUnitPriceWithExchangeRate
            },
            'quote_item_form [name=source]': {
                change: this.loadFourPrices
            },
            'quote_item_form [name=source_price] numberfield': {
                change: this.calculateUnitPriceWithSourcePrice
            },
            'quote_item_form [name=times_1]': {
                change: this.calculateUnitPriceWithTimes
            },
            'quote_item_form [name=divide_1]': {
                change: this.calculateUnitPriceWithDivide
            },

            'quote_item_form [name=unit_price] numberfield': {
                change: this.calculateDiscountWithUnitPrice
            },
            'quote_item_form [name=times_2]': {
                change: this.calculateDiscountWithTimes
            },
            'quote_item_form [name=divide_2]': {
                change: this.calculateDiscountWithDivide
            },
            'quote_item_form [name=discount] numberfield': {
                change: this.calculateDiscountToWithDiscount
            },
            'quote_item_form [name=discount_to] numberfield': {
                change: this.multiCalculate
            },
            'quote_item_form [name=quantity]': {
                change: this.calculateTotalWithQuantity
            },
            'quote_item_form button[action=save], quote_item_form button[action=save_apply]': {
                click: this.validate
            },

            'quote_item_form button[action=update]': {
                click: this.validate
            }
        });
    },

    /**
     * 从“报价币种”处取得币种并赋给关联的那几个combo
     * 并根据“报价格式”判断“数量二”的可用/不可用
     * @param form
     * @param eOpts
     */
    initFields: function(form, eOpts) {
        var quote_currency_field = Ext.ComponentQuery.query('combo[name=currency_id]')[0];
        var quote_currency = quote_currency_field.getValue();

        var link_array = ['unit_price', 'discount', 'discount_to', 'total'];
        var exchange_rate_field = form.down('[name=exchange_rate]', false);

        var exchange_rate_hash = Ext.ComponentQuery.query('functree')[0].allCurrency;

        if(quote_currency > 10) {
            Ext.Array.each(link_array, function(item, index, allItems) {
                var combo = form.down('amount_with_currency[name='+ item +']').down('combo');
                combo.setValue(quote_currency);
                combo.setDisabled(true);
            });
        }

        if(quote_currency === 11) {
            exchange_rate_field.setValue(100);
        }else{
            Ext.Array.each(exchange_rate_hash, function(item, index, array) {
                if(item['id'] === quote_currency) {
                    exchange_rate_field.setValue(item['exchange_rate']);
                    return false;
                }
            });
        }
        //数量二
        var quote_format = Ext.ComponentQuery.query('[name=quote_format]')[0].getValue();
        var quantity_2_field = form.down('[name=quantity_2]', false);
        if(quote_format === "1") {
            quantity_2_field.disable();
            quantity_2_field.allowBlank = true;
            quantity_2_field.labelEl.dom.innerHTML="数量二：";
        }else{
            quantity_2_field.enable();
            quantity_2_field.allowBlank = false;
            quantity_2_field.labelEl.dom.innerHTML="数量二<span class='req' style='color:#ff0000'>*</span>：";
        }
    },

    /**
     * “单价”“折扣”“折至”“小计”四个框的币种是绑定的，一变都变
     * @param combo
     * @param records
     * @param eOpts
     */
    linkCurrency: function(combo, newValue, oldValue, eOpts) {
        var link_array = ['unit_price', 'discount', 'discount_to', 'total'];
        var form = combo.up('form');
        var original_exchange_rate_field = form.down('[name=original_exchange_rate]', false);
        var exchange_rate_field = form.down('[name=exchange_rate]', false);

        var exchange_rate_hash = Ext.ComponentQuery.query('functree')[0].allCurrency;

        if(Ext.Array.contains(link_array, combo.name.split('_currency_id')[0])) {
            Ext.Array.each(link_array, function(item, index, allItems) {
                var amount_with_currency_field = Ext.ComponentQuery.query('quote_item_form amount_with_currency[name='+ item +']')[0];
                var combo = amount_with_currency_field.down('combo');
                combo.setValue(newValue);
                combo.focus();
                combo.blur();
            });
            this.setExchangeRate(newValue, exchange_rate_hash, exchange_rate_field);
        }else{
            this.setExchangeRate(newValue, exchange_rate_hash, original_exchange_rate_field);
        }
    },

    /**
     * 从exchange_rate_hash中取出此次改变后的币种对应的汇率值
     * 并赋给两个hidden以备提交
     * @param records combo的选中值
     * @param exchange_rate_hash 从hidden中解析出来的hash
     * @param target_field 要改的区域
     */
    setExchangeRate: function(value, exchange_rate_hash, target_field) {
        if(value === 11) {
            target_field.setValue(100);
        }else{
            Ext.Array.each(exchange_rate_hash, function(item, index, array) {
                if(item['id'] === value) {
                    target_field.setValue(item['exchange_rate']);
                    return false;
                }
            });
        }
    },
    
    /**
     * 选中产品时自动加载关税和描述(根据报价语种)
     * @param combo
     * @param records
     * @param eOpts
     */
    setCustomTaxAndDescription: function(combo, records, eOpts) {
        var form = combo.up('form');
        var custom_tax = records[0].get('custom_tax');
        var custom_tax_field = form.down('[name=custom_tax]', false);
        custom_tax_field.setValue(custom_tax);
        
        var quote_language = Ext.ComponentQuery.query('quote_info [name=language]')[0].getValue();
        var description;
        if(quote_language === "1") {
            description = records[0].get('simple_description_cn');
        }else{
            description = records[0].get('simple_description_en');
        }
        var description_field = form.down('[name=description]', false);
        description_field.setValue(description);
    },

    /**
     * 当“来源汇率”区域改变的时候计算“单价”
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateUnitPriceWithOriginalExchangeRate: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var original_unit_price_field = form.down('[name=source_price_amount]', false);
        var original_unit_price = original_unit_price_field.getValue();

        var original_exchange_rate = newValue;

        var exchange_rate_field = form.down('[name=exchange_rate]', false);
        var exchange_rate = exchange_rate_field.getValue();

        var times_field = form.down('[name=times_1]', false);
        var times = (times_field.getValue() === 0 || times_field.getValue() === null) ? 1 : times_field.getValue();

        var divide_field = form.down('[name=divide_1]', false);
        var divide = (divide_field.getValue() === 0 || divide_field.getValue() === null) ? 1 : divide_field.getValue();

        var unit_price_field = form.down('[name=unit_price_amount]', false);
        var unit_price = this.calculateUnitPrice(original_unit_price, original_exchange_rate, exchange_rate, times, divide);
        unit_price_field.setValue(unit_price);
    },

    /**
     * 当“汇率”区域改变的时候计算“单价”
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateUnitPriceWithExchangeRate: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var original_unit_price_field = form.down('[name=source_price_amount]', false);
        var original_unit_price = original_unit_price_field.getValue();

        var original_exchange_rate_field = form.down('[name=original_exchange_rate]', false);
        var original_exchange_rate = original_exchange_rate_field.getValue();

        var exchange_rate = newValue;

        var times_field = form.down('[name=times_1]', false);
        var times = (times_field.getValue() === 0 || times_field.getValue() === null) ? 1 : times_field.getValue();

        var divide_field = form.down('[name=divide_1]', false);
        var divide = (divide_field.getValue() === 0 || divide_field.getValue() === null) ? 1 : divide_field.getValue();

        var unit_price_field = form.down('[name=unit_price_amount]', false);
        var unit_price = this.calculateUnitPrice(original_unit_price, original_exchange_rate, exchange_rate, times, divide);
        unit_price_field.setValue(unit_price);
    },
    
    /**
     * 根据选择的价格种类，去product的combo里取对应的价格
     * @param combo
     * @param records
     * @param eOpts
     */
    loadFourPrices: function(combo, newValue, oldValue, eOpts) {
        var me = this;
        var product_field = combo.up('form').down('[name=product_id]', false);
        var product_store = product_field.getStore();
        var product_id = product_field.getValue();
        var product_record = product_store.getById(product_id);
        
        if(product_record) {
            var source_price_field = combo.up('form').down('[name=source_price] numberfield', false);
            var source_currency_field = combo.up('form').down('[name=source_price] combo', false);
            
            //看能不能取到值
            if(product_record.get('currency_id') != 0) {
                //取得到则用这些值
                switch (newValue) {
                case '1':
                    source_price_field.setValue(product_record.get('price_in_list'));
                    break;
                case '2':
                    source_price_field.setValue(product_record.get('price_from_vendor'));
                    break;
                case '3':
                    source_price_field.setValue(product_record.get('price_to_market'));
                    break;
                case '4':
                    source_price_field.setValue(product_record.get('price_in_site'));
                    break;
                default:
                    source_price_field.setValue();
                }
                source_currency_field.setValue(product_record.get('currency_id'));
            }else{
                //取不到则要把产品那里load一下再取
                var vendor_unit_id = combo.up('form').down('[name=vendor_unit_id]', false).getValue();
                
//                console.log(vendor_unit_id);
//                console.log(product_id);
                product_store.load({
                    params: {vendor_unit_id:vendor_unit_id,query:''},
                    callback: function() {
                        Ext.ComponentQuery.query('[name=product_id]')[0].setValue(product_id);
                        var product_field = combo.up('form').down('[name=product_id]', false);
                        var product_store = product_field.getStore();
//                        var product_id = product_field.getValue();
                        var product_record = product_store.getById(product_id);
                        switch (newValue) {
                        case 1:
                            source_price_field.setValue(product_record.get('price_in_list'));
                            break;
                        case 2:
                            source_price_field.setValue(product_record.get('price_from_vendor'));
                            break;
                        case 3:
                            source_price_field.setValue(product_record.get('price_to_market'));
                            break;
                        case 4:
                            source_price_field.setValue(product_record.get('price_in_site'));
                            break;
                        default:
                            source_price_field.setValue();
                        }
                        source_currency_field.setValue(product_record.get('currency_id'));
                    }
                });
            }
        }
    },

    /**
     * 当“来源单价”区域改变的时候计算“单价”
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateUnitPriceWithSourcePrice: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var original_unit_price = newValue;

        var original_exchange_rate_field = form.down('[name=original_exchange_rate]', false);
        var original_exchange_rate = original_exchange_rate_field.getValue();

        var exchange_rate_field = form.down('[name=exchange_rate]', false);
        var exchange_rate = exchange_rate_field.getValue();

        var times_field = form.down('[name=times_1]', false);
        var times = (times_field.getValue() === 0 || times_field.getValue() === null) ? 1 : times_field.getValue();

        var divide_field = form.down('[name=divide_1]', false);
        var divide = (divide_field.getValue() === 0 || divide_field.getValue() === null) ? 1 : divide_field.getValue();

        var unit_price_field = form.down('[name=unit_price_amount]', false);
        var unit_price = this.calculateUnitPrice(original_unit_price, original_exchange_rate, exchange_rate, times, divide);
        unit_price_field.setValue(unit_price);
    },

    /**
     * 当“×”区域改变的时候计算“单价”
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateUnitPriceWithTimes: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var original_unit_price_field = form.down('[name=source_price_amount]', false);
        var original_unit_price = original_unit_price_field.getValue();

        var original_exchange_rate_field = form.down('[name=original_exchange_rate]', false);
        var original_exchange_rate = original_exchange_rate_field.getValue();

        var exchange_rate_field = form.down('[name=exchange_rate]', false);
        var exchange_rate = exchange_rate_field.getValue();

        var times = (newValue === 0 || newValue === null) ? 1 : newValue;

        var divide_field = form.down('[name=divide_1]', false);
        var divide = (divide_field.getValue() === 0 || divide_field.getValue() === null) ? 1 : divide_field.getValue();

        var unit_price_field = form.down('[name=unit_price_amount]', false);
        var unit_price = this.calculateUnitPrice(original_unit_price, original_exchange_rate, exchange_rate, times, divide);
        unit_price_field.setValue(unit_price);
    },

    /**
     * 当“÷”区域改变的时候计算“单价”
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateUnitPriceWithDivide: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var original_unit_price_field = form.down('[name=source_price_amount]', false);
        var original_unit_price = original_unit_price_field.getValue();

        var original_exchange_rate_field = form.down('[name=original_exchange_rate]', false);
        var original_exchange_rate = original_exchange_rate_field.getValue();

        var exchange_rate_field = form.down('[name=exchange_rate]', false);
        var exchange_rate = exchange_rate_field.getValue();

        var times_field = form.down('[name=times_1]', false);
        var times = (times_field.getValue() === 0 || times_field.getValue() === null) ? 1 : times_field.getValue();

        var divide = (newValue === 0 || newValue === null) ? 1 : newValue;

        var unit_price_field = form.down('[name=unit_price_amount]', false);
        var unit_price = this.calculateUnitPrice(original_unit_price, original_exchange_rate, exchange_rate, times, divide);
        unit_price_field.setValue(unit_price);
    },

    /**
     * 根据“来源单价”、“来源汇率”、“汇率”、“×”、“÷”得出“单价”，再往下取整至5或10
     * @param original_unit_price
     * @param original_exchange_rate
     * @param exchange_rate
     * @param times
     * @param divide
     */
    calculateUnitPrice: function(original_unit_price, original_exchange_rate, exchange_rate, times, divide) {
        var last_times = times / divide;

        if(exchange_rate === 0 || Ext.isEmpty(exchange_rate)) {
            return 0;
        }else{
            var unit_price = Math.ceil((original_unit_price * original_exchange_rate * last_times / exchange_rate).toFixed(2) / 5) * 5;
            return unit_price;
        }
    },

    /**
     * 当“单价”区域改变的时候计算“折扣”和“折至”价格
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateDiscountWithUnitPrice: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var unit_price = newValue;

        var times_field = form.down('[name=times_2]', false);
        var times = (times_field.getValue() === 0 || times_field.getValue() === null) ? 1 : times_field.getValue();

        var divide_field = form.down('[name=divide_2]', false);
        var divide = (divide_field.getValue() === 0 || divide_field.getValue() === null) ? 1 : divide_field.getValue();

        var discount_json = this.calculateDiscount(unit_price, times, divide);
        var discount_field = form.down('[name=discount] numberfield', false);
        var discount_to_field = form.down('[name=discount_to] numberfield', false);
        discount_to_field.setValue(discount_json['discount_to_amount']);
        discount_field.setValue(discount_json['discount_amount']);
    },

    /**
     * 当“×”区域改变的时候计算“折扣”和“折至”价格
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateDiscountWithTimes: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var unit_price_field = form.down('[name=unit_price] numberfield', false);
        var unit_price = unit_price_field.getValue();

        var times = (newValue === 0 || newValue === null) ? 1 : newValue;

        var divide_field = form.down('[name=divide_2]', false);
        var divide = (divide_field.getValue() === 0 || divide_field.getValue() === null) ? 1 : divide_field.getValue();

        var discount_json = this.calculateDiscount(unit_price, times, divide);
        var discount_field = form.down('[name=discount] numberfield', false);
        var discount_to_field = form.down('[name=discount_to] numberfield', false);
        discount_to_field.setValue(discount_json['discount_to_amount']);
        discount_field.setValue(discount_json['discount_amount']);
    },

    /**
     * 当“÷”区域改变的时候计算“折扣”和“折至”价格
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateDiscountWithDivide: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var unit_price_field = form.down('[name=unit_price] numberfield', false);
        var unit_price = unit_price_field.getValue();

        var times_field = form.down('[name=times_2]', false);
        var times = (times_field.getValue() === 0 || times_field.getValue() === null) ? 1 : times_field.getValue();

        var divide = (newValue === 0 || newValue === null) ? 1 : newValue;

        var discount_json = this.calculateDiscount(unit_price, times, divide);
        var discount_field = form.down('[name=discount] numberfield', false);
        var discount_to_field = form.down('[name=discount_to] numberfield', false);
        discount_to_field.setValue(discount_json['discount_to_amount']);
        discount_field.setValue(discount_json['discount_amount']);
    },

    /**
     * 根据“单价”、“×”、“÷”得出“折扣”和“折至”价格
     * @param unit_price
     * @param times
     * @param divide
     * @return {Object}
     */
    calculateDiscount: function(unit_price, times, divide) {
        var last_times = times / divide;

        var discount_to_amount = Math.ceil((unit_price * last_times).toFixed(2) / 5) * 5;
        var discount_amount = unit_price - discount_to_amount;

        return {'discount_to_amount': discount_to_amount, 'discount_amount': discount_amount}
    },


    multiCalculate: function(numberfield, newValue, oldValue, eOpts) {
        this.calculateDiscountWithDiscountTo(numberfield, newValue, oldValue, eOpts);
        this.calculateTotalWithDiscountTo(numberfield, newValue, oldValue, eOpts);
    },
    /**
     * 简单的减法，“折扣”和“折至”的相互影响
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateDiscountToWithDiscount: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var unit_price_field = form.down('[name=unit_price] numberfield', false);
        var unit_price = unit_price_field.getValue();

        var discount_to_field = form.down('[name=discount_to] numberfield', false);
        discount_to_field.setValue(unit_price - newValue);
    },
    calculateDiscountWithDiscountTo: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var unit_price_field = form.down('[name=unit_price] numberfield', false);
        var unit_price = unit_price_field.getValue();

        var discount_field = form.down('[name=discount] numberfield', false);
        discount_field.setValue(unit_price - newValue);
    },

    /**
     * 简单的乘法，用“数量”和“折至”计算“小计”价格
     * @param numberfield
     * @param newValue
     * @param oldValue
     * @param eOpts
     */
    calculateTotalWithDiscountTo: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var quantity_field = form.down('[name=quantity]', false);
        var quantity = quantity_field.getValue();

        var total_field = form.down('[name=total] numberfield', false);
        total_field.setValue(quantity * newValue);
    },
    calculateTotalWithQuantity: function(numberfield, newValue, oldValue, eOpts) {
        var form = numberfield.up('form');
        var discount_to_field = form.down('[name=discount_to] numberfield', false);
        var discount_to = discount_to_field.getValue();

        var total_field = form.down('[name=total] numberfield', false);
        total_field.setValue(newValue * discount_to);
    },

    validate: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        if(form.form.isValid()){
            form.down('[name=unit_price] combo').enable();
            switch(button.action) {
                case "save":
                    //新增
                    this.saveItemToTree(button);
                    win.close();
                    break;
                case "update":
                    //修改，找出修改哪一条
                    var record = Ext.ComponentQuery.query("quote_item_tree")[0].getSelectionModel().getSelection()[0];
                    this.updateItemToTree(button, record);
                    win.close();
                    break;
                case "save_apply":
                    //确定并继续，不关窗口
                    this.saveItemToTree(button);
                    break;
                default:

            }
        }
    },

    saveItemToTree: function(button) {
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

            //换页面变量名，以适应model和数据库
            var data = form.getValues();
            data["total"] = form.down('[name=total_amount]').getValue();
            data["currency_name"] = form.down('[name=total_currency_id]').getRawValue();
            data["original_currency_name"] = form.down('[name=source_price_currency_id]').getRawValue();
            data["vendor_unit_name"] = form.down('[name=vendor_unit_id]').getRawValue();
            data["product_model"] = form.down('[name=product_id]').getRawValue();
            data["leaf"] = true;
            data["is_leaf"] = true;

            data["original_unit_price"] = data["source_price_amount"];
            delete data["source_price_amount"];
            data["original_currency_id"] = data["source_price_currency_id"];
            delete data["source_price_currency_id"];
            data["unit_price"] = data["unit_price_amount"];
            delete data["unit_price_amount"];
            data["discount"] = data["discount_amount"];
            delete data["discount_amount"];
            data["discount_to"] = data["discount_to_amount"];
            delete data["discount_to_amount"];
            data["currency_id"] = data["unit_price_currency_id"];
            delete data["unit_price_currency_id"];

            target_node.insertChild(99, data);
//            win.close();
            this.getController('Quotes').reCalculateTree();
        }
    },

    updateItemToTree: function(button, record) {
        var win = button.up('window');
        var form = win.down('form', false);
        if(form.form.isValid()) {
            var new_data = form.getValues();
            Ext.Object.each(new_data, function(key, value, allItems) {
                record.set(key, value);
            });

            record.set('total', form.down('[name=total_amount]').getValue());
            record.set('currency', form.down('[name=total_currency_id]').getRawValue());
//            record.set('original_currency', form.down('[name=source_price_currency_id]').getRawValue());
            record.set('original_currency_name', form.down('[name=source_price_currency_id]').getRawValue());
            record.set('vendor_unit_name', form.down('[name=vendor_unit_id]').getRawValue());
            record.set('product_model', form.down('[name=product_id]').getRawValue());

            record.set('original_unit_price', record.get('source_price_amount'));
            record.set('original_currency_id', record.get('source_price_currency_id'));
            record.set('unit_price', record.get('unit_price_amount'));
            record.set('discount', record.get('discount_amount'));
            record.set('discount_to', record.get('discount_to_amount'));
            record.set('currency_id', record.get('unit_price_currency_id'));
//            console.log(record);
            this.getController('Quotes').reCalculateTree();
        }
    }
});
