/**
 * 自定义组件的controller
 * ExpandableCustomerUnitCombo是前面筛选客户单位，后面一个小加号弹对话框新增
 * ExpandableCustomerCombo是前面筛选客户姓名，后面一个小加号弹对话框新增
 * ExpandableVendorUnitCombo是前面筛选工厂，后面一个小加号弹对话框新增
 * ExpandableProductCombo是前面筛选产品，后面一个小加号弹对话框新增
 * ExpandableBusinessUnitCombo是前面筛选商务相关单位，后面一个小加号弹对话框新增
 * ExpandableBusinessContactCombo是前面筛选商务相关联系人，后面一个小加号弹对话框新增
 */
Ext.define('EIM.controller.Etscuxes', {
    extend: 'Ext.app.Controller',
    stores: [
        'dict.Leads',
        'dict.CustomerUnitSorts',
        'dict.Cities',
        'CustomerUnits',
        'Customers',
        'VendorUnits',
        'Products',
        'BusinessUnits',
        'BusinessContacts',
        'dict.Currencies',
        'PayModes',
        'dict.MaterialCodes',
        'ComboPopUnits'
    ],
    models: [
        'dict.Lead',
        'dict.CustomerUnitSort',
        'dict.City',
        'CustomerUnit',
        'Customer',
        'VendorUnit',
        'Product',
        'BusinessUnit',
        'BusinessContact',
        'dict.Currency',
        'PayMode',
        'dict.MaterialCode',
        'ComboPopUnit'
    ],
    views: [
        'etscux.ExpandableCustomerUnitCombo',
        'etscux.ExpandableCustomerCombo',
        'etscux.ExpandableVendorUnitCombo',
        'etscux.ExpandableVendorCombo',
        'etscux.ExpandableProductCombo',
        'etscux.ExpandableProductBoxSelect',
        'etscux.ExpandableBusinessUnitCombo',
        'etscux.ExpandableBusinessContactCombo',
        'etscux.AmountWithCurrency',
        'etscux.ExpandablePayModeCombo',
        'etscux.ExpandablePopUnitCombo',

        'etscux.ReusableSelectExpressButton',
        'etscux.ReusablePopExpressGridButton',
        'express_sheet.ComplexForm',

        'customer_unit.Form',
        'customer.Form',
        'vendor_unit.MiniAddForm',
        'product.MiniAddForm',
        'business_unit.Form',
        'business_contact.Form',
        'pop_unit.Form'
    ],
    //    refs: [{
    //        ref: 'zzform',
    //        selector: 'form'
    //    }],

    init: function() {
        var me = this;
        //        Ext.ComponentQuery.query('expandable_customer_combo combo')[0].getStore()
        me.control({
            /**
             * 客户和客户单位的组
             * 客户单位的输入下拉框，每次选择后把参数赋给客户的下拉框
             */
            'expandable_customer_unit_combo combo': {
                select: this.addParamsToCustomerStore
            },
            /**
             * 客户单位的小加号按钮
             */
            'expandable_customer_unit_combo button[text=+]': {
                click: this.popUpCustomerUnitFormAndSetValue
            },
            /**
             * 客户的下拉框，每次清空之前的值
             */
            'expandable_customer_combo combo': {
                beforequery: function(queryEvent, records, eOpts) {
                    delete queryEvent.combo.lastQuery;
                }
            },
            /**
             * 客户的小加号按钮
             */
            'expandable_customer_combo button[text=+]': {
                click: this.popUpCustomerFormAndSetCustomerUnitValue
            },

            /**
             * 生产厂家和产品的组
             */
            'expandable_vendor_unit_combo combo': {
                select: this.passParamsToProductComboOrBox
            },
            /**
             * 生产厂家的小加号按钮
             */
            'expandable_vendor_unit_combo button[text=+]': {
                click: this.popUpVendorUnitFormAndSetValue
            },
            /**
             * 产品的下拉框，每次清空之前的值
             */
            'expandable_product_combo combo': {
                beforequery: function(queryEvent, records, eOpts) {
                    delete queryEvent.combo.lastQuery;
                }
            },
            /**
             * 供方联系人的下拉框，每次清空之前的值
             */
            'expandable_vendor_combo combo': {
                beforequery: function(queryEvent, records, eOpts) {
                    delete queryEvent.combo.lastQuery;
                }
            },

            /**
             * 产品的box_select选择/取消选择完后
             */
            'expandable_product_box_select boxselect': {
                change: this.prepareBoxSelectData
            },
            /**
             * 产品的小加号按钮
             */
            'expandable_product_combo button[text=+], expandable_product_box_select button[text=+]': {
                click: this.popUpProductFormAndSetVendorUnitValue
            },
            /**
             * 供方联系人的小加号按钮
             */
            'expandable_vendor_combo button[text=+]': {
                click: this.popUpVendorFormAndSetVendorUnitValue
            },

            /**
             * 商务相关单位和商务相关联系人的组
             */
            'expandable_business_unit_combo combo': {
                select: this.passParamsToBusinessContactCombo
            },
            'expandable_business_unit_combo button[text=+]': {
                click: this.popUpBusinessUnitFormAndSetValue
            },
            'expandable_business_contact_combo combo': {
                beforequery: function(queryEvent, records, eOpts) {
                    delete queryEvent.combo.lastQuery;
                }
            },
            'expandable_business_contact_combo button[text=+]': {
                click: function() {
                    var me = this;
                    load_uniq_controller(me, 'BusinessContacts');
                    Ext.widget('business_contact_form').show();
                }
            },

            /**
             * 公共单位和公共联系人的组
             */
            'expandable_pop_unit_combo combo': {
                select: this.passParamsToPopCombo
            },
            'expandable_pop_unit_combo button[text=+]': {
                click: this.popUpPopUnitFormAndSetValue
            },
            'expandable_pop_combo combo': {
                beforequery: function(queryEvent, records, eOpts) {
                    delete queryEvent.combo.lastQuery;
                }
            },
            'expandable_pop_combo button[text=+]': {
                click: function() {
                    var me = this;
                    load_uniq_controller(me, 'Pops');
                    Ext.widget('pop_form').show();
                }
            },

            /**
             * 币种的下拉框，当它有值时，后面的数字框也必须有值
             */
            'amount_with_currency combo': {
                blur: this.validateCurrencyComponentCombo
            },
            /**
             * 金额的输入框，当它有值时，前面的下拉框也必须有值
             */
            'amount_with_currency numberfield': {
                blur: this.validateCurrencyComponentNumber
            },

            /**
             * 选快递公司的按钮
             */
            'pop_express_grid_button': {
                click: this.popUpExpressForm
            },

            /**
             * 新增付款方式的按钮
             */
            'expandable_pay_mode_combo button[text=+]': {
                click: this.popUpPayModeFormAndSetValue
            },

            /**
             * 新增物料编码的按钮
             */
            'expandable_material_code_combo button[text=+]': {
                click: this.popUpMaterialCodeFormAndSetValue
            }
        });
    },

    /**
     * 如果有客户下拉框在同一表单内(比如本身就是“新增客户”的表单，则不会有选择客户的下拉框)，
     * 则给此客户下拉框加一个参数：当前选中客户单位ID
     * 如果有“地址”在同一表单内，则把返回的地址填进去作为默认值
     */
    addParamsToCustomerStore: function(combo, records, eOpts) {
        var expand = combo.up('form').down('expandable_customer_combo', false)
        if (expand) {
            var customer_combo = expand.down('combo', false);
            customer_combo.getStore().getProxy().setExtraParam('customer_unit_id', records[0]["data"]["id"])
            customer_combo.reset();
        }
        var addr_field = combo.up('form').down('[name=addr]', false);
        var addr_combo = combo.up('form').down('[name=addr_combo]', false);
        //        console.log(addr_field);
        if (addr_field) {
            //如果地址是“紫金港校区：西湖区余杭塘路866号；玉泉校区：西湖区浙大路38号”这样的形式，
            //也即包含分号，则把多地址解析一下放到addr_combo里供选
            var addr = records[0].get('addr');
            var addr_array = addr.split("；");

            if (addr_array.length === 1) {
                addr_combo.getStore().removeAll();
                addr_combo.setValue();
                addr_field.setValue(addr);
            } else {
                //                addr_combo.getStore().load();

                var addr_store = [];
                Ext.Array.each(addr_array, function(item) {
                    addr_store.push({
                        name: item.split("：")[0],
                        address: item.split("：")[1]
                    });
                });
                addr_combo.getStore().loadData(addr_store);
                addr_combo.expand();
                addr_combo.setValue(addr_array[0].split("：")[1]);
                addr_field.setValue(addr_array[0].split("：")[1]);
            }
        }
    },

    /**
     * 弹出“新增客户单位”的表单，并把已经填的值放进表单里
     */
    popUpCustomerUnitFormAndSetValue: function(button) {
        var me = this;
        var value = button.up('expandable_customer_unit_combo').down('combo', false).getRawValue();
        //        console.log("AAA");
        load_uniq_controller(me, 'CustomerUnits');
        //把已经填的值带给弹出的窗口
        var form = Ext.widget('customer_unit_form');
        form.show('', function() {
            form.down('[name=name|en_name|unit_aliases>unit_alias]').setValue(value);
            form.down('[name=source_element_id]').setValue(button.id);
        });
    },

    /**
     * 弹出“新增客户”的表单，并视情况把已经填的客户单位的值放进表单里
     */
    popUpCustomerFormAndSetCustomerUnitValue: function(button) {
        var me = this;
        load_uniq_controller(me, 'Customers');
        var form = Ext.widget('customer_form');
        form.show('', function() {
            var expand_customer_unit = button.up('form').down('expandable_customer_unit_combo', false);
            if (expand_customer_unit) {
                var combo = expand_customer_unit.down('combo')
                if (combo.getValue() === combo.getRawValue()) {
                    //如果两个值相等，说明是个假值(还没有这个单位)，则弹出的表单里不预填写
                } else {
                    //否则把单位的值传过去
                    var target_combo = form.down('expandable_customer_unit_combo').down('combo');
                    target_combo.setValue(combo.getValue());
                }
            }
            form.down('[name=source_element_id]').setValue(button.id);
        });
    },

    /**
     * 生产厂家的输入下拉框，每次选择后，看和它同级的有哪个框：产品下拉或者产品多选
     * 有哪个就把参数赋给哪个
     * 另外就是和它同级的选择供方联系人的combo
     */
    passParamsToProductComboOrBox: function(combo, records, eOpts) {
        var product_field = combo.up('form').down('expandable_product_combo', false);
        var product_box_field = combo.up('form').down('expandable_product_box_select', false);
        if (product_field) {
            var product_combo = product_field.down('combo', false);
            product_combo.getStore().getProxy().setExtraParam('vendor_unit_id', records[0]["data"]["id"])
            product_combo.reset();
        }
        if (product_box_field) {
            var product_box = product_box_field.down('boxselect', false);
            product_box.getStore().getProxy().setExtraParam('vendor_unit_id', records[0]["data"]["id"])
            product_box.reset();
        }
        if (combo.fieldLabel.indexOf('供应商') != -1) {
            //因为还有“所有权”的combo，这个不触发
            var vendor_field = combo.up('form').down('expandable_vendor_combo', false);
            if (vendor_field) {
                var vendor_combo = vendor_field.down('combo', false);
                vendor_combo.getStore().getProxy().setExtraParam('vendor_unit_id', records[0]["data"]["id"])
                vendor_combo.reset();
            }
        }
    },

    /**
     * 弹出“新增工厂”的表单，并把已经填的工厂的值放进表单里
     */
    popUpVendorUnitFormAndSetValue: function(button) {
        var me = this;
        var value = button.up('expandable_vendor_unit_combo').down('combo', false).getRawValue();
        load_uniq_controller(me, 'VendorUnits');
        //把已经填的值带给弹出的窗口
        var form = Ext.widget('vendor_unit_mini_add_form');
        form.show('', function() {
            form.down('[name=name]').setValue(value);
            form.down('[name=source_element_id]').setValue(button.id);
        });
    },

    /**
     * 批量选择的时候，每次选择/取消选择完后把对应数据的内容放入一个变量里，以进行正确的提交
     */
    prepareBoxSelectData: function(box, newValue, oldValue) {
        var newArray = newValue.split(', ');
        var oldArray;
        if (oldValue != undefined) oldArray = oldValue.split(', ');
        if (oldValue === undefined || oldArray.join("") === "") oldArray = [];
        if (newArray.length > oldArray.length) {
            //新的值多，也就是加了选择。把加的这一条的数据加到变量里
            //对新的值循环，如果旧的值里有它就不管，没有它则加一条
            Ext.Array.each(newArray, function(item) {
                if (oldArray.indexOf(item) === -1 && !Ext.isEmpty(item)) {
                    Ext.ComponentQuery.query('functree')[0].tempBatchProduct[item] = box.getStore().getById(Number(item));
                }
            });
        } else {
            //旧的多，也就是删了选择。在变量里找到少的这一条对应的数据，去掉
            //对旧的值循环，如果新的值里有它就不管，没有就把此条去掉
            Ext.Array.each(oldArray, function(item, index, array) {
                if (newArray.indexOf(item) === -1) {
                    delete(Ext.ComponentQuery.query('functree')[0].tempBatchProduct[item]);
                }
            });
        }
    },

    /**
     * 弹出“新增产品”的表单，并视情况把已经填的工厂的值放进表单里
     */
    popUpProductFormAndSetVendorUnitValue: function(button) {
        var me = this;
        var value;
        if (button.up('expandable_product_combo')) {
            value = button.up('expandable_product_combo').down('combo', false).getRawValue();
        }

        load_uniq_controller(me, 'Products');
        var form = Ext.widget('product_mini_add_form');
        form.show('', function() {
            var expand_vendor_unit = button.up('form').down('expandable_vendor_unit_combo', false);
            if (expand_vendor_unit) {
                var vendor_unit_combo = expand_vendor_unit.down('combo');
                if (vendor_unit_combo.getValue() === vendor_unit_combo.getRawValue()) {
                    //如果两个值相等，说明是个假值(还没有这个工厂)，则弹出的表单里不预填写
                } else {
                    //否则把工厂的值传过去
                    var target_combo = form.down('expandable_vendor_unit_combo').down('combo');
                    target_combo.getStore().loadData([
                        [vendor_unit_combo.getValue(), vendor_unit_combo.getRawValue()]
                    ]);

                    target_combo.setValue(vendor_unit_combo.getValue());
                }
                form.down('[name=model]', false).setValue(value);
                form.down('[name=source_element_id]').setValue(button.id);
            }
        });
    },

    /**
     * 弹出“新增供方联系人”的表单，并视情况把已经填的工厂的值放进表单里
     */
    popUpVendorFormAndSetVendorUnitValue: function(button) {
        var me = this;
        load_uniq_controller(me, 'Vendors');
        var form = Ext.widget('vendor_mini_add_form');
        form.show('', function() {
            var expand_vendor_unit = button.up('form').down('expandable_vendor_unit_combo[fieldLabel=供应商]', false);
            if (expand_vendor_unit) {
                var vendor_unit_combo = expand_vendor_unit.down('combo');
                if (vendor_unit_combo.getValue() === vendor_unit_combo.getRawValue()) {
                    //如果两个值相等，说明是个假值(还没有这个工厂)，则弹出的表单里不预填写
                } else {
                    //否则把工厂的值传过去
                    var target_combo = form.down('expandable_vendor_unit_combo').down('combo');
                    target_combo.getStore().loadData([
                        [vendor_unit_combo.getValue(), vendor_unit_combo.getRawValue()]
                    ]);

                    target_combo.setValue(vendor_unit_combo.getValue());
                }
                form.down('[name=source_element_id]').setValue(button.id);
            }
        });
    },

    /**
     * 商务相关单位的输入下拉框，每次选择后把参数赋给商务相关联系人的下拉框
     */
    passParamsToBusinessContactCombo: function(combo, records, eOpts) {
        var expandable_combo = combo.up('form').down('expandable_business_contact_combo', false);
        if (expandable_combo) {
            var business_combo = expandable_combo.down('combo', false);
            business_combo.getStore().getProxy().setExtraParam('business_unit_id', records[0]["data"]["id"])
        }
    },

    /**
     * 弹出“新增商务相关单位”的表单，并把已经填的值放进表彰里
     * @param button
     */
    popUpBusinessUnitFormAndSetValue: function(button) {
        var me = this;
        var value = button.up('expandable_business_unit_combo').down('combo', false).getRawValue();
        load_uniq_controller(me, 'BusinessUnits');
        //把已经填的值带给弹出的窗口
        var form = Ext.widget('business_unit_form');
        form.show('', function() {
            form.down('[name=name|en_name|unit_aliases>unit_alias]').setValue(value);
            form.down('[name=source_element_id]').setValue(button.id);
        });
    },

    /**
     * 公共单位的输入下拉框，每次选择后把参数赋给公共联系人的下拉框
     */
    passParamsToPopCombo: function(combo, records, eOpts) {
        var expandable_combo = combo.up('form').down('expandable_pop_combo', false);
        if (expandable_combo) {
            var pop_combo = expandable_combo.down('combo', false);
            pop_combo.getStore().getProxy().setExtraParam('pop_unit_id', records[0]["data"]["id"])
        }
    },

    /**
     * 弹出“新增公共单位”的表单，并把已经填的值放进表彰里
     * @param button
     */
    popUpPopUnitFormAndSetValue: function(button) {
        var me = this;
        var value = button.up('expandable_pop_unit_combo').down('combo', false).getRawValue();
        load_uniq_controller(me, 'PopUnits');
        //把已经填的值带给弹出的窗口
        var form = Ext.widget('pop_unit_form');
        form.show('', function() {
            form.down('[name=name|en_name|unit_aliases>unit_alias]').setValue(value);
            form.down('[name=source_element_id]').setValue(button.id);
        });
    },

    validateCurrencyComponentCombo: function(combo, e, eOpts) {
        var me = this;
        var numberfield = combo.up('amount_with_currency').down('numberfield', false);

        me.validateCurrencyComponent(combo, numberfield);
    },
    validateCurrencyComponentNumber: function(numberfield, e, eOpts) {
        var me = this;
        var combo = numberfield.up('amount_with_currency').down('combo', false);

        me.validateCurrencyComponent(combo, numberfield);
    },
    /**
     * 不管blur的是哪个，都对此组件进行校验
     * @param combo
     * @param numberfield
     */
    validateCurrencyComponent: function(combo, numberfield) {
        if (numberfield.allowZero != undefined) {
            //设定了允许为零
            combo.clearInvalid();
        } else {
            if (combo.allowBlank === false) {
                //设定了不能为空
                if (combo.getValue() === null || combo.getValue() === 0) combo.markInvalid("此项值不能为空！");
                if (numberfield.getValue() === null || numberfield.getValue() === 0) {
                    numberfield.markInvalid("此项值不能为空！");
                    numberfield.setValue(""); //防止是“0”的时候被validate通过而提交
                }
            } else {
                if ((combo.getValue() != null || combo.getValue() != 0) && numberfield.getValue() === null) {
                    numberfield.markInvalid("有币种时必须填写金额！");
                } else {
                    numberfield.clearInvalid();
                }
                if (numberfield.getValue() != null && numberfield.getValue() != 0 && combo.getValue() === null) {
                    combo.markInvalid("有金额时必须填写币种！");
                } else {
                    combo.clearInvalid();
                }
            }
        }
    },

    popUpExpressForm: function(button) {
        var form = Ext.widget('express_sheet_complex_form').show();
        var source_grid = button.up('grid');
        var target_grid = form.down('grid', false);
        var receiver_type_field = form.down('hidden[name=receiver_type]', false);
        receiver_type_field.setValue(source_grid.xtype.substr(0, source_grid.xtype.length - 5));

        //        var receiver_ids_field = form.down('hidden[name=receiver_ids]', false);
        var dragged_receivers = source_grid.getStore()['data']['items'];
        //        receiver_ids_field.setValue(Ext.Array.map(dragged_receivers, function(item) {return item.get("id");}).join("|"));
        //        console.log(receiver_ids_field.getValue());
        target_grid.getStore().removeAll();
        Ext.Array.each(dragged_receivers, function(item) {
            var receiver_id = item.get("id");
            var receiver_name = item.get("name");

            target_grid.getStore().add({
                "receiver_id": receiver_id,
                "receiver_name": receiver_name
            });
        });

        //
        //        var target_hidden = form.down('hidden[name=customer_ids]', false);
        //        var target_express_id = form.down('[name=express_id]', false);
        //        if(button.up('form')) {
        //            var source_hidden = button.up('form').down('hidden[name=customer_ids]', false);
        //            var source_express_id = button.up('form').down('[name=express_id]', false);
        //            target_hidden.setValue(source_hidden.getValue());
        //            target_express_id.setValue(source_express_id.getValue());
        //        }else{
        //            //从“客户管理”进的话没有这个form，用grid里的数据
        //            var grid = button.up('grid');
        //            var store = grid.getStore();
        //            var customer_ids = Ext.Array.pluck(store.data.items, "internalId");
        //            target_hidden.setValue(customer_ids.join("|"));
        //        }
    },
    //    popUpExpressSimpleForm: function(button) {
    //        var form = Ext.widget('express_sheet_simple_form').show();
    //        var target_hidden = form.down('hidden[name=customer_ids]', false);
    //        var target_express_id = form.down('[name=express_id]', false);
    //        if(button.up('form')) {
    //            var source_hidden = button.up('form').down('hidden[name=customer_ids]', false);
    //            var source_express_id = button.up('form').down('[name=express_id]', false);
    //            target_hidden.setValue(source_hidden.getValue());
    //            target_express_id.setValue(source_express_id.getValue());
    //        }else{
    //            //从“客户管理”进的话没有这个form，用grid里的数据
    //            var grid = button.up('grid');
    //            var store = grid.getStore();
    //            var customer_ids = Ext.Array.pluck(store.data.items, "internalId");
    //            target_hidden.setValue(customer_ids.join("|"));
    //        }
    //    },

    popUpPayModeFormAndSetValue: function(button) {
        var me = this;
        var value = button.up('expandable_pay_mode_combo').down('combo', false).getRawValue();
        load_uniq_controller(me, 'PayModes');
        //把已经填的值带给弹出的窗口
        var form = Ext.widget('pay_mode_form');
        form.show('', function() {
            form.down('[name=name]').setValue(value);
            form.down('[name=source_element_id]').setValue(button.id);
        });
    },

    popUpMaterialCodeFormAndSetValue: function(button) {
        var me = this;
        var value = button.up('expandable_material_code_combo').down('combo', false).getRawValue();
        load_uniq_controller(me, 'MaterialCodes');
        //把已经填的值带给弹出的窗口
        var form = Ext.widget('material_code_form');
        form.show('', function() {
            form.down('[name=code]').setValue(value);
            form.down('[name=source_element_id]').setValue(button.id);
        });
    }
});