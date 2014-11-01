/**
 * 拆开后单独加载“检查重复客户”视图用的controller
 */
Ext.define('EIM.controller.customer.CheckDupForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'AdminInventorySNs'
//        'GridInStockQueryAdminInventories',
        'ComboUsers',
        'GridPossibleCustomers',
        'ComboVendorUnits'
    ],
    models: [
//        'AdminInventorySN'
//        'GridInStockQueryAdminInventory'
        'ComboUser',
        'GridCustomer',
        'ComboVendorUnit'
    ],

    views: [
        'customer.CheckDupForm',
//        'etscux.ExpandableMaterialCodeCombo'
        'customer.CheckDupSubForm',
        'customer.PossibleGrid',
        'customer.TransferForm'
    ],

    refs: [
        {
            ref: 'possibleGrid',
            selector: 'customer_possible_grid'
        }
    ],

    init: function() {
        var me = this;

        me.control({
            'customer_check_dup_sub_form[name=in] [mergeType=override]': {
                afterrender: this.dblClickOverride
            },
            'customer_check_dup_sub_form[name=in] [mergeType=addition]': {
                afterrender: this.dblClickAddition
            },
            'customer_check_dup_sub_form[name=in] [name=customer_unit_name]': {
                afterrender: this.dblClickCustomerUnit
            },
            'customer_check_dup_form button[text=>>>]': {
                click: this.syncAll
            },
            'customer_check_dup_form grid': {
                selectionchange: this.selectionChange
            },
            'customer_confirm_customer_unit_form button[action=save]': {
                click: this.setAddressCombo
            },
            'customer_confirm_customer_application_form button[action=save]': {
                click: function(button) {
                    var win = button.up('window');
                    var combo = win.down('combo', false);
                    var parent_win = Ext.ComponentQuery.query('customer_check_dup_form')[0];

                    var inquire_type_field = parent_win.down('[name=inquire_type]', false);
                    var inquire_id_field = parent_win.down('[name=inquire_id]', false);
                    var detail_field = parent_win.down('[name=detail]', false);
                    var params = Ext.ComponentQuery.query('[name=out]')[0].getValues();
                    params['id'] = "";
                    params['application_names'] = combo.getRawValue();
                    params['inquire_type'] = inquire_type_field.getValue();
                    params['inquire_id'] = inquire_id_field.getValue();
                    params['detail'] = detail_field.getValue();

                    Ext.Ajax.request({
                        url: 'customers/save_customer',
                        params: params,
                        success: function(response) {
                            var msg = Ext.decode(response.responseText);
                            Ext.example.msg('成功', msg.message);
                            win.close();
                            Ext.ComponentQuery.query('customer_check_dup_form')[0].close();
                        },
                        failure: function() {
                            Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                        }
                    });

                }
            },
            'customer_confirm_customer_application_form': {
                close: function() {
                    Ext.ComponentQuery.query('customer_check_dup_form')[0].down('button[action=create]').enable();
                }
            },
            'customer_check_dup_form combo[name=addr_combo]': {
                select: function(combo, records) {
                    var addr = records[0];
                    var form = combo.up('form');
                    var addr_field = form.down('[name=addr]', false);
                    var en_addr_field = form.down('[name=en_addr]', false);
                    var postcode_field = form.down('[name=postcode]', false);
                    addr_field.setValue(addr.get('addr'));
                    en_addr_field.setValue(addr.get('en_addr'));
                    postcode_field.setValue(addr.get('postcode'));
                    form.down('[name=customer_unit_addr_id]', false).setValue(addr.get('customer_unit_addr_id'));
                }
            },
            'customer_check_dup_form button[action=override]': {
                click: this.popSalecaseForm
            },
            'customer_check_dup_form button[action=create]': {
                click: this.popApplicationForm
            },
            'customer_check_dup_form button[action=re_transfer]': {
                click: this.transferCustomer
            },
            'customer_check_dup_form button[action=obsolete]': {
                click: this.obsoleteCustomer
            }
        });
    },

    dblClickOverride: function(component) {
        var me = this;
        component.inputEl.on('dblclick', function(e, t) {
            me.singleOverride(component);
        });
    },
    singleOverride: function(component) {
        //用左边的值覆盖右边的
        var left = Ext.ComponentQuery.query('customer_check_dup_sub_form[name=in]')[0].down("[name=" + component['name'] + "]", false);
        var right = Ext.ComponentQuery.query('customer_check_dup_sub_form[name=out]')[0].down("[name=" + component['name'] + "]", false);
        if(left.getValue() != "") {
            right.setValue(left.getValue());
        }
    },

    dblClickAddition: function(component) {
        var me = this;
        component.inputEl.on('dblclick', function(e, t) {
            me.singleAddition(component);
        });
    },
    singleAddition: function(component) {
        //把左边的值添加到右边的后面
        var left = Ext.ComponentQuery.query('customer_check_dup_sub_form[name=in]')[0].down("[name=" + component['name'] + "]", false);
        var right = Ext.ComponentQuery.query('customer_check_dup_sub_form[name=out]')[0].down("[name=" + component['name'] + "]", false);

        if(right.getValue() != "" && left.getValue() != "") {
            //两边都有值，则分别按逗号拆开后组合并uniq
            right.setValue(Ext.Array.union(left.getValue().split(","), right.getValue().split(",")).join(","));
        } else {
            //有一边无，直接等于两边`连起来
            right.setValue(right.getValue() + left.getValue());
        }
    },
    dblClickCustomerUnit: function(component) {
        var me = this;
        component.inputEl.on('dblclick', function(e, t) {
            me.syncCustomerUnit(component);
        });
    },
    syncCustomerUnit: function(component) {
        var me = this;
        //弹出一个确认客户单位的表单
        load_uniq_controller(me, 'customer.ConfirmCustomerUnitForm');
        var view = Ext.widget('customer_confirm_customer_unit_form').show();
        var combo = view.down('combo', false);
        var customer_unit_in_name = component.getValue();
        if(customer_unit_in_name != "") {
            combo.getStore().getProxy().extraParams['query'] = customer_unit_in_name;
            combo.getStore().load({
                callback: function(records) {
                    if(records.length > 0) {
                        //给combo做一个假的store以正确显示值
                        //带数据好麻烦，还是expand出来自己选比较好
//                        combo.getStore().loadData([
//                            [records[0].get('id'), records[0].get('name')]
//                        ]);
//                        combo.setValue(records[0].get('id'));
//                        combo.clearValue();
//                        console.log(customer_unit_in_name);
                        combo.setValue(records[0].get('name'));
                        combo.expand();
                    }
                }
            })
        }
    },

    syncAll: function() {
        var me = this;
        var all_component = Ext.ComponentQuery.query('customer_check_dup_sub_form[name=in] textfield').concat(Ext.ComponentQuery.query('customer_check_dup_sub_form[name=in] combo'));
        Ext.Array.each(all_component, function(component) {
            switch(component.mergeType) {
                case "override":
                    me.singleOverride(component);
                    break;
                case "addition":
                    me.singleAddition(component);
                    break;
                case undefined:
                    me.syncCustomerUnit(component);
                    break;
                default:

            }
        });
    },

    selectionChange: function(selectionModel, selected) {
        var grid = this.getPossibleGrid();
        var win = grid.up('window');
        var form = win.down('customer_check_dup_sub_form[name=out]', false);
        var override_button = win.down('button[action=override]', false);

        if(selected.length === 1) {
            form.loadRecord(selected[0]);
            form.down('[name=customer_unit_id]', false).setValue(selected[0].get('customer_unit>id'));
            form.down('[name=customer_unit_name]', false).setValue(selected[0].get('customer_unit_addr>customer_unit>(name|unit_aliases>unit_alias|en_name)'));
            override_button.enable();
        } else {
            form.form.reset();
            override_button.disable();
        }
    },

    setAddressCombo: function(button) {
        var win = button.up('window');
        var combo = win.down('combo', false);
        var target_form = Ext.ComponentQuery.query('customer_check_dup_sub_form[name=out]')[0];
        if(!Ext.isEmpty(combo.getValue())) {
            target_form.down('[name=customer_unit_id]', false).setValue(combo.getValue());
            target_form.down('[name=customer_unit_name]', false).setValue(combo.getRawValue());

            //根据当前所选单位的信息，生成下面窗口上的可选择地址combo
            var customer_unit_id = combo.getValue();
            var addr_field = target_form.down('[name=addr]', false);
            var en_addr_field = target_form.down('[name=en_addr]', false);
            var postcode_field = target_form.down('[name=postcode]', false);
            var customer_unit_addr_id_field = target_form.down('[name=customer_unit_addr_id]', false);
            var addr_combo = target_form.down('[name=addr_combo]');

            if(combo.getValue() === combo.getRawValue()) {
                combo.markInvalid('请<span style="color:#ff0000;">选择</span>一个客户单位！');
                return false;
            }
            var addr_array = Ext.JSON.decode(combo.getStore().getById(customer_unit_id).get('addr'));


            if(addr_array.length === 1) {
                if(Ext.isEmpty(addr_field.getValue())) addr_field.setValue(addr_array[0]['addr']);
                if(Ext.isEmpty(en_addr_field.getValue()))  en_addr_field.setValue(addr_array[0]['en_addr']);
                if(Ext.isEmpty(postcode_field.getValue())) postcode_field.setValue(addr_array[0]['postcode']);
                customer_unit_addr_id_field.setValue(addr_array[0]['customer_unit_addr_id']);
            } else {
                var addr_store = [];
                Ext.Array.each(addr_array, function(item) {
                    addr_store.push({
                        name: item['name'],
                        addr: item['addr'],
                        postcode: item['postcode'],
                        en_addr: item['en_addr'],
                        customer_unit_addr_id: item['customer_unit_addr_id']
                    });
                });
                addr_combo.getStore().loadData(addr_store);
                addr_combo.expand();
                addr_combo.setValue(addr_array[0]['addr']);
                if(addr_field.getValue().indexOf(addr_array[0]['addr']) === -1 && Ext.isEmpty(addr_field.getValue())) addr_field.setValue(addr_array[0]['addr']);
                if(en_addr_field.getValue().indexOf(addr_array[0]['en_addr']) === -1 && Ext.isEmpty(en_addr_field.getValue())) en_addr_field.setValue(addr_array[0]['en_addr']);
                if(postcode_field.getValue().indexOf(addr_array[0]['postcode']) === -1 && Ext.isEmpty(postcode_field.getValue())) postcode_field.setValue(addr_array[0]['postcode']);
                customer_unit_addr_id_field.setValue(addr_array[0]['customer_unit_addr_id']);
            }
            win.close();
        } else {
            combo.markInvalid('请选择客户单位！');
        }
    },

    popApplicationForm: function(button) {
        var me = this;

        //TODO 中英文名的校验，从customer里找
        if(Ext.Array.unique(
            Ext.Object.getValues(
                Ext.ComponentQuery.query('customer_check_dup_sub_form[name=out]')[0].getValues()
            )
        ).join("") === "") {
            //空表单不让提交。覆盖的时候不判断，因为vendor_unit_id这个hidden不好判断。谁无聊到一个个改没我也没办法
            Ext.example.msg('不行', EIM_multi_field_invalid);
        } else {
            button.disable();
            //弹出一个确认客户单位的表单
            load_uniq_controller(me, 'customer.ConfirmCustomerApplicationForm');
            var view = Ext.widget('customer_confirm_customer_application_form').show();
        }
    },

    transferCustomer: function() {
        var me = this;
        load_uniq_controller(me, 'Customers');
        var view = Ext.widget('customer_transfer_form').show();
        view.down('[name=source_function]', false).setValue('inquire');
    },

    obsoleteCustomer: function(btn) {
        var win = btn.up('window');
        Ext.Msg.confirm('确认', '真的要把当前需求转为非目标客户？', function(button) {
            if(button === 'yes') {
                Ext.Ajax.request({
                    url: '/customers/set_obsolete',
                    params: {
                        inquire_type: win.down('[name=inquire_type]', false).getValue(),
                        inquire_id: win.down('[name=inquire_id]', false).getValue(),
                        lead_id: win.down('customer_check_dup_sub_form', false).down('[name=lead_id]', false).getValue()
                    },
                    submitEmptyText: false,
                    success: function(response) {
                        var msg = Ext.decode(response.responseText);
                        Ext.example.msg('成功', msg.message);
                        win.close();
//                        Ext.ComponentQuery.query('customer_check_dup_form')[0].close();
                    },
                    failure: function() {
                        Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                    }
                });
            }
        });
    },

    popSalecaseForm: function(button) {
        var me = this;

        //TODO 中英文名的校验，从customer里找
        if(Ext.Array.unique(
            Ext.Object.getValues(
                Ext.ComponentQuery.query('customer_check_dup_sub_form[name=out]')[0].getValues()
            )
        ).join("") === "") {
            //空表单不让提交。覆盖的时候不判断，因为vendor_unit_id这个hidden不好判断。谁无聊到一个个改没我也没办法
            Ext.example.msg('不行', EIM_multi_field_invalid);
        } else {
            button.disable();
            //弹出一个选择个案的表单
            load_uniq_controller(me, 'customer.ConfirmSalecaseForm');
            var view = Ext.widget('customer_confirm_salecase_form').show();
            var store = Ext.getStore('GridPossibleSalecases');
            var win = button.up('window');
            var customer_unit_field = win.down('customer_check_dup_sub_form[name=out]', false).down('[name=customer_unit_id]', false);
            var grid = win.down('grid', false);
            var selection = grid.getSelectedItem();

//            console.log(customer_unit_field);
            store.getProxy().extraParams['customer_unit_id'] = customer_unit_field.getValue();
            store.getProxy().extraParams['customer_id'] = selection.get('id');
            store.load();
        }
    }
});