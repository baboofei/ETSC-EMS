/**
 * 拆开后单独加载“申请入库”视图用的controller
 */
Ext.define('EIM.controller.admin_inventory.BuyForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'AdminInventorySNs'
        'ComboPurchasers'
    ],
    models: [
//        'AdminInventorySN'
        'ComboPurchaser'
    ],

    views: [
        'admin_inventory.BuyForm'
    ],

    //    refs: [{
    //        ref: 'list',
    //        selector: 'recommended_item_grid'
    //    }],

    init: function() {
        var me = this;

        me.control({
            'admin_inventory_buy_form': {
                afterrender: this.allowTrigger
            },
            'admin_inventory_buy_form button[group=submit]': {
                click: this.submit
            },
            'admin_inventory_buy_form button[action=save_and_add_more]': {
                click: this.saveAndAddMoreItem
            }
        });
    },

    allowTrigger: function(win) {
        var me = this;
        var currency_number_field = win.down('[name=buy_price] numberfield', false);
        currency_number_field.on('change', me.syncRmb, this);

        //如果采购列表中包含当前用户，则设本人为采购combo的默认值
        var buyer_user_field = win.down('[name=buyer>id]', false);
        if(Ext.Array.indexOf(Ext.Array.pluck(Ext.ComponentQuery.query('functree')[0].allBuyer, "id"),userId) != -1) {
            buyer_user_field.setValue(userId);
        }
    },
    /**
     * 懒得加上汇率计算了，汇率又不能这边改，而且极少
     * @param number
     * @param newValue
     */
    syncRmb: function(number, newValue) {
        var currency_field = number.up('form').down('[name=buy_price] combo', false);
        if(currency_field.getValue() === 11) {
            var rmb_field = number.up('form').down('[name=rmb]', false);
            rmb_field.setValue(newValue);
        }
    },

    submit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var values = form.getValues();

        var grid = Ext.ComponentQuery.query("admin_inventory_for_stock_form admin_inventory_for_stock_grid")[0];

        var store = grid.getStore();//Ext.getStore('GridForStockAdminInventories');
        //币种、单价、供应商、供方联系人是ux里的，要单写一下
        values['currency_id'] = form.down('[name=buy_price] combo', false).getValue();
        values['currency_name'] = form.down('[name=buy_price] combo', false).getRawValue();
        values['buy_price'] = form.down('[name=buy_price] numberfield', false).getValue();
        values['vendor_unit_name'] = form.down('expandable_vendor_unit_combo combo', false).getRawValue();
        values['vendor_name'] = form.down('expandable_vendor_combo combo', false).getRawValue();
        values['buyer_user_name'] = form.down('combo[name=buyer>id]', false).getRawValue();

        //名称、型号都有可能是根据提示选出来的，但不是用它的id，所以提交的时候一律提交raw_value
        values['name'] = form.down('combo[name=name]', false).getRawValue();
        values['model'] = form.down('combo[name=model]', false).getRawValue();

        if(form.form.isValid()) {
            switch(button.action) {
                case "save":
                    //新增
                    store.add(values);
                    win.close();
                    break;
                case "update":
                    //修改
                    var record = grid.getSelectedItem();
                    record.set(values);
                    win.close();
                    break;
                case "save_apply":
                    //新增并继续
                    store.add(values);
                    break;
                case "update_apply":
                    //修改并继续
                    var record = grid.getSelectedItem();
                    record.set(values);
                    break;
                default:
//                    win.close();
            }
        }
    },

    saveAndAddMoreItem: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: "admin_inventories/save_admin_inventory",
                params: {
                    "event": "buy_in"
                },
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridAdminInventories').load();
                    button.enable();
                }
            });
        }
    }
});