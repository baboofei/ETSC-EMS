Ext.define('EIM.controller.VendorUnits', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridVendorUnits',
        'dict.Cities',
        'ComboFullVendorUnits',
        'ComboPurchasers',
        'ComboBusinesses',
        'ComboSupporters'
    ],
    models: [
        'GridVendorUnit',
        'dict.City',
        'ComboFullVendorUnit',
        'ComboPurchaser',
        'ComboBusiness',
        'ComboSupporter'
    ],

    views: [
        'vendor_unit.MiniAddForm',
        'vendor_unit.Grid',
        'vendor_unit.Form'
    ],

    refs: [{
        ref: 'grid',
        selector: 'vendor_unit_grid'
    }],

    init: function() {
        var me = this;
        me.control({
            'vendor_unit_grid': {
                //                render: this.loadCustomerUnits,
                itemdblclick: this.editVendorUnit
            },
            'vendor_unit_grid button[action=addVendorUnit]': {
                click: this.addVendorUnit
            },
            'vendor_unit_form combo[name=parent_id]': {
                select: this.enableInheritCheckbox,
                change: this.disableInheritCheckbox
            },
            'vendor_unit_form checkbox[name=does_inherit]': {
                change: this.disableInheritItems
            },
            'vendor_unit_form button[action=save]': {
                click: this.saveVendorUnit
            },
            'vendor_unit_mini_add_form button[action=save]': {
                click: this.miniSaveVendorUnit
            }
        });
    },

    addVendorUnit: function() {
        Ext.widget('vendor_unit_form').show();
    },


    enableInheritCheckbox: function(combo) {
        var form = combo.up('form');
        var checkbox = form.down('checkbox[name=does_inherit]', false);
        checkbox.enable();
    },
    disableInheritCheckbox: function(combo, newValue) {
        var form = combo.up('form');
        var checkbox = form.down('checkbox[name=does_inherit]', false);
        if (newValue === "") {
            checkbox.disable();
        }
    },

    /**
     * 如果选中“继承”，则相应的字段灰掉不让改
     * @param checkbox
     */
    disableInheritItems: function(checkbox, newValue) {
        var form = checkbox.up('form');
        var win = form.up('window');
        var inherit_array = [
            "intro",
            "en_intro",
            "competitor",
            "major_product",
            "is_partner",
            "supporters",
            "purchasers",
            "businesses",
            "product_quality",
            "service_quality",
            "delivery_quality",
            "price_quality",
            "level"
        ];
        Ext.Array.each(inherit_array, function(item) {
            eval("form.down('[name=" + item + "]').setDisabled(" + newValue + ")");
        });
        var parent_id_field = form.down('[name=parent_id]', false);
        //        console.log(parent_id_field.getValue());
        var current_record = parent_id_field.getStore().getById(parent_id_field.getValue());
        //不知道会不会要把数据带过来的要求，先不改了
    },

    editVendorUnit: function(view, record) {
        //        var record = this.getGrid().getSelectedItem();
        var view = Ext.widget('vendor_unit_form').show();
        view.down('form', false).loadRecord(record);

        //boxselect里的值单独赋
        var supporter_box = view.down('boxselect[name=supporters]', false);
        var purchaser_box = view.down('boxselect[name=purchasers]', false);
        var business_box = view.down('boxselect[name=businesses]', false);

        var supporter_ids = record.data["supporters>id"];
        var supporter_array = Ext.Array.map(supporter_ids.split("|"), function(value) {
            return Number(value);
        });
        supporter_box.setValue(supporter_array);
        var purchaser_ids = record.data["purchasers>id"];
        var purchaser_array = Ext.Array.map(purchaser_ids.split("|"), function(value) {
            return Number(value);
        });
        purchaser_box.setValue(purchaser_array);
        var business_ids = record.data["businesses>id"];
        var business_array = Ext.Array.map(business_ids.split("|"), function(value) {
            return Number(value);
        });
        business_box.setValue(business_array);

        //给combo做一个假的store以正确显示值
        var city_field = view.down('[name=city_id]', false);
        city_field.getStore().loadData([
            [record.get('city_id'), record.get('city>name')]
        ]);
        city_field.setValue(record.get('city_id'));
        var parent_field = view.down('[name=parent_id]', false);
        parent_field.getStore().loadData([
            [record.get('parent_id'), record.get('parent_name')]
        ]);
        parent_field.setValue(record.get('parent_id'));
        //如果上级单位id不为0，则把继承那个checkbox勾选上
        if (record.get('parent_id') != 0) {
            view.down('[name=does_inherit]', false).enable();
            if (record.get('does_inherit')) {
                view.down('[name=does_inherit]', false).setValue(true);
            }
        }
    },

    saveVendorUnit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        if (form.form.isValid()) {
            //防双击
            button.disable();

            form.submit({
                url: 'vendor_units/save_vendor_unit',
                params: {
                    'supporter_ids': form.down('[name=supporters]', false).getValue().join("|"),
                    'purchaser_ids': form.down('[name=purchasers]', false).getValue().join("|"),
                    'business_ids': form.down('[name=businesses]', false).getValue().join("|")
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    win.close();
                    Ext.getStore('GridVendorUnits').load();
                    Ext.example.msg('成功', msg.message);
                }
            });
        }
    },

    miniSaveVendorUnit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        if (form.form.isValid()) {
            //防双击
            button.disable();

            form.submit({
                url: 'vendor_units/save_vendor_unit_mini',
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    var target_by_id = form.down('[name=source_element_id]', false).getValue();
                    //如果是从小加号来的窗口(也就是source_element_id的值不为空)，则把值回填到小加号前面的combo里
                    if (!Ext.isEmpty(target_by_id)) {
                        var target = Ext.getCmp(target_by_id);
                        var target_combo = target.up('container').down("combo", false);
                        var text = response.request.options.params.name;
                        target_combo.store.load({
                            params: {
                                query: text
                            },
                            callback: function(records, operation, success) {
                                target_combo.select(msg['id']);
                                //如果有带加号的产品选择组件和供应商选择组件在同一个form，则为其加一个过滤参数
                                var product_combo_array = Ext.ComponentQuery.query("expandable_product_combo");
                                if (product_combo_array.length > 0) {
                                    Ext.Array.each(product_combo_array, function(item) {
                                        if (item.up('form') === target_combo.up('form')) {
                                            item.down('combo', false).getStore().getProxy().setExtraParam('vendor_unit_id', msg['id'])
                                        }
                                    });
                                }
                            }
                        });
                    }
                    win.close();
                    Ext.example.msg('成功', msg.message);
                }
            });
        }
    }
});