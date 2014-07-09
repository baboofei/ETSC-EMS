Ext.define('EIM.controller.Products', {
    extend: 'Ext.app.Controller',

    stores: [
        'ComboVendorUnits',
        //        'dict.Applications'
        'GridProducts'
    ],
    models: [
        'ComboVendorUnit',
        //        'dict.Application'
        'GridProduct'
    ],

    views: [
        'product.MiniAddForm',
        'product.Panel',
        'product.Grid',
        'product.Detail',
        //        'product.Form',
        'product.ProductInfoForm',
        'product.ProductPriceForm',
        'product.ProductDescriptionForm'
    ],

    refs: [{
        ref: 'grid',
        selector: 'product_grid'
    }, {
        ref: 'form',
        selector: 'product_mini_add_form'
    }],

    init: function() {
        var me = this;
        me.control({
            'product_detail [allowPrivilege=true]': {
                click: this.editProduct
            },
            'product_grid': {
                selectionchange: this.productSelectionChange
            },
            'product_panel button[action=save_as]': {
                click: this.saveAsNewProduct
            },
            'product_mini_add_form button[action=save]': {
                click: this.miniSaveProduct
            },
            'product_mini_add_form [name=name]': {
                blur: this.refresh
            },
            'product_mini_add_form [name=model]': {
                blur: this.refresh
            }
        });
    },

    editProduct: function(button) {
        var me = this;
        var form = button.up('form');
        var producer_vendor_unit_field = form.down('[name=producer>(name|short_name|short_code)] combo', false);
        var seller_vendor_unit_field = form.down('[name=seller>(name|short_name|short_code)] combo', false);
        var params;
        switch (button.action) {
            case 'edit_product_info':
                params = {
                    save_only: 'info',
                    producer_vendor_unit_id: producer_vendor_unit_field.getValue(),
                    seller_vendor_unit_id: seller_vendor_unit_field.getValue()
                };
                break;
            case 'edit_product_price':
                params = {
                    save_only: 'price'
                };
                break;
            case 'edit_product_description':
                params = {
                    save_only: 'description'
                };
                break;
            default:
                break;
        }
        if (form.form.isValid()) {
            form.submit({
                url: 'products/save_product',
                params: params,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    var grid = me.getGrid();
                    var last_selected = grid.getSelectedItem();
                    Ext.getStore('GridProducts').load({
                        callback: function() {
                            var rowIndex = this.find('id', last_selected.getId(), 0, false, false, true);
                            grid.getView().select(rowIndex);
                        }
                    });
                },
                failure: function() {

                }
            });
        }
    },

    saveAsNewProduct: function(button) {
        var panel = button.up('panel');
        var info_form = panel.down('product_info_form', false);
        var price_form = panel.down('product_price_form', false);
        var description_form = panel.down('product_description_form', false);
        var submit_params = Ext.Object.merge(
            info_form.getValues(),
            price_form.getValues(),
            description_form.getValues()
        );
        submit_params['producer_vendor_unit_id'] = panel.down('[name=producer>(name|short_name|short_code)] combo', false).getValue();
        submit_params['seller_vendor_unit_id'] = panel.down('[name=seller>(name|short_name|short_code)] combo', false).getValue();
        if (info_form.form.isValid() && price_form.form.isValid() && description_form.form.isValid()) {
            //防双击
            button.disable();
            info_form.submit({
                url: 'products/save_as_new_product',
                params: submit_params,
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridProducts').load();
                    button.enable();
                }
            });
        }
    },
    productSelectionChange: function(selectionModel, selected) {
        var me = this;

        var record = this.getGrid().getSelectedItem();
        var detail_panel = Ext.ComponentQuery.query('product_detail')[0];

        var product_info_field = detail_panel.down('product_info_form', false);
        var product_price_field = detail_panel.down('product_price_form', false);
        var product_description_field = detail_panel.down('product_description_form', false);
        var btn_edit_info = detail_panel.up('panel').down('[action=edit_product_info]', false);
        var btn_edit_price = detail_panel.up('panel').down('[action=edit_product_price]', false);
        var btn_edit_description = detail_panel.up('panel').down('[action=edit_product_description]', false);
        var btn_group = [btn_edit_info, btn_edit_price, btn_edit_description];
        if (selected.length > 0) {
            //先un掉一些trigger
            var producer_vendor_unit_combo = Ext.ComponentQuery.query('product_detail [name=producer>(name|short_name|short_code)] combo')[0];
            producer_vendor_unit_combo.un('change', me.clearSeller, this);
            producer_vendor_unit_combo.un('select', me.syncProducerSeller, this);

            product_info_field.loadRecord(record);
            product_price_field.loadRecord(record);
            product_description_field.loadRecord(record);
            //给combo做一个假的store以正确显示值
            var producer_vendor_unit_field = detail_panel.down('[name=producer>(name|short_name|short_code)] combo', false);
            producer_vendor_unit_field.getStore().loadData([{
                id: record.get('producer>id'),
                name: record.get('producer>(name|short_name|short_code)')
            }]);
            producer_vendor_unit_field.setValue(record.get('producer>id'));
            var seller_vendor_unit_field = detail_panel.down('[name=seller>(name|short_name|short_code)] combo', false);
            seller_vendor_unit_field.getStore().loadData([
                [record.get('seller>id'), record.get('seller>(name|short_name|short_code)')]
            ]);
            seller_vendor_unit_field.setValue(record.get('seller>id'));

            //加载完数据后把trigger再on回来
            producer_vendor_unit_combo.on('change', me.clearSeller, this);
            producer_vendor_unit_combo.on('select', me.syncProducerSeller, this);

            Ext.Array.each(btn_group, function(item) {
                item.enable();
            });
        } else {
            product_info_field.form.reset();
            product_price_field.form.reset();
            product_description_field.form.reset();

            Ext.Array.each(btn_group, function(item) {
                item.enable();
            });
        }
    },

    /**
     * 生产厂家改变时先清掉销售厂家
     * @param combo
     */
    clearSeller: function(combo) {
        var form = combo.up('form');
        var seller_vendor_unit_combo = form.down('[name=seller>(name|short_name|short_code)] combo', false);
        seller_vendor_unit_combo.setValue();
    },
    /**
     * 生产厂家决定时，把销售厂家也设置成相同的
     * （可以单独改）
     * @param combo
     * @param records
     */
    syncProducerSeller: function(combo, records) {
        var form = combo.up('form');
        var seller_vendor_unit_combo = form.down('[name=seller>(name|short_name|short_code)] combo', false);
        seller_vendor_unit_combo.setValue(records[0]);
    },

    miniSaveProduct: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        if (Ext.isEmpty(form.getValues().name) &&
            Ext.isEmpty(form.getValues().model)) {
            Ext.example.msg("不行", EIM_multi_field_invalid);
            form.down("[name=name]").markInvalid(EIM_multi_field_invalid);
            form.down("[name=model]").markInvalid(EIM_multi_field_invalid);
            return false;
        }

        this.refresh();
        var vendor_unit_id = form.down('[name=vendor_unit_id] textfield', false);
        if (form.form.isValid() &&
            (vendor_unit_id.getValue() != vendor_unit_id.getRawValue())) {
            //防双击
            button.disable();
            form.submit({
                url: 'products/save_product_mini',
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
                            }
                        });
                    }
                    win.close();
                    Ext.example.msg('成功', msg.message);
                }
            });
        }
    },

    refresh: function() {
        var form = this.getForm();
        form.down("[name=name]").clearInvalid();
        form.down("[name=model]").clearInvalid();
    }
});