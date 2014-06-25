Ext.define('EIM.controller.salelog.QuoteItemForm', {
    extend: 'Ext.app.Controller',

    views: [
        'salelog.QuoteItemForm'
    ],

//    refs: [{
//        ref: 'list',
//        selector: 'recommended_item_grid'
//    }],

    init: function() {
        var me = this;

        me.control({
	        'quote_item_form button[action=save]': {
	            click: this.validate
	        },
	        'quote_item_form button[action=update]': {
	        	click: this.validate
	        }
        });
    },

    validate: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var values = form.getValues();
        
        var id = Number(values.id);
        var store = Ext.getStore("SalelogQuotedItems");
        if(form.form.isValid()){
	        if(button.action === "save") {
	        	//新增
	        	store.add(values);
	        }else{
	        	//修改，找出修改哪一条
	    		var record = Ext.ComponentQuery.query("salelog_quote_form salelog_quoted_item_grid")[0].getSelectionModel().getSelection()[0];
				record.set(values);
	        }
	        win.close();
        }
    }
})