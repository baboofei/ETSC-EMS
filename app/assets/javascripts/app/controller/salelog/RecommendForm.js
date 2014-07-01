/**
 * 拆开后单独加载“新增/修改推荐项目”视图用的controller
 */
Ext.define('EIM.controller.salelog.RecommendForm', {
    extend: 'Ext.app.Controller',

    stores: [
        'ComboVendorUnits',
        'Products'
    ],
    models: [
        'ComboVendorUnit',
        'Product'
    ],

    views: [
        'salelog.RecommendItemForm'
    ],

//    refs: [{
//        ref: 'list',
//        selector: 'recommended_item_grid'
//    }],

    init: function() {
        var me = this;

        me.control({
            'recommend_item_form button[action=save]': {
                click: this.validate
            },
            'recommend_item_form button[action=update]': {
            	click: this.validate
            },
            //选中一个产品后把指标带到下面的“指标”框中
            'recommend_item_form [name=product_id]': {
                select: this.setParameter
            },
            //勾选“仅推荐工厂时改变产品combo的状态”
            'recommend_item_form checkbox': {
                change: this.changeProductCombo
            }
        });
    },

    validate: function(button) {
        var win = button.up('window');
        var form = win.down('form', true);
        if(form.form.isValid()) {
            var values = form.getValues();
            //只有id不够，增加name的提交
            values.vendor_unit_name = form.down('combo[name=vendor_unit_id]', false).getRawValue();
            values.product_model = form.down('combo[name=product_id]', false).getRawValue();
            //disabled的不能自动提交，又要用，手动加上
            values.simple_description_cn = form.down('[name=simple_description_cn]', false).getValue();
            var store = Ext.getStore("RecommendedItems");
            if(button.action === "save") {
                //新增
                store.add(values);
            }else{
                //修改，找出修改哪一条
                var record = Ext.ComponentQuery.query("recommended_item_grid")[0].getSelectionModel().getSelection()[0];
                //如果勾选了“仅推荐工厂”，则取消掉product_id再提交
                if(form.down("checkbox").getValue()) values.product_id = "";
                record.set(values);
                store.sync();
            }
            win.close();
        }
////        console.log(form);
//        if(Ext.isEmpty(form.getValues().vendor_unit_id) &&
//            Ext.isEmpty(form.getValues().product_id) &&
//            Ext.isEmpty(form.getValues().parameter)) {
//            Ext.example.msg("不行", EIM_multi_field_invalid);
//            Ext.each(form.items.items, function(item){
//                item.markInvalid(EIM_multi_field_invalid);
//            });
//        }else{
//            Ext.each(form.items.items, function(item){
//                item.clearInvalid();
//            });
//            var values = form.getValues();
//            //只有id不够，增加name的提交
//            values.vendor_unit_name = form.down('combo[name=vendor_unit_id]', false).getRawValue();
//            values.product_model = form.down('combo[name=product_id]', false).getRawValue();
////            console.log(values);
////            this.addToStore(values);
//
//            var id = Number(values.id);
//            var store = Ext.getStore("RecommendedItems");
//            if(button.action === "save") {
//            	//新增
//            	store.add(values);
//            }else{
//            	//修改，找出修改哪一条
//        		var record = Ext.ComponentQuery.query("recommended_item_grid")[0].getSelectionModel().getSelection()[0];
//    			record.set(values);
//            }
//            win.close();
//        }
    },
    
    setParameter: function(combo, records, eOpts) {
        var win = combo.up('window');
        var form = win.down('form', false);
        var parameter = form.down('[name=simple_description_cn]', false);
        parameter.setValue(records[0].get("simple_description_cn"));
    },
    
    changeProductCombo: function(checkbox, newValue, oldValue, eOpts) {
        var win = checkbox.up('window');
        var form = win.down('form', false);
        var product_combo = form.down('[name=product_id]', false);
        var parameter = form.down('[name=simple_description_cn]', false);
        
        if(newValue) {
            //选中，则产品可以不填
//            console.log(product_combo);
            product_combo.setFieldLabel("产品");
            product_combo.allowBlank = true;
            product_combo.disable();
            product_combo.setValue();
            parameter.setValue();
        }else{
            product_combo.setFieldLabel('产品<span class="req" style="color:#ff0000">*</span>');
            product_combo.allowBlank = false;
            product_combo.enable();
        }
//        
    }
});