/**
 * 销售个案标签页上的controller
 */
Ext.define('EIM.controller.Salecases', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridSalecases',
        'Salelogs',
        'Customers',
        'MiniCustomers',
        'ComboGroups'/*,
        'dict.SalelogProcesses',
        'dict.SalelogPriorities',
        'dict.Expresses'*/
    ],
    models: [
        'GridSalecase',
        'Salelog',
        'Customer',
        'MiniCustomer',
        'ComboGroup',
//        'dict.SalelogProcess',
//        'dict.SalelogPriority',
//        'dict.Express',
        'ComboUser'
    ],

    views: [
        'salecase.Panel',
        'salecase.Grid',
        'salelog.Grid',
        'salecase.Detail',
//        'etscux.ExpandableCustomerUnitCombo',
//        'etscux.ExpandableCustomerCombo',
        'customer.MiniGrid',
        'salecase.Form',
        'salecase.TransferForm'
    ],

    init: function() {
        var me = this;
        var salelog_tip = Ext.create('Ext.tip.ToolTip', {
            autoHide : false,
            closable : true,
            draggable: true,
            resizable: true,
            maxWidth: 500
        });

        me.control({
            'salecase_grid': {
                afterrender: this.applyFilter,
                selectionchange: this.salecaseSelectionChange,
                render: this.clearChildStore
            },
            'button[action=addSalecase]': {
                click: this.addSalecase
            },
            'button[action=transferSalecase]': {
                click: this.transferSalecase
            },
            'button[action=addSalelog]': {
                click: this.addSalelog
            },
            'customer_mini_grid': {
                selectionchange: this.customerMiniSelectionChange
            },
            'customer_add_to_mini_form': {
                show: this.resetCustomerStore
            },
            'button[action=addCustomerFrom]': {
                click: this.addCustomerFrom
            },
            'button[action=deleteCustomerFrom]': {
                click: this.deleteCustomerFrom
            },
            //个案信息修改的“确定”按钮
            'button[action=salecaseSubmit]': {
            	click: this.salecaseSubmit
            },
            //“新增个案”表单的“保存”按钮
            'salecase_form button[action=save]': {
                click: this.salecaseFormSubmit
            },
//            //“推荐产品”表单的“保存”按钮
//            'recommend_item_form button[action=save]': {
//                click: this.recommendItemSubmit
//            },
            'salelog_grid': {
                cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e) {
                    if(td.innerHTML.indexOf("</a>") === -1) {
                        salelog_tip.update(td.innerHTML);
                        salelog_tip.show();
                        salelog_tip.setPosition(e.getXY());
                    }
                }
            },
            'salelog_grid button[action=addRemind]': {
                click: this.loadRemindController
            },
            'salelog_form': {
                close: function() {
//                    if(Ext.ComponentQuery.query("recommended_item_grid")) Ext.ComponentQuery.query("recommended_item_grid")[0].destroy();
//                    if(Ext.ComponentQuery.query("recommend_tab")) Ext.ComponentQuery.query("recommend_tab")[0].destroy();
//                    if(Ext.ComponentQuery.query("salelog_form")) Ext.ComponentQuery.query("salelog_form")[0].destroy();
//                    console.log("recommended_item_grid 被销毁了");
                }
            },
            'salecase_transfer_form button[action=save]': {
                click: this.transferSalecaseSubmit
            },
            'mail_tab': {
                render: this.loadMailController
            },
            'quote_tab': {
                render: this.loadQuoteController
            },
            'contract_tab': {
                render: this.loadContractController
            },
            'wait_tab': {
                render: this.loadWaitController
            }
        });
//      Ext.create("EIM.view.salecase.Layout", {
//      });
    },

    /**
     * 加载时把子表（“销售日志列表”、“联系人列表”这些）的数据清空
     * 否则当关闭再打开标签时会有加载不到字典项的错误
     * 2012-10-25
     */
    clearChildStore: function() {
        Ext.getStore('Salelogs').removeAll();
        Ext.getStore('MiniCustomers').removeAll();
    },


    addSalecase: function() {
        Ext.widget('salecase_form').show();
    },

    transferSalecase: function() {
        Ext.widget('salecase_transfer_form').show();
    },

    addSalelog: function() {
        Ext.getBody().mask("加载中，请稍候……");
        var me = this;
        load_uniq_controller(me, 'Salelogs');
        //新增销售工作日志时加载第一个标签页“推荐”的controller，其它的标签激活时再加载
        load_uniq_controller(me, 'salelog.Recommend');
//        load_uniq_controller(me, 'Salelogs');
        Ext.widget('salelog_form').show("", function(){
//            Ext.ComponentQuery.query("salelog_form>container>tabpanel")[0].items.getAt(3).setDisabled(true);
//            Ext.ComponentQuery.query("salelog_form>container>tabpanel")[0].setActiveTab(2);
            Ext.getStore('MailedSamples').removeAll();
            Ext.getStore('MailedContents').removeAll();
            Ext.getStore('MailedProcessingPieceToVendors').removeAll();
            Ext.getStore('MailedProcessingPieceToCustomers').removeAll();
            Ext.getStore('MailedProducts').removeAll();
            Ext.getStore('RecommendedItems').removeAll();
        }, this);
        Ext.getBody().unmask();
    },
    
    /*
     * 打开“添加联系人”窗口时，把客户combo里带的customer_unit的过滤条件清除掉
     */
    resetCustomerStore: function(window) {
        var expandable_combo = window.down('expandable_customer_combo', false);
        var customer_combo = expandable_combo.down('combo', false);
        customer_combo.getStore().getProxy().setExtraParam('customer_unit_id', null);
    },

    addCustomerFrom: function() {
        var me = this;
        load_uniq_controller(me, 'Customers');
        Ext.widget('customer_add_to_mini_form').show();
    },
    
    deleteCustomerFrom: function(button) {
        var grid = button.up('grid');
        var store = grid.getStore();
        var selection = grid.getSelectedItem();
        var salecase_id = Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id");

        Ext.Msg.confirm('请确认', '你真的要删除选中项吗？', function(button) {
            if(button === 'yes') {
                store.remove(selection);
                Ext.Ajax.request({//AJAX方式提交
                    url: 'customers/delete_customers_salecases',
//                    url: 'servlet/SalselogPostServlet?type=deleteCaseCustomers',
                    params: {
                        customer_id: selection.get("id"),
                        salecase_id : salecase_id
                    },
                    success:function(request){
                        Ext.getStore("Salelogs").load()
                    },
                    failure:function(){
                        Ext.Msg.alert('错误','你的网貌似有问题，请刷新再说……');
                    }
                });
            }
        });
    },
    
    salecaseSubmit: function(button, e, eOpts) {
//    	var me = button;
    	var form = button.up('form');
    	var sale_case_id = Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id");
    	form.submit({
    		url: 'salecases/save_salecase',
    		params: {
    			id : sale_case_id
	    	},
    		submitEmptyText: false,
            success: function(the_form, action){
                var response = action.response;
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);
                Ext.getStore("GridSalecases").load();
	    	}
    	});
    },

    salecaseFormSubmit: function(button, e, eOpts) {
        var me = button;
        var win = me.up('window');
        var form = win.down('form', false);
        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.form.submit({
                url:'salecases/save_salecase',
                submitEmptyText: false,
                success: function(the_form, action){
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore("GridSalecases").load();
                }
            });
        }
    },

    /**
     * 如果全局过滤条件有值存在，则清空之前的过滤，改为过滤全局变量
     * @param grid
     */
    applyFilter: function(grid) {
        if(!Ext.isEmpty(globeFilter)) {
            grid.filters.clearFilters();
            var gridFilter = grid.filters.addFilter({
                active: true,
                type: 'string',
                dataIndex: 'number'
            });
            gridFilter.setValue(globeFilter);
            gridFilter.setActive(true, false);
        }
        globeFilter = ""; //过滤完清空
    },
    /**
     * 上面的“个案列表”里选中时，下面“个案信息”、“客户信息”、“日志列表”里加载数据
     * @param grid
     * @param selected
     * @param eOpts
     */
    salecaseSelectionChange: function(grid, selected, eOpts) {
        var root = Ext.ComponentQuery.query("salecase_tab")[0];
        var form = Ext.ComponentQuery.query('form#salecase_info', root)[0];
        var add_salelog_btn = Ext.ComponentQuery.query("salelog_grid button[action=addSalelog]", root)[0];
        var add_remind_btn = Ext.ComponentQuery.query("salelog_grid button[action=addRemind]", root)[0];
        var add_customer_btn = Ext.ComponentQuery.query("customer_mini_grid button[action=addCustomerFrom]", root)[0];
        var edit_salecase_btn = Ext.ComponentQuery.query("button[action=salecaseSubmit]")[0];
        var transfer_salecase_btn = Ext.ComponentQuery.query("button[action=transferSalecase]")[0];
        add_salelog_btn.setDisabled(true);
        add_remind_btn.setDisabled(true);
        add_customer_btn.setDisabled(true);
        edit_salecase_btn.setDisabled(true);
        if(selected.length > 0){
            form.loadRecord(selected[0]);
            Ext.getStore('Salelogs').load({
                params: {
                    salecase_id: selected[0].get("id")
                }
            });
            Ext.getStore('MiniCustomers').load({
                params: {
                    salecase_id: selected[0].get("id")
                }
            });
            if(selected[0].get("editable")) {
                add_salelog_btn.setDisabled(false);
                add_remind_btn.setDisabled(false);
                add_customer_btn.setDisabled(false);
                edit_salecase_btn.setDisabled(false);
                transfer_salecase_btn.setDisabled(false);
            }
        }else{
            form.form.reset();
            Ext.getStore('Salelogs').removeAll();
            Ext.getStore('Customers').removeAll();
            Ext.getStore('MiniCustomers').removeAll();
            transfer_salecase_btn.setDisabled(true);
        }
    },

    /**
     * “联系人列表”里选中时，允许/禁止“删除联系人”按钮
     * @param grid
     * @param selected
     * @param eOpts
     */
    customerMiniSelectionChange: function(grid, selected, eOpts) {
        var root = Ext.ComponentQuery.query("salecase_tab")[0];
        var delete_customer_btn = Ext.ComponentQuery.query("customer_mini_grid button[action=deleteCustomerFrom]", root)[0];
        if(selected.length > 0){
            delete_customer_btn.setDisabled(false);
        }else{
            delete_customer_btn.setDisabled(true);
        }
    },
//    loadProcessStore: function() {
////        Ext.getStore("dict.SalelogProcesses").load();
//    },

//    editSalelog: function(grid, record, item, index, e, eOpts ){
//    },
    loadRemindController: function() {
        var me = this;
        load_uniq_controller(me, 'Reminds');
        var salecase_number = Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("number");
        var view = Ext.widget('remind_form').show();
        view.down('[name=source]', false).setValue(salecase_number);
    },

    transferSalecaseSubmit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var sale_case_id = Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("id");
        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: 'salecases/transfer_salecase',
                params: {
                    id : sale_case_id
                },
                submitEmptyText: false,
                success: function(the_form, action){
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    win.close();
                    Ext.getStore("GridSalecases").load();
                },
                failure: function() {
                    Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                }
            });
        }
    },

    loadMailController: function() {
        //激活标签时加载其上的controller
        var me = this;
        load_uniq_controller(me, 'salelog.mail.Samples');
    },
    loadQuoteController: function() {
        //激活标签时加载其上的controller
        var me = this;
        load_uniq_controller(me, 'salelog.Quote');
    },
    loadContractController: function() {
        //激活标签时加载其上的controller
        var me = this;
        load_uniq_controller(me, 'salelog.Contract');
    },
    loadWaitController: function() {
        //激活标签时加载其上的controller
        var me = this;
        load_uniq_controller(me, 'salelog.Wait');
    }
});