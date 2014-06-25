Ext.define('EIM.controller.salelog.QuoteForm', {
    extend: 'Ext.app.Controller',

    views: [
//        'salelog.NewQuoteForm',
//        'salelog.EditQuoteForm'
    ],

    refs: [{
        //只有salelog_quote_form里的表格有操作的意义，所以直接就用了这个表格
        ref: 'grid',
        selector: 'salelog_quote_form salelog_quoted_item_grid'
    }],

    init: function() {
        var me = this;

        me.control({
//            //salelog_quoted_item_grid有两个，要限制一下
//            'salelog_new_quote_form>salelog_quoted_item_grid': {
            'salelog_quoted_item_grid': {
                render: this.loadQuoteItemForm,
                itemdblclick: this.editQuoteItem,
                selectionchange: this.selectionChange
            },
            'button[action=addQuoteItem]': {
                click: this.addQuoteItem
            },
            'button[action=editQuoteItem]': {
                click: this.editQuoteItem
            }
        });
    },
    loadQuoteItemForm: function() {
        //加载QuoteItemForm.js，以使用其中的QuoteItemForm表单视图
        var me = this;
        load_uniq_controller(me, 'salelog.QuoteItemForm');
    },
    
    selectionChange: function(selectionModel, selected, eOpts) {
        var edit_btn = this.getGrid().down("[iconCls=btn_edit]");
        if(selected.length > 0){
            edit_btn.setDisabled(false);
        }else{
            edit_btn.setDisabled(true);
        }
    },

    addQuoteItem: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.QuoteItemForm');
        //widget里写了autoShow，不要执行回调函数的话就不用show一下了
        var view = Ext.widget('quote_item_form');//.show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.show();
        btn_update.hide();
    },

    editQuoteItem: function() {
        var me = this;
        load_uniq_controller(me, 'salelog.QuoteItemForm');
        var record = me.getGrid().getSelectedItem();
        var view = Ext.widget('quote_item_form');
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.hide();
        btn_update.show();
        view.down('form').loadRecord(record);
    }
})