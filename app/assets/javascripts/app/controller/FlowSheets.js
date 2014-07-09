/**
 * 维修水单标签页上的controller
 */
Ext.define('EIM.controller.FlowSheets', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridFlowSheets',
        'ServiceLogs',
        'Customers',
        'ServiceMiniCustomers',
        'FlowSheetReceivedEquipments',
        //        'ComboQuoteSales',
        'ComboSupporters',
        'ComboGroups'
        /*,
        'dict.SalelogProcesses',
        'dict.SalelogPriorities',
        'dict.Expresses'*/
    ],
    models: [
        'GridFlowSheet',
        'ServiceLog',
        'Customer',
        'ServiceMiniCustomer',
        'FlowSheetReceivedEquipment',
        //        'ComboQuoteSale',
        'ComboSupporter',
        'ComboGroup',
        //        'dict.SalelogProcess',
        //        'dict.SalelogPriority',
        //        'dict.Express',
        'ComboUser'
    ],

    views: [
        'flow_sheet.Panel',
        'flow_sheet.Grid',
        'salelog.Grid',
        'flow_sheet.Detail',
        //        'etscux.ExpandableCustomerUnitCombo',
        //        'etscux.ExpandableCustomerCombo',
        'customer.ServiceMiniGrid',
        'flow_sheet.ReceivedEquipmentGrid',
        'flow_sheet.ServiceLogGrid',
        'flow_sheet.Info',
        'flow_sheet.Form'
        /*,
        'flow_sheet.TransferForm'*/
    ],

    refs: [{
        ref: 'grid',
        selector: 'flow_sheet_grid'
    }],

    init: function() {
        var me = this;
        var salelog_tip = Ext.create('Ext.tip.ToolTip', {
            autoHide: false,
            closable: true,
            draggable: true,
            resizable: true,
            maxWidth: 500
        });

        me.control({
            'flow_sheet_grid': {
                afterrender: this.applyFilter,
                selectionchange: this.flowSheetSelectionChange,
                render: this.clearChildStore
            },
            'button[action=addFlowSheet]': {
                click: this.addFlowSheet
            },
            //            'flow_sheet_service_log_grid menuitem[action=quote]': {
            //                click: function() {
            //                    console.log("AA");
            //                }
            //            },
            'flow_sheet_service_log_grid menuitem[action=confirmQuit]': {
                click: this.popConfirmQuitForm
            },
            'flow_sheet_service_log_grid menuitem[action=checkEquipment]': {
                click: this.popCheckEquipmentForm
            },
            'flow_sheet_service_log_grid menuitem[action=waitCustomerRespond]': {
                click: this.popWaitCustomerRespondForm
            },
            'flow_sheet_service_log_grid menuitem[action=changeParts]': {
                click: this.popChangePartsForm
            },
            'flow_sheet_service_log_grid menuitem[action=changeDetachedParts]': {
                click: this.popChangeDetachedPartsForm
            },
            'flow_sheet_service_log_grid menuitem[action=customerRespond]': {
                click: this.popCustomerRespondForm
            },
            'flow_sheet_service_log_grid menuitem[action=waitSpare]': {
                click: this.popWaitSpareForm
            },
            'flow_sheet_service_log_grid menuitem[action=waitFactorySupport]': {
                click: this.popWaitFactorySupportForm
            },
            'flow_sheet_service_log_grid menuitem[action=spareDone]': {
                click: this.popSpareDoneForm
            },
            'flow_sheet_service_log_grid menuitem[action=factorySupportDone]': {
                click: this.popFactorySupportDoneForm
            },
            'flow_sheet_service_log_grid menuitem[action=checkOrTest]': {
                click: this.popCheckOrTestForm
            },
            'flow_sheet_service_log_grid menuitem[action=calibrateOrDebug]': {
                click: this.popCalibrateOrDebugForm
            },
            'flow_sheet_service_log_grid menuitem[action=dispute]': {
                click: this.popDisputeForm
            },
            'flow_sheet_service_log_grid menuitem[action=waitCustomerPay]': {
                click: this.popWaitCustomerPayForm
            },
            'flow_sheet_service_log_grid menuitem[action=customerPayDone]': {
                click: this.popCustomerPayDoneForm
            },
            'flow_sheet_service_log_grid menuitem[action=redPackage], flow_sheet_service_log_grid menuitem[action=greenPackage], flow_sheet_service_log_grid menuitem[action=redDeliver], flow_sheet_service_log_grid menuitem[action=greenDeliver]': {
                click: function() {
                    Ext.ComponentQuery.query('flow_sheet_detail')[0].down('tabpanel').setActiveTab(1);
                }
            },
            'flow_sheet_service_log_grid button[action=addQuote]': {
                click: this.addQuote
            },
            'flow_sheet_received_equipment_grid button[action=addEquipment]': {
                click: this.addEquipment
            },
            'flow_sheet_received_equipment_grid': {
                selectionchange: this.receivedEquipmentSelectionChange
            },
            'flow_sheet_received_equipment_grid button[action=deleteEquipment]': {
                click: this.deleteEquipment
            },
            'flow_sheet_received_equipment_grid button[action=packageEquipment]': {
                click: this.packageEquipment
            },
            'flow_sheet_received_equipment_grid button[action=returnEquipment]': {
                click: this.returnEquipment
            },
            'flow_sheet_received_equipment_grid button[action=receiveEquipment]': {
                click: this.receiveEquipment
            },
            'flow_sheet_received_equipment_grid button[action=deliverEquipment]': {
                click: this.deliverEquipment
            },


            'service_customer_mini_grid': {
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
            'flow_sheet_info [action=submitFlowSheetInfo]': {
                click: this.flowSheetSubmit
            },
            //“新增个案”表单的“保存”按钮
            'flow_sheet_form button[action=save]': {
                click: this.flow_sheetFormSubmit
            },
            //            //“推荐产品”表单的“保存”按钮
            //            'recommend_item_form button[action=save]': {
            //                click: this.recommendItemSubmit
            //            },
            'salelog_grid': {
                cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e) {
                    if (td.innerHTML.indexOf("</a>") === -1) {
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
            //            'flow_sheet_transfer_form button[action=save]': {
            //                click: this.transferFlowSheetSubmit
            //            },
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
        //      Ext.create("EIM.view.flow_sheet.Layout", {
        //      });
    },

    /**
     * 加载时把子表（“销售日志列表”、“联系人列表”这些）的数据清空
     * 否则当关闭再打开标签时会有加载不到字典项的错误
     * 2012-10-25
     */
    clearChildStore: function() {
        Ext.getStore('ServiceLogs').removeAll();
        Ext.getStore('ServiceMiniCustomers').removeAll();
    },


    addFlowSheet: function() {
        Ext.widget('flow_sheet_form').show();
    },

    popConfirmQuitForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.ConfirmQuit');
        var view = Ext.widget('service_log_confirm_quit_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    popCheckEquipmentForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.CheckEquipment');
        var view = Ext.widget('service_log_check_equipment_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    popWaitCustomerRespondForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.WaitCustomerRespond');
        var view = Ext.widget('service_log_wait_customer_respond_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    popChangePartsForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.ChangeParts');
        var view = Ext.widget('service_log_change_parts_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
        view.down('admin_inventory_mini_grid[name=source_grid]', false).getStore().load();
        view.down('admin_inventory_mini_grid[name=target_grid]', false).getStore().clearData();
        //        console.log();
    },

    popChangeDetachedPartsForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.ChangeDetachedParts');
        var view = Ext.widget('service_log_change_detached_parts_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    popCustomerRespondForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.CustomerRespond');
        var view = Ext.widget('service_log_customer_respond_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    popWaitSpareForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.WaitSpare');
        var view = Ext.widget('service_log_wait_spare_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    popSpareDoneForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.SpareDone');
        var view = Ext.widget('service_log_spare_done_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    popWaitFactorySupportForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.WaitFactorySupport');
        var view = Ext.widget('service_log_wait_factory_support_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    popFactorySupportDoneForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.FactorySupportDone');
        var view = Ext.widget('service_log_factory_support_done_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    popCheckOrTestForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.CheckOrTest');
        var view = Ext.widget('service_log_check_or_test_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    popCalibrateOrDebugForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.CalibrateOrDebug');
        var view = Ext.widget('service_log_calibrate_or_debug_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    popDisputeForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.Dispute');
        var view = Ext.widget('service_log_dispute_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    popWaitCustomerPayForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.WaitCustomerPay');
        var view = Ext.widget('service_log_wait_customer_pay_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    popCustomerPayDoneForm: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.CustomerPayDone');
        var view = Ext.widget('service_log_customer_pay_done_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    addQuote: function() {
        var me = this;
        load_uniq_controller(me, 'Quotes');
        load_uniq_controller(me, 'quote.ServiceForm');
        var view = Ext.widget('quote_service_form').show();
        //给combo做一个假的store以正确显示值
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        var customer_unit_field = view.down('expandable_customer_unit_combo combo', false);
        customer_unit_field.getStore().loadData([
            [selection.get('customer_units>id').split('|')[0], selection.get('customer_units>(name|en_name|unit_aliases>unit_alias)').split("、")[0]]
        ]);
        customer_unit_field.setValue(parseInt(selection.get('customer_units>id').split('|')[0]));

        var customer_field = view.down('expandable_customer_combo combo', false);
        customer_field.getStore().loadData([
            [selection.get('customers>id').split('|')[0], selection.get('customers>(name|en_name)').split("、")[0]]
        ]);
        customer_field.getStore().getProxy().setExtraParam('customer_unit_id', parseInt(selection.get('customer_units>id').split('|')[0]));
        customer_field.setValue(parseInt(selection.get('customers>id').split('|')[0]));
    },

    addEquipment: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.AddEquipment');
        var view = Ext.widget('service_log_add_equipment_form').show();
        var grid = me.getGrid();
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
    },

    receivedEquipmentSelectionChange: function(select_model, selected, eOpts) {
        var grid = Ext.ComponentQuery.query('flow_sheet_received_equipment_grid')[0];
        var delete_equipment_button = grid.down('button[action=deleteEquipment]', false);
        var package_equipment_button = grid.down('button[action=packageEquipment]', false);
        var return_equipment_button = grid.down('button[action=returnEquipment]', false);
        var receive_equipment_button = grid.down('button[action=receiveEquipment]', false);
        var deliver_equipment_button = grid.down('button[action=deliverEquipment]', false);
        delete_equipment_button.disable();
        package_equipment_button.disable();
        return_equipment_button.disable();
        receive_equipment_button.disable();
        deliver_equipment_button.disable();
        if (selected.length > 0) {
            delete_equipment_button.enable();
            var equipment_array = Ext.Array.pluck(selected, "data");
            var packaged_count = 0;
            var returned_count = 0;
            var delivered_count = 0;
            Ext.Array.each(equipment_array, function(item, index) {
                if (item["is_packaged"]) packaged_count += 1;
                if (item["is_return_factory"]) returned_count += 1;
                if (item["is_sent_back"]) delivered_count += 1;
            });
            var all_packaged = (packaged_count == equipment_array.length);
            var none_packaged = (packaged_count == 0);
            var all_returned = (returned_count == equipment_array.length);
            var none_returned = (returned_count == 0);
            var none_delivered = (delivered_count == 0);

            package_equipment_button.setDisabled(!(none_packaged && none_returned && none_delivered));
            return_equipment_button.setDisabled(!all_packaged);
            receive_equipment_button.setDisabled(!all_returned);
            deliver_equipment_button.setDisabled(!all_packaged);
        }
    },

    deleteEquipment: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.DeleteEquipment');
        var view = Ext.widget('service_log_delete_equipment_form').show();
        var grid = me.getGrid();
        var equipment_grid = Ext.ComponentQuery.query('flow_sheet_received_equipment_grid')[0];
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
        view.down('[name=equipment_ids]', false).setValue(Ext.Array.pluck(Ext.Array.pluck(equipment_grid.getSelectedItems(), "data"), "id").join("|"));
    },

    packageEquipment: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.PackageEquipment');
        var view = Ext.widget('service_log_package_equipment_form').show();
        var grid = me.getGrid();
        var equipment_grid = Ext.ComponentQuery.query('flow_sheet_received_equipment_grid')[0];
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
        view.down('[name=equipment_ids]', false).setValue(Ext.Array.pluck(Ext.Array.pluck(equipment_grid.getSelectedItems(), "data"), "id").join("|"));
    },

    returnEquipment: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.ReturnEquipment');
        var view = Ext.widget('service_log_return_equipment_form').show();
        var grid = me.getGrid();
        var equipment_grid = Ext.ComponentQuery.query('flow_sheet_received_equipment_grid')[0];
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
        view.down('[name=equipment_ids]', false).setValue(Ext.Array.pluck(Ext.Array.pluck(equipment_grid.getSelectedItems(), "data"), "id").join("|"));
    },

    receiveEquipment: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.ReceiveEquipment');
        var view = Ext.widget('service_log_receive_equipment_form').show();
        var grid = me.getGrid();
        var equipment_grid = Ext.ComponentQuery.query('flow_sheet_received_equipment_grid')[0];
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
        view.down('[name=equipment_ids]', false).setValue(Ext.Array.pluck(Ext.Array.pluck(equipment_grid.getSelectedItems(), "data"), "id").join("|"));
    },

    deliverEquipment: function() {
        var me = this;
        load_uniq_controller(me, 'service_log.DeliverEquipment');
        var view = Ext.widget('service_log_deliver_equipment_form').show();
        var grid = me.getGrid();
        var equipment_grid = Ext.ComponentQuery.query('flow_sheet_received_equipment_grid')[0];
        var selection = grid.getSelectedItem();
        view.down('[name=flow_sheet_id]', false).setValue(selection.get('id'));
        view.down('[name=equipment_ids]', false).setValue(Ext.Array.pluck(Ext.Array.pluck(equipment_grid.getSelectedItems(), "data"), "id").join("|"));
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
        var flow_sheet_id = Ext.ComponentQuery.query("flow_sheet_grid")[0].getSelectionModel().getSelection()[0].get("id");

        Ext.Msg.confirm('请确认', '你真的要删除选中项吗？', function(button) {
            if (button === 'yes') {
                store.remove(selection);
                Ext.Ajax.request({ //AJAX方式提交
                    url: 'customers/delete_customers_flow_sheets',
                    //                    url: 'servlet/SalselogPostServlet?type=deleteCaseCustomers',
                    params: {
                        customer_id: selection.get("id"),
                        flow_sheet_id: flow_sheet_id
                    },
                    success: function(request) {
                        Ext.getStore("Salelogs").load()
                    },
                    failure: function() {
                        Ext.Msg.alert('错误', '你的网貌似有问题，请刷新再说……');
                    }
                });
            }
        });
    },

    flowSheetSubmit: function(button, e, eOpts) {
        //    	var me = button;
        var form = button.up('form');
        var sale_case_id = Ext.ComponentQuery.query("flow_sheet_grid")[0].getSelectionModel().getSelection()[0].get("id");
        form.submit({
            url: 'flow_sheets/save_flow_sheet',
            params: {
                id: sale_case_id
            },
            submitEmptyText: false,
            success: function(the_form, action) {
                var response = action.response;
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);

                var grid = Ext.ComponentQuery.query('flow_sheet_grid')[0];
                var last_selected = grid.getSelectedItem();
                grid.getStore().load({
                    callback: function() {
                        var rowIndex = this.find('id', last_selected.getId(), 0, false, false, true);
                        grid.getView().select(rowIndex);
                    }
                });
            }
        });
    },

    flow_sheetFormSubmit: function(button, e, eOpts) {
        var me = button;
        var win = me.up('window');
        var form = win.down('form', false);
        if (form.form.isValid()) {
            //防双击
            button.disable();
            form.form.submit({
                url: 'flow_sheets/save_flow_sheet',
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore("GridFlowSheets").load();
                }
            });
        }
    },

    /**
     * 如果全局过滤条件有值存在，则清空之前的过滤，改为过滤全局变量
     * @param grid
     */
    applyFilter: function(grid) {
        if (!Ext.isEmpty(globeFilter)) {
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
    flowSheetSelectionChange: function(selection_model, selected, eOpts) {
        var root = Ext.ComponentQuery.query("flow_sheet_panel")[0];
        var form = Ext.ComponentQuery.query('flow_sheet_info', root)[0];
        var add_customer_btn = Ext.ComponentQuery.query("flow_sheet_detail customer_service_mini_grid button[action=addCustomerFrom]", root)[0];
        var delete_customer_btn = Ext.ComponentQuery.query("flow_sheet_detail customer_service_mini_grid button[action=deleteCustomerFrom]", root)[0];
        var update_flow_sheet_info_btn = Ext.ComponentQuery.query("flow_sheet_info [action=submitFlowSheetInfo]", root)[0];
        var add_received_equipment_btn = Ext.ComponentQuery.query("flow_sheet_detail flow_sheet_received_equipment_grid button[action=addEquipment]", root)[0];
        //        var delete_received_equipment_btn = Ext.ComponentQuery.query("flow_sheet_detail flow_sheet_received_equipment_grid button[action=deleteEquipment]", root)[0];
        var add_service_log_btn = Ext.ComponentQuery.query("flow_sheet_detail flow_sheet_service_log_grid button[action=addServiceLog]", root)[0];
        var add_quote_btn = Ext.ComponentQuery.query("flow_sheet_detail flow_sheet_service_log_grid button[action=addQuote]", root)[0];
        //        console.log(form);
        add_customer_btn.setDisabled(true);
        delete_customer_btn.setDisabled(true);
        update_flow_sheet_info_btn.setDisabled(true);
        add_received_equipment_btn.setDisabled(true);
        //        delete_received_equipment_btn.setDisabled(true);
        add_service_log_btn.setDisabled(true);
        add_quote_btn.setDisabled(true);
        if (selected.length > 0) {
            form.loadRecord(selected[0]);
            Ext.getStore('ServiceLogs').load({
                params: {
                    flow_sheet_id: selected[0].get("id")
                }
            });
            Ext.getStore('FlowSheetReceivedEquipments').load({
                params: {
                    flow_sheet_id: selected[0].get("id")
                }
            });
            Ext.getStore('ServiceMiniCustomers').load({
                params: {
                    flow_sheet_id: selected[0].get("id")
                }
            });
            //            if(selected[0].get("editable")) {
            add_customer_btn.setDisabled(false);
            delete_customer_btn.setDisabled(false);
            update_flow_sheet_info_btn.setDisabled(false);
            add_received_equipment_btn.setDisabled(false);
            //            delete_received_equipment_btn.setDisabled(false);
            add_service_log_btn.setDisabled(false);
            add_quote_btn.setDisabled(false);
            //            }
        } else {
            form.form.reset();
            Ext.getStore('ServiceLogs').removeAll();
            Ext.getStore('ServiceMiniCustomers').removeAll();
            Ext.getStore('FlowSheetReceivedEquipments').removeAll();
        }

        //根据状态来决定隐藏/显示哪些动作
        var menu = Ext.ComponentQuery.query('flow_sheet_service_log_grid menu', root)[0];
        var menu_items = menu.items.items;
        Ext.Array.each(menu_items, function(item, index, items) {
            item.hide();
        });
        if (selected.length > 0) {
            switch (selected[0].get('state')) {
                case "a_start":
                    menu.down('[action=checkEquipment]').show();
                    menu.down('[action=confirmQuit]').show();
                    break;
                case "b_dealing":
                    menu.down('[action=waitCustomerRespond]').show();
                    menu.down('[action=waitSpare]').show();
                    menu.down('[action=waitFactorySupport]').show();
                    menu.down('[action=changeParts]').show();
                    menu.down('[action=changeDetachedParts]').show();
                    menu.down('[action=returnFactorySend]').show();
                    menu.down('[action=checkOrTest]').show();
                    menu.down('[action=calibrateOrDebug]').show();
                    menu.down('[action=dispute]').show();
                    menu.down('[action=waitCustomerPay]').show();
                    menu.down('[action=greenPackage]').show();
                    break;
                case "c_waiting_customer_send":
                    menu.down('[action=checkEquipment]').show();
                    break;
                case "c_waiting_customer_respond":
                    menu.down('[action=customerRespond]').show();
                    break;
                case "c_waiting_spare":
                    menu.down('[action=spareDone]').show();
                    break;
                case "c_waiting_factory_support":
                    menu.down('[action=factorySupportDone]').show();
                    break;
                case "c_waiting_customer_pay":
                    menu.down('[action=customerPayDone]').show();
                    break;
                case "d_failure":
                    menu.down('[action=redPackage]').show();
                    break;
                case "e_red_package_done":
                    menu.down('[action=redDeliver]').show();
                    break;
                case "e_green_package_done":
                    menu.down('[action=greenDeliver]').show();
                    break;
                case "f_red_done":
                    menu.down('[action=track]').show();
                    break;
                case "f_green_done":
                    menu.down('[action=track]').show();
                    break;
                case "g_complete":
                    break;
                default:
            }
        } else {

        }
    },

    /**
     * “联系人列表”里选中时，允许/禁止“删除联系人”按钮
     * @param grid
     * @param selected
     * @param eOpts
     */
    customerMiniSelectionChange: function(selection_model, selected, eOpts) {
        var root = Ext.ComponentQuery.query("flow_sheet_tab")[0];
        var delete_customer_btn = Ext.ComponentQuery.query("service_customer_mini_grid button[action=deleteCustomerFrom]", root)[0];
        if (selected.length > 0) {
            delete_customer_btn.setDisabled(false);
        } else {
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
        var flow_sheet_number = Ext.ComponentQuery.query("flow_sheet_grid")[0].getSelectionModel().getSelection()[0].get("number");
        var view = Ext.widget('remind_form').show();
        view.down('[name=source]', false).setValue(flow_sheet_number);
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