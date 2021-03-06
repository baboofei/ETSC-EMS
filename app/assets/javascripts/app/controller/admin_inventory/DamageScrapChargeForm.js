/**
 * 加载“报损”、“报废”、“充抵”三合一的视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.DamageScrapChargeForm', {
    extend: 'Ext.app.Controller',

    stores: [
        'AdminInventorySNs'
    ],
    models: [
        'AdminInventorySN'
    ],

    views: [
        'admin_inventory.DamageScrapChargeForm'
    ],

    //    refs: [{
    //        ref: 'list',
    //        selector: 'recommended_item_grid'
    //    }],

    init: function() {
        var me = this;

        me.control({
            'admin_inventory_damage_scrap_charge_form [name=outstock_count]': {
//                change: this.validateNumberByCount
            },
            'admin_inventory_damage_scrap_charge_form [name=outstock_numbers]': {
                select: this.validateNumberByNumber
            },
//            'admin_inventory_damage_scrap_charge_form button[action=save_damage]': {
            'admin_inventory_damage_scrap_charge_form button[action=save_damage], admin_inventory_damage_scrap_charge_form button[action=save_scrap], admin_inventory_damage_scrap_charge_form button[action=save_charge], admin_inventory_damage_scrap_charge_form button[action=save_change_location], admin_inventory_damage_scrap_charge_form button[action=save_change_ownership]': {
                click: this.tSubmit
            }
        });
    },
//
//    validateNumberByCount: function(text, newValue) {
//        var win = text.up('window');
//        var number_field = win.down('[name=outstock_numbers]', false);
//        if(number_field.getValue().length != 0 && newValue != number_field.getValue().length) {
//            number_field.invalidMsg = '数量和序列号个数不一致，请检查！';
//        } else {
//            number_field.invalidMsg = '';
//        }
//        number_field.validate();
//    },

    validateNumberByNumber: function(combo, records) {
        var win = combo.up('window');
        var quantity_field = win.down('[name=outstock_count]', false);
        quantity_field.setValue(records.length);
        //比如先把这里选上3个，然后把数量改成2，再把这里去掉1个变成2个，这时候数量未变，所以不触发change事件，标记仍在。
        //故手动校验一次
        combo.invalidMsg = '';
        combo.validate();
    },

    tSubmit: function(button) {
//        console.log("WWW");
        var win = button.up('window');
        var form = win.down('form', false);
        var combo = form.down('combo[name=outstock_numbers]', false);
        if(combo.getStore().count() > 0 && Ext.isEmpty(combo.getValue())) {
            combo.invalidMsg = '请选择需要操作的物品！';
            combo.validate();
        }
        //自定义组件的校验不太一样，但form的validate不知道怎么改写，先这样吧
        //TODO
        var form_valid = true;
        Ext.Array.each(form.items.items, function(item) {
            if(!item.isValid()) {
                form_valid = false;
            }
        });
        if(form_valid) {
            var store_data = Ext.Array.pluck(Ext.ComponentQuery.query('boxselect')[0].getStore()["data"]["items"], "data");
//            console.log(form.items.items);
            form.submit({
                url: "admin_inventories/save_admin_inventory",
                params: {
                    "items": combo.getValue().join("|"),
                    "store": Ext.encode(store_data),
                    "event": button.action
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    if(!Ext.isEmpty(Ext.getStore('GridAdminInventories'))) Ext.getStore('GridAdminInventories').load();
                    if(!Ext.isEmpty(Ext.getStore('GridReturnQueryAdminInventories'))) Ext.getStore('GridReturnQueryAdminInventories').load();
                },
                failure: function() {
                }
            });
//            console.log("ZZ");
        }
    }
});