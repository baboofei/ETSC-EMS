/**
 * 合同标签页上的controller
 */
Ext.define('EIM.controller.Contracts', {
    extend: 'Ext.app.Controller',

    stores: [
        'Contracts',
        'Terms',
        'PayModes',
        'ContractItems',
        'ContractHistories',
        'Collections',
        'Receivables',
        'ComboQuoteSales'
    ],
    models: [
        'Contract',
        'Term',
        'ContractItem',
        'ContractHistory',
        'Collection',
        'Receivable',
        'ComboQuoteSale',
        'ComboUser'
    ],

    views: [
        'contract.Panel',
        'contract.Grid',
        'contract.Detail',
        'contract.Content',
        'contract.ItemGrid',
        'contract.HistoryGrid',
        'contract.CollectionPanel',
        'contract.CollectionGrid',
        'contract.ReceivableGrid',
        'contract.TransferForm'
    ],

    refs: [
        {
            ref: 'grid',
            selector: 'contract_grid'
        },
        {
            ref: 'itemGrid',
            selector: 'contract_item_grid'
        },
        {
            ref: 'collectionGrid',
            selector: 'contract_collection_grid'
        },
        {
            ref: 'receivableGrid',
            selector: 'contract_receivable_grid'
        }
    ],

    init: function() {
        var me = this;
        var tool_tip1 = Ext.create('Ext.tip.ToolTip', {
            autoHide: false,
            closable: true,
            draggable: true,
            title: '联系方式'
        });
        var tool_tip2 = Ext.create('Ext.tip.ToolTip', {
            autoHide: false,
            closable: true,
            draggable: true,
            title: '联系方式'
        });
        var tool_tip3 = Ext.create('Ext.tip.ToolTip', {
            autoHide: false,
            closable: true,
            draggable: true,
            title: '联系方式'
        });
        me.control({
            'contract_grid': {
                afterrender: this.applyFilter,
                selectionchange: this.selectionChange
            },
            'contract_grid button[action=addContract]': {
                click: this.addContract
            },
            'contract_grid button[action=transferContract]': {
                click: this.transferContract
            },
            'contract_transfer_form button[action=save]': {
                click: this.transContractSubmit
            },
            'contract_panel button[isInWorkflow=true]': {
                click: this.workflowSubmit
            },
            'contract_panel button[action=save_as]': {
                click: this.saveAsSubmit
            },
            'contract_panel contract_detail #privilege_container_update_contract_customer_info button[text=确认修改]': {
                click: this.submitCustomerInfo
            },
            'contract_panel contract_detail #privilege_container_update_contract_business_info button[text=确认修改]': {
                click: this.submitBusinessInfo
            },
            'contract_panel contract_detail #privilege_container_update_contract_user_info button[text=确认修改]': {
                click: this.submitUserInfo
            },
            'contract_panel contract_detail tabpanel': {
                tabchange: this.detailTabChange
            },
            'contract_panel contract_detail [name=buyer_customer_id] combo': {
                change: function(combo) {
                    tool_tip1.setTarget(combo.getEl());
                    var selection = me.getGrid().getSelectedItem();
                    if(selection) {
                        var name = selection.get('buyer>name');
                        var phone = selection.get('buyer>phone');
                        var mobile = selection.get('buyer>mobile');
                        tool_tip1.update("<table class='tip-cls'><tr><th>姓名：</th><td>" + name + "</td></tr><tr><th>固定电话：</th><td>" + phone + "</td></tr><tr><th>移动电话：</th><td>" + mobile +"</td></tr></table>");
                    }
                }
            },
            'contract_panel contract_detail [name=end_user_customer_id] combo': {
                change: function(combo) {
                    tool_tip2.setTarget(combo.getEl());
                    var selection = me.getGrid().getSelectedItem();
                    if(selection) {
                        var name = selection.get('end_user>name');
                        var phone = selection.get('end_user>phone');
                        var mobile = selection.get('end_user>mobile');
                        tool_tip2.update("<table class='tip-cls'><tr><th>姓名：</th><td>" + name + "</td></tr><tr><th>固定电话：</th><td>" + phone + "</td></tr><tr><th>移动电话：</th><td>" + mobile +"</td></tr></table>");
                    }
                }
            },
            'contract_panel contract_detail [name=business_contact_id] combo': {
                change: function(combo) {
                    tool_tip3.setTarget(combo.getEl());
                    var selection = me.getGrid().getSelectedItem();
                    if(selection) {
                        var name = selection.get('business_contact>name');
                        var phone = selection.get('business_contact>phone');
                        var mobile = selection.get('business_contact>mobile');
                        tool_tip3.update("<table class='tip-cls'><tr><th>姓名：</th><td>" + name + "</td></tr><tr><th>固定电话：</th><td>" + phone + "</td></tr><tr><th>移动电话：</th><td>" + mobile +"</td></tr></table>");
                    }
                }
            },
            'contract_content #privilege_container_update_contract_content_info button[text=确认修改]': {
                click: this.submitContractInfo
            },
            'contract_item_grid': {
                selectionchange: this.itemSelectionChange/*,
                itemdblclick: this.editContractItem*/
            },
            'contract_item_grid button[action=addContractItem]': {
                click: this.addContractItem
            },
            'contract_item_grid button[action=addDone]': {
                click: this.addDone
            },
            'contract_item_grid button[action=editContractItem]': {
                click: this.editContractItem
            },
            'contract_item_grid button[action=deleteContractItem]': {
                click: this.deleteContractItem
            },
            'contract_item_grid button[action=divideSending]': {
                click: this.divideSending
            },
            'contract_item_grid button[action=editSN]': {
                click: this.editSN
            },
            '[action=batchEditContractItem]>menu': {
                show: this.resetAllSubMenus
            },
            'menuitem[action=quantity] button': {
                click: this.batchEditQuantity
            },
            'menuitem[action=send_status] button': {
                click: this.batchEditSendStatus
            },
            'menuitem[action=check_and_accept_status] button': {
                click: this.batchEditCheckAndAcceptStatus
            },
            'menuitem[action=term]': {
                click: this.batchEditTerm
            },
            'menuitem[action=divide_sending] button': {
                click: this.batchEditDivideSending
            },
            'menuitem[action=expected_leave_factory] datepicker': {
                select: this.batchEditExpectedLeaveFactory
            },
            'menuitem[action=appointed_leave_factory] datepicker': {
                select: this.batchEditAppointedLeaveFactory
            },
            'menuitem[action=actually_leave_factory] datepicker': {
                select: this.batchEditActuallyLeaveFactory
            },
            'menuitem[action=leave_etsc] datepicker': {
                select: this.batchEditLeaveEtsc
            },
            'menuitem[action=reach_customer] datepicker': {
                select: this.batchEditReachCustomer
            },
            'menuitem[action=check_and_accept] datepicker': {
                select: this.batchEditCheckAndAccept
            },
            'collection_panel #privilege_button_contract_change_financial_info': {
                click: this.submitFinancialInfo
            },
            'contract_receivable_grid button[action=addReceivable]': {
                click: this.addReceivable
            },
            'contract_receivable_grid button[action=editReceivable]': {
                click: this.editReceivable
            },
            'contract_receivable_grid button[action=deleteReceivable]': {
                click: this.deleteReceivable
            },
            'contract_receivable_grid': {
                selectionchange: this.receivableSelectionChange/*,
                itemdblclick: this.editReceivable*/
            },
            'contract_collection_grid button[action=addCollection]': {
                click: this.addCollection
            },
            'contract_collection_grid button[action=editCollection]': {
                click: this.editCollection
            },
            'contract_collection_grid button[action=deleteCollection]': {
                click: this.deleteCollection
            },
            'contract_collection_grid': {
                selectionchange: this.collectionSelectionChange/*,
                itemdblclick: this.editCollection*/
            },
            'contract_content amount_with_currency numberfield': {
                change: this.calculateRmbWithAmount
            },
            'contract_content [name=exchange_rate]': {
                change: this.calculateRmbWithExchangeRate
            }
        });
    },

    addContract: function() {
        var me = this;
        load_uniq_controller(me, 'contract.QuoteForm');
        var view = Ext.widget('contract_quote_form').show();
    },

    transferContract: function() {
        Ext.widget('contract_transfer_form').show();
    },

    transContractSubmit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var grid = Ext.ComponentQuery.query('contract_panel contract_grid')[0];
        var selection = grid.getSelectionModel().getSelection();
        var contract_ids = Ext.Array.pluck(Ext.Array.pluck(selection, "data"), "id");
        var contract_ids_str = contract_ids.join("|");

        if(form.form.isValid()) {
            //防双击
            button.disable();

            form.submit({
                url: '/contracts/trans_to',
                params: {
                    contract_ids: contract_ids_str
                },
                submitEmptyText:false,
                success: function(the_form, action){
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('Contracts').load();
                }
            });
        }
    },

    /**
     * 工作流状态下多按钮提交，合并之后的事件
     */
    workflowSubmit: function(button) {
        var me = this;
        switch(button.action) {
            case "update":
                Ext.Ajax.request({
                    url: 'contracts/process_workflow',
                    params: {
                        id: me.getGrid().getSelectedItem().get('id'),
                        event: 'update'
                    },
//                    params: Ext.Object.merge(Ext.ComponentQuery.query('contract_detail')[0].getValues(), {
//                        event: 'update'
//                    }),
                    success: function() {
                        Ext.example.msg('成功', '合同流程已经继续');
                        Ext.getStore('Contracts').load();
                    },
                    failure: function() {

                    }
                });
                break;
            case "audit_agree":
                Ext.Ajax.request({
                    url: 'contracts/process_workflow',
                    params: {
                        id: me.getGrid().getSelectedItem().get('id'),
                        event: 'audit_agree'
                    },
//                    params: Ext.Object.merge(Ext.ComponentQuery.query('contract_detail')[0].getValues(), {
//                        event: 'audit_agree'
//                    }),
                    success: function() {
                        Ext.example.msg('成功', '合同审批已通过');
                        Ext.getStore('Contracts').load();
                    },
                    failure: function() {

                    }
                });
                break;
            case "audit_refuse":
                Ext.Msg.prompt("需要理由", "请输入驳回的理由", function(button, value) {
                    if(button === "ok" && value != "") {
                        Ext.Ajax.request({
                            url: 'contracts/process_workflow',
                            params: {
                                id: me.getGrid().getSelectedItem().get('id'),
                                reason: value,
                                event: 'audit_refuse'
                            },
                            //                    params: Ext.Object.merge(Ext.ComponentQuery.query('contract_detail')[0].getValues(), {
                            //                        event: 'audit_refuse'
                            //                    }),
                            success: function() {
                                Ext.example.msg('成功', '合同审批已驳回');
                                Ext.getStore('Contracts').load();
                            },
                            failure: function() {

                            }
                        });
                    } else {
                        return false;
                    }
                });
                break;
            case "sign":
                Ext.Ajax.request({
                    url: 'contracts/process_workflow',
                    params: {
                        id: me.getGrid().getSelectedItem().get('id'),
                        event: 'sign'
                    },
//                    params: Ext.Object.merge(Ext.ComponentQuery.query('contract_detail')[0].getValues(), {
//                        event: 'audit_refuse'
//                    }),
                    success: function() {
                        Ext.example.msg('成功', '合同已经正式签署');
                        Ext.getStore('Contracts').load();
                    },
                    failure: function() {

                    }
                });
                break;
            case "complete":
                Ext.Ajax.request({
                    url: 'contracts/process_workflow',
                    params: {
                        id: me.getGrid().getSelectedItem().get('id'),
                        event: 'complete'
                    },
//                    params: Ext.Object.merge(Ext.ComponentQuery.query('contract_detail')[0].getValues(), {
//                        event: 'complete'
//                    }),
                    success: function() {
                        Ext.example.msg('成功', '合同已完结');
                        Ext.getStore('Contracts').load();
                    },
                    failure: function() {

                    }
                });
                break;
            case "cancel":
                Ext.Ajax.request({
                    url: 'contracts/process_workflow',
                    params: {
                        id: me.getGrid().getSelectedItem().get('id'),
                        event: 'cancel'
                    },
//                    params: Ext.Object.merge(Ext.ComponentQuery.query('contract_detail')[0].getValues(), {
//                        event: 'cancel'
//                    }),
                    success: function() {
                        Ext.example.msg('成功', '合同已取消');
                        Ext.getStore('Contracts').load();
                    },
                    failure: function() {

                    }
                });
                break;
            default:
                break;
        }
    },

    saveAsSubmit: function() {
        var me = this;
        Ext.Ajax.request({
            url: 'contracts/save_as',
            params: {
                id: me.getGrid().getSelectedItem().get('id')
            },
            success: function() {
                Ext.example.msg('成功', '合同审批已通过');
                Ext.getStore('Contracts').load();
            },
            failure: function() {

            }
        });
    },

    submitCustomerInfo: function(button) {
        var me = this;
        var record = me.getGrid().getSelectedItem();
        var customer_unit_field = button.up('fieldset').down('[name=customer_unit_id] combo', false);
        var buyer_customer_field = button.up('fieldset').down('[name=buyer_customer_id] combo', false);
        var end_user_customer_field = button.up('fieldset').down('[name=end_user_customer_id] combo', false);
        Ext.Ajax.request({
            url: 'contracts/update_customer_info',
            params: {
                id: record.get('id'),
                customer_unit_id: customer_unit_field.getValue(),
                buyer_customer_id: buyer_customer_field.getValue(),
                end_user_customer_id: end_user_customer_field.getValue()
            },
            success: function(response) {
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);
                var grid = Ext.ComponentQuery.query('grid[title=合同列表]')[0];
                var last_selected = grid.getSelectedItem();
                grid.getStore().load({
                    callback: function() {
                        var rowIndex = this.find('id', last_selected.getId(), 0, false, false, true);
                        grid.getView().select(rowIndex);
                    }
                });
            },
            failure: function() {
                Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
            }
        });
    },

    submitBusinessInfo: function(button) {
        var me = this;
        var record = me.getGrid().getSelectedItem();
        var business_unit_field = button.up('fieldset').down('[name=business_unit_id] combo', false);
        var business_contact_field = button.up('fieldset').down('[name=business_contact_id] combo', false);
        Ext.Ajax.request({
            url: 'contracts/update_business_info',
            params: {
                id: record.get('id'),
                business_unit_id: business_unit_field.getValue(),
                business_contact_id: business_contact_field.getValue()
            },
            success: function(response) {
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);
                var grid = Ext.ComponentQuery.query('grid[title=合同列表]')[0];
                var last_selected = grid.getSelectedItem();
                grid.getStore().load({
                    callback: function() {
                        var rowIndex = this.find('id', last_selected.getId(), 0, false, false, true);
                        grid.getView().select(rowIndex);
                    }
                });
            },
            failure: function() {
                Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
            }
        });
    },

    submitUserInfo: function(button) {
        var me = this;
        var record = me.getGrid().getSelectedItem();
        var our_company_field = button.up('fieldset').down('[name=our_company_id]', false);
        var user_field = button.up('fieldset').down('[name=signer_user_id]', false);
        Ext.Ajax.request({
            url: 'contracts/update_user_info',
            params: {
                id: record.get('id'),
                our_company_id: our_company_field.getValue(),
                signer_user_id: user_field.getValue()
            },
            success: function(response) {
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);
                var grid = Ext.ComponentQuery.query('grid[title=合同列表]')[0];
                var last_selected = grid.getSelectedItem();
                grid.getStore().load({
                    callback: function() {
                        var rowIndex = this.find('id', last_selected.getId(), 0, false, false, true);
                        grid.getView().select(rowIndex);
                    }
                });
            },
            failure: function() {
                Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
            }
        });
    },

    /**
     * 当切换不同标签时，切换下面的“确定”按钮可用与否，因为“合同项”或者“收款”这样的修改是直接在表格内就提交了的
     * @param tabPanel
     * @param newCard
     * @param oldCard
     * @param eOpts
     */
    detailTabChange: function(tabPanel, newCard, oldCard, eOpts) {
//        var button = Ext.ComponentQuery.query('contract_panel button[action=submit]')[0];
//        if(newCard.xtype === "contract_content") {
//            button.setDisabled(false);
//        } else {
//            button.setDisabled(true);
//        }
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

    selectionChange: function(selectionModel, selected, eOpts) {
        var me = this;
        var detail_area = Ext.ComponentQuery.query('contract_panel contract_detail')[0];
        var info_form = detail_area.down('form[name=contract_info]', false);
        var content_form = detail_area.down('contract_content', false);
        var collection_form = detail_area.down('collection_panel', false);

        var currency_field = content_form.down('amount_with_currency combo', false);
        var sum_field = content_form.down('amount_with_currency numberfield', false);

        var btn_transfer = me.getGrid().down('button[action=transferContract]', false);

        var btn_update = Ext.ComponentQuery.query('button#privilege_button_contract_update')[0];
        var btn_audit_agree = Ext.ComponentQuery.query('button#privilege_button_contract_audit_agree')[0];
        var btn_audit_refuse = Ext.ComponentQuery.query('button#privilege_button_contract_audit_refuse')[0];
        var btn_sign = Ext.ComponentQuery.query('button#privilege_button_contract_sign')[0];
        var btn_complete = Ext.ComponentQuery.query('button#privilege_button_contract_complete')[0];
        var btn_cancel = Ext.ComponentQuery.query('button#privilege_button_contract_cancel')[0];
        var btn_save_content_info = Ext.ComponentQuery.query('#privilege_container_update_contract_content_info button[text=确认修改]')[0];
        var btn_save_as = Ext.ComponentQuery.query('contract_panel button[action=save_as]')[0];

        var customer_unit_field = info_form.down('[name=customer_unit_id] combo', false);
        var buyer_customer_field = info_form.down('[name=buyer_customer_id] combo', false);
        var end_user_customer_field = info_form.down('[name=end_user_customer_id] combo', false);
        var business_unit_field = info_form.down('[name=business_unit_id] combo', false);
        var business_contact_field = info_form.down('[name=business_contact_id] combo', false);
        var pay_mode_field = content_form.down('expandable_pay_mode_combo combo', false);
        if(selected.length === 1) {
            info_form.loadRecord(selected[0]);
            content_form.loadRecord(selected[0]);
            collection_form.loadRecord(selected[0]);

            currency_field.setValue(selected[0].get('currency_id'));
            sum_field.setValue(selected[0].get('sum'));

            btn_transfer.enable();

            if(selected[0].get("editable")) {
                //涉及权限的按钮全部hide起来，再根据流程show当前的
                Ext.Array.each(Ext.ComponentQuery.query('contract_panel button[isInWorkflow=true]'), function(item) {
                    item.disable();
                });
                //审批中不能修改
                btn_save_content_info.enable();
                //                console.log(selected[0].get("editable"));
                switch(selected[0].get("state")) {
                    case "a_start":
                        btn_update.enable()
                        btn_cancel.enable();
                        break;
                    case "b_auditing":
                        btn_audit_agree.enable();
                        btn_audit_refuse.enable();
                        btn_cancel.enable();
                        btn_save_content_info.disable();
                        break;
                    case "c_signing":
                        btn_sign.enable();
                        btn_cancel.enable();
                        break;
                    case "d_progressing":
                        btn_complete.enable();
                        btn_cancel.enable();
                        break;
                    case "e_complete":
                        break;
                    case "f_cancelled":
                        break;
                    default:
                        break;
                }
                btn_save_as.enable();
            }

            //给combo做一个假的store以正确显示值
            customer_unit_field.getStore().loadData([
                [selected[0].get('customer_unit>id'), selected[0].get('customer_unit>(name|unit_aliases>unit_alias)')]
            ]);
            customer_unit_field.setValue(selected[0].get('customer_unit>id'));

            buyer_customer_field.getStore().loadData([
                [selected[0].get('buyer_customer_id'), selected[0].get('buyer>name')]
            ]);
            buyer_customer_field.setValue(selected[0].get('buyer_customer_id'));
            buyer_customer_field.getStore().getProxy().setExtraParam('customer_unit_id', selected[0].get('customer_unit>id'));

            end_user_customer_field.getStore().loadData([
                [selected[0].get('end_user_customer_id'), selected[0].get('end_user>name')]
            ]);
            end_user_customer_field.setValue(selected[0].get('end_user_customer_id'));
            end_user_customer_field.getStore().getProxy().setExtraParam('customer_unit_id', selected[0].get('customer_unit>id'));

            if(selected[0].get('business_unit_id') === 0) {
                business_unit_field.getStore().removeAll();
                business_unit_field.setValue("");
            } else {
                business_unit_field.getStore().loadData([
                    [selected[0].get('business_unit_id'), selected[0].get('business_unit>name')]
                ]);
                business_unit_field.setValue(selected[0].get('business_unit_id'));
            }

            if(selected[0].get('business_contact_id') === 0) {
                business_contact_field.getStore().removeAll();
                business_contact_field.setValue("");
            } else {
                business_contact_field.getStore().loadData([
                    [selected[0].get('business_contact_id'), selected[0].get('business_contact>name')]
                ]);
                business_contact_field.setValue(selected[0].get('business_contact_id'));
                business_contact_field.getStore().getProxy().setExtraParam('business_unit_id', selected[0].get('business_unit_id'))
            }

            pay_mode_field.getStore().loadData([
                [selected[0].get('pay_mode_id'), selected[0].get('pay_mode>name')]
            ]);
            pay_mode_field.setValue(selected[0].get('pay_mode_id'));
            pay_mode_field.validate();

            //几个表格store的读取
            Ext.getStore("ContractItems").getProxy().setExtraParam('contract_id', selected[0].get("id"));
            Ext.getStore("ContractItems").load();

            Ext.getStore("Collections").getProxy().setExtraParam('contract_id', selected[0].get("id"));
            Ext.getStore("Collections").load();

            Ext.getStore("Receivables").getProxy().setExtraParam('contract_id', selected[0].get("id"));
            Ext.getStore("Receivables").load();

            Ext.getStore("ContractHistories").getProxy().setExtraParam('contract_id', selected[0].get("id"));
            Ext.getStore("ContractHistories").load();

            //更新进度条
            var sum = Number(selected[0].get('sum'));
            var total_collection = Number(selected[0].get('total_collection'));
            var percentage = (total_collection * 100.0 / sum).toFixed(2);
            Ext.ComponentQuery.query('collection_panel progressbar')[0].updateProgress(total_collection/sum, percentage + "%", true);
        } else {
            Ext.Array.each(Ext.ComponentQuery.query('tooltip[title=联系方式]'), function(item) {
                item.hide();
            });

            info_form.form.reset();
            content_form.form.reset();

            btn_transfer.disable();

            //涉及权限的按钮全部hide起来
            Ext.Array.each(Ext.ComponentQuery.query('contract_panel button[isInWorkflow=true]'), function(item) {
                item.disable();
            });
            btn_save_as.disable();

            buyer_customer_field.getStore().getProxy().setExtraParam('customer_unit_id', null);

            business_contact_field.getStore().getProxy().setExtraParam('business_unit_id', null);

            Ext.getStore("ContractItems").getProxy().setExtraParam('contract_id', null);
            Ext.getStore("ContractItems").removeAll();
            Ext.getStore("Collections").getProxy().setExtraParam('contract_id', null);
            Ext.getStore("Collections").removeAll();
            Ext.getStore("Receivables").getProxy().setExtraParam('contract_id', null);
            Ext.getStore("Receivables").removeAll();
            Ext.getStore("ContractHistories").getProxy().setExtraParam('contract_id', null);
            Ext.getStore("ContractHistories").removeAll();
            //更新进度条
            Ext.ComponentQuery.query('collection_panel progressbar')[0].updateProgress(0, "--", true);
        }
    },

    submitContractInfo:function(button) {
        var me = this;
        var record = me.getGrid().getSelectedItem();
        var form = button.up('form');
        console.log(form.getValues());
//        console.log(Ext.encode(form.getValues()));
//        var our_company_field = button.up('fieldset').down('[name=our_company_id]', false);
//        var user_field = button.up('fieldset').down('[name=signer_user_id]', false);
        Ext.Ajax.request({
            url: 'contracts/update_contract_info',
            params: Ext.Object.merge(form.getValues(), {
                id: record.get('id')
            }),
            success: function(response) {
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);
                var grid = Ext.ComponentQuery.query('grid[title=合同列表]')[0];
                var last_selected = grid.getSelectedItem();
                grid.getStore().load({
                    callback: function() {
                        var rowIndex = this.find('id', last_selected.getId(), 0, false, false, true);
                        grid.getView().select(rowIndex);
                    }
                });
            },
            failure: function() {
                Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
            }
        });
    },

    itemSelectionChange: function(selectionModel, selected, eOpts) {
        var grid = this.getItemGrid();
        var edit_btn = grid.down("[action=editContractItem]");
        var delete_btn = grid.down("[action=deleteContractItem]");
        var divide_btn = grid.down("[action=divideSending]");
        var batch_edit_btn = grid.down("[action=batchEditContractItem]");
        var edit_sn_btn = grid.down("[action=editSN]");

        //多于一个时“批量修改”才可用
        batch_edit_btn.setDisabled(selected.length <= 1);
        //只选中一个时“修改”、“分批发货”、“修改序列号”可用
        edit_btn.setDisabled(selected.length != 1);
        divide_btn.setDisabled(selected.length != 1);
        edit_sn_btn.setDisabled(selected.length != 1);
        //有选中时“删除”可用
        delete_btn.setDisabled(selected.length === 0);
    },

    addContractItem: function() {
        var me = this;
        load_uniq_controller(me, 'contract.ItemForm');
        var view = Ext.widget('contract_item_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.show();
        btn_update.hide();
        //给combo做一个假的store以正确显示值
        var warranty_field = view.down('combo[name=warranty_term_id]', false);
        warranty_field.getStore().loadData([{id: 2, name: '从出厂起12个月'}]);
        warranty_field.setValue(2);
    },

    addDone: function() {
        var me = this;
        var contract_item_ids = Ext.Array.pluck(Ext.Array.pluck(me.getItemGrid().getStore().data.items, "data"), "id").join("|");
        console.log(contract_item_ids);
        Ext.Ajax.request({
            url: 'contract_items/validate_to_gen_receivables',
            params: {
                contract_item_ids: contract_item_ids
            },
            success: function(response) {
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);
                Ext.getStore('ContractItems').load();
            },
            failure: function() {
                Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
            }
        });
    },

    editContractItem: function() {
        var me = this;
        load_uniq_controller(me, 'contract.ItemForm');
        var record = me.getItemGrid().getSelectedItem();
        var view = Ext.widget('contract_item_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.hide();
        btn_update.show();
        if(Number(record['data']['send_status'] < 10)) record['data']['send_status'] = "0" + Number(record['data']['send_status']);//字典项超过10项后有点小麻烦
        view.down('form', false).loadRecord(record);

        //给combo做一个假的store以正确显示值
        var vendor_unit_field = view.down('expandable_vendor_unit_combo combo', false);
        var product_field = view.down('expandable_product_combo combo', false);
        var warranty_term_field = view.down('[name=warranty_term_id]', false);
        vendor_unit_field.getStore().loadData([
            [record.get('vendor_unit_id'), record.get('vendor_unit_name')]
        ]);
        vendor_unit_field.setValue(record.get('vendor_unit_id'));

        product_field.getStore().loadData([
            {
                id: record.get('product_id'),
                model: record.get('product>model')
            }
        ]);
        product_field.setValue(record.get('product_id'));
        product_field.getStore().getProxy().setExtraParam('vendor_unit_id', record.get('vendor_unit_id'));

        warranty_term_field.getStore().loadData([
            [record.get('warranty_term_id'), record.get('warranty_term>name')]
        ]);
        warranty_term_field.setValue(record.get('warranty_term_id'));
        warranty_term_field.validate();
    },

    deleteContractItem: function() {
        var me = this;
        Ext.Msg.prompt("需要理由", "请输入修改的理由", function(button, value) {
            if(button === "ok" && value != "") {
                var contract_item_ids = Ext.Array.pluck(Ext.Array.pluck(me.getItemGrid().getSelectedItems(), "data"), "id").join("|");
                Ext.Ajax.request({
                    url: 'contract_items/delete_contract_item',
                    params: {
                        contract_item_ids: contract_item_ids,
                        reason: value
                    },
                    submitEmptyText: false,
                    success: function(response) {
                        var msg = Ext.decode(response.responseText);
                        Ext.example.msg('成功', msg.message);
                        Ext.getStore('ContractItems').load();
                    },
                    failure: function() {
                        Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                    }
                });
            } else {
                return false;
            }
        });
    },

    divideSending: function() {
        var me = this;
        load_uniq_controller(me, 'contract.DivideSendingForm');
        var view = Ext.widget('divide_sending_form').show();
        var record = me.getItemGrid().getSelectedItem();
        view.down('form', false).loadRecord(record);
        //限制分批发货的最大数量为已经选择的项目中的数量-1
        var selection = Ext.ComponentQuery.query('contract_item_grid')[0].getSelectedItems()[0];
        var quantity = selection.get('quantity');
        view.down("numberfield", false).maxValue = quantity - 1;
    },

    editSN: function(button) {
        var grid = button.up('grid');
        var record = grid.getSelectedItem();
        var me = this;
        load_uniq_controller(me, 'contract.ItemSnForm');
//        var record = me.getItemGrid().getSelectedItem();
        var view = Ext.widget('contract_item_sn_form').show();
//        var btn_save = view.down('button[action=save]', false);
//        var btn_update = view.down('button[action=update]', false);
//        btn_save.hide();
//        btn_update.show();
//        if(Number(record['data']['send_status'] < 10)) record['data']['send_status'] = "0" + record['data']['send_status'];//字典项超过10项后有点小麻烦
        view.down('form', false).loadRecord(record);
//        Ext.Msg.prompt("修改序列号", "请输入新的序列号：", function(button, value) {
//            if(button === "ok" && value.split(",").length === record.get('quantity')) {
//                Ext.Ajax.request({
//                    url: 'contract_items/update_serial_number',
//                    params: {
//                        contract_id: Ext.ComponentQuery.query('contract_grid')[0].getSelectedItem().get('id'),
//                        id: record.get('id'),
//                        serial_number: value
//                    },
//                    submitEmptyText: false,
//                    success: function(response) {
//                        var msg = Ext.decode(response.responseText);
//                        Ext.example.msg('成功', msg.message);
//                        Ext.getStore('ContractItems').load();
//                    },
//                    failure: function() {
//                        Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
//                    }
//                });
//            }
//        }, this, false, record.get('serial_number'));
    },

    /**
     * 每次打开的时候重置菜单下的几个框
     * @param panel
     * @param eOpts
     */
    resetAllSubMenus: function(panel, eOpts) {
        panel.down("menuitem[action=quantity] numberfield").reset();
        panel.down("menuitem[action=send_status] combo").reset();
        panel.down("menuitem[action=check_and_accept_status] combo").reset();
        panel.down("menuitem[action=divide_sending] numberfield").reset();
        //限制分批发货的最大数量为已经选择的项目中数量的最小值-1
        //比如选了5 5 10，分批就只能分出4个来，变成1 1 6 4 4 4
        var selections = Ext.ComponentQuery.query('contract_item_grid')[0].getSelectedItems();
        var select_quantities = Ext.Array.pluck(Ext.Array.pluck(selections, "data"), "quantity");
        var max_quantity = Ext.Array.min(select_quantities) - 1;
        panel.down("menuitem[action=divide_sending] numberfield").maxValue = max_quantity;
    },

    /**
     * 批量修改数量的校验及提交
     * @param button
     */
    batchEditQuantity: function(button) {
        var me = this;
        Ext.Msg.prompt("需要理由", "请输入修改的理由", function(btn, value) {
            if(btn === "ok" && value != "") {
                me.unifiedBatchEdit(button, 'numberfield', value);
            }
        });
    },

    /**
     * 批量修改发货状态的校验及提交
     * @param button
     */
    batchEditSendStatus: function(button) {
        var me = this;
        me.unifiedBatchEdit(button, 'combo', null);
    },

    /**
     * 批量修改验收状态的校验及提交
     * @param button
     */
    batchEditCheckAndAcceptStatus: function(button) {
        var me = this;
        me.unifiedBatchEdit(button, 'combo', null);
    },

    /**
     * 批量修改分批发货的校验及提交
     * @param button
     */
    batchEditDivideSending: function(button) {
        var me = this;
        me.unifiedBatchEdit(button, 'numberfield', null);
    },

    /**
     * 批量修改质保条款的校验及提交
     * @param button
     */
    batchEditTerm: function(button) {
        var me = this;
        Ext.create('Ext.window.Window', {
            title: '批量修改质保条款',
            width: 450,
            bodyPadding: 4,
            modal: true,

            items: [
                {
                    xtype: 'form',
                    bodyPadding: 4,
                    layout: 'anchor',
                    fieldDefaults: EIM_field_defaults,
                    items: [
                        {
                            xtype: 'container', //此container其实不用要，但为了和别的提交共用程序
                            layout: 'hbox',
                            items: [
                                {
                                    fieldLabel: '条款',
                                    xtype: 'combo',
                                    store: 'Terms',
                                    mode: 'remote',
                                    vtype: 'term',
                                    valueField: 'id',
                                    displayField: 'name',
                                    emptyText: '请输入并选择质保条款，格式见下面↓',
                                    triggerAction: 'query',
                                    minChars: 1,
                                    hideTrigger: true,
                                    width: 400,
                                    //                                    anchor: '100%',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'hidden',
                                    value: 'warranty_term_id',
                                    hidden: true
                                },
                                {
                                    xtype: 'button',
                                    text: '确定',
                                    handler: function(button) {
                                        me.unifiedBatchEdit(button, 'combo', null);
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: '质保条款格式',
                            labelWidth: 100,
                            value: '从[出厂|发货|到港|到货|客户验收|客户开始使用]起##个[月|小时]<br><span style="color: gray;">#表示数字，中括号表示选择支。</span>'
                        }
                    ]
                }
            ]
        }).show();
    },
    /**
     * 除日期选择器外的几个组件统一的批量提交行为
     * @param button 当前button，不管
     * @param xtype button之前的控件的xtype，用来取要提交的值
     * @params reason 原因，string
     */
    unifiedBatchEdit: function(button, xtype, reason) {
        var menu = button.up('menu');
        var win = button.up('window');
        var field = button.up('container').down(xtype, false);
        var selections = Ext.ComponentQuery.query('contract_item_grid')[0].getSelectedItems();
        var select_ids = Ext.Array.pluck(Ext.Array.pluck(selections, "data"), "id");
        //        console.log(field);
        if(field.isValid()) {
            Ext.Ajax.request({
                url: 'contract_items/batch_edit_contract_item',
                params: {
                    value: field.getValue(),
                    item: button.up().down('hidden', false).getValue(),
                    select_ids: select_ids.join("|"),
                    reason: reason
                },
                success: function(response) {
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('ContractItems').load();
                },
                failure: function() {
                    Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                }
            });
            if(menu) menu.up('menu').hide();
            if(win) win.close();
        }
    },

    batchEditExpectedLeaveFactory: function(picker, date, eOpts) {
        var action = picker.up().id;
        this.unifiedBatchDateEdit(date, action);
    },

    batchEditAppointedLeaveFactory: function(picker, date, eOpts) {
        var action = picker.up().id;
        this.unifiedBatchDateEdit(date, action);
    },

    batchEditActuallyLeaveFactory: function(picker, date, eOpts) {
        var action = picker.up().id;
        this.unifiedBatchDateEdit(date, action);
    },

    batchEditLeaveEtsc: function(picker, date, eOpts) {
        var action = picker.up().id;
        this.unifiedBatchDateEdit(date, action);
    },

    batchEditReachCustomer: function(picker, date, eOpts) {
        var action = picker.up().id;
        this.unifiedBatchDateEdit(date, action);
    },

    batchEditCheckAndAccept: function(picker, date, eOpts) {
        var action = picker.up().id;
        this.unifiedBatchDateEdit(date, action);
    },

    submitFinancialInfo: function(button) {
        var me = this;
        var record = me.getGrid().getSelectedItem();
        var profit_field = button.up('container').down('[name=profit]', false);
        var invoice_field = button.up('container').down('[name=invoice]', false);
        var invoiced_at_field = button.up('container').down('[name=invoiced_at]', false);
        Ext.Ajax.request({
            url: 'contracts/update_financial_info',
            params: {
                id: record.get('id'),
                profit: profit_field.getValue(),
                invoice: invoice_field.getValue(),
                invoiced_at: invoiced_at_field.getValue()
            },
            success: function(response) {
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);
                var grid = Ext.ComponentQuery.query('grid[title=合同列表]')[0];
                var last_selected = grid.getSelectedItem();
                grid.getStore().load({
                    callback: function() {
                        var rowIndex = this.find('id', last_selected.getId(), 0, false, false, true);
                        grid.getView().select(rowIndex);
                    }
                });
            },
            failure: function() {
                Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
            }
        });
    },
    /**
     * 日期选择器统一的批量提交行为
     * @param date 选择的日期
     * @param url 要提交的路径
     */
    unifiedBatchDateEdit: function(date, action) {
        var selections = Ext.ComponentQuery.query('contract_item_grid')[0].getSelectedItems();
        var select_ids = Ext.Array.pluck(Ext.Array.pluck(selections, "data"), "id");
        Ext.Ajax.request({
            url: 'contract_items/batch_edit_contract_item_date',
            params: {
                item: action,
                date: Ext.Date.format(date, 'Y-m-d'),
                select_ids: select_ids.join("|")
            },
            success: function(response) {
                var msg = Ext.decode(response.responseText);
                Ext.example.msg('成功', msg.message);
                Ext.getStore('ContractItems').load();
            },
            failure: function() {
                Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
            }
        });
    },

    /**
     * 应收款的表单
     */
    addReceivable: function() {
        var me = this;
        load_uniq_controller(me, 'contract.ReceivableForm');
        var view = Ext.widget('receivable_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.show();
        btn_update.hide();
    },
    editReceivable: function() {
        var me = this;
        load_uniq_controller(me, 'contract.ReceivableForm');
        var record = me.getReceivableGrid().getSelectedItem();
        var view = Ext.widget('receivable_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.hide();
        btn_update.show();
        view.down('form', false).loadRecord(record);
    },
    deleteReceivable: function() {
        var me = this;
        Ext.Msg.confirm('确认删除', '真的要删除选中的应收款项？', function(button) {
            if(button === 'yes') {
                Ext.Ajax.request({
                    url: 'receivables/delete_receivable',
                    params: {
                        receivable_id: me.getReceivableGrid().getSelectedItem().get('id')/*,
                         reason: value*/
                    },
                    submitEmptyText: false,
                    success: function(response) {
                        var msg = Ext.decode(response.responseText);
                        Ext.example.msg('成功', msg.message);
                        Ext.getStore('Receivables').load();
                    },
                    failure: function() {
                        Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                    }
                });
            }
        });
    },
    receivableSelectionChange: function(selectionModel, selected, eOpts) {
        var grid = this.getReceivableGrid();
        var edit_btn = grid.down("[action=editReceivable]");
        var delete_btn = grid.down("[action=deleteReceivable]");
        edit_btn.setDisabled(selected.length != 1);
        delete_btn.setDisabled(selected.length != 1);
    },

    /**
     * 实收款的表单
     */
    addCollection: function() {
        var me = this;
        load_uniq_controller(me, 'contract.CollectionForm');
        var view = Ext.widget('collection_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.show();
        btn_update.hide();
    },
    editCollection: function() {
        var me = this;
        load_uniq_controller(me, 'contract.CollectionForm');
        var record = me.getCollectionGrid().getSelectedItem();
        var view = Ext.widget('collection_form').show();
        var btn_save = view.down('button[action=save]', false);
        var btn_update = view.down('button[action=update]', false);
        btn_save.hide();
        btn_update.show();
        view.down('form', false).loadRecord(record);
    },
    deleteCollection: function() {
        var me = this;
        Ext.Msg.confirm('确认删除', '真的要删除选中的实收款项？', function(button) {
            if(button === 'yes') {
                Ext.Ajax.request({
                    url: 'collections/delete_collection',
                    params: {
                        collection_id: me.getCollectionGrid().getSelectedItem().get('id')/*,
                         reason: value*/
                    },
                    submitEmptyText: false,
                    success: function(response) {
                        var msg = Ext.decode(response.responseText);
                        Ext.example.msg('成功', msg.message);
                        Ext.getStore('Collections').load();
                        //更新进度条
                        var sum = Number(Ext.ComponentQuery.query('contract_grid')[0].getSelectedItem().get('sum'));
                        var total_collection = Number(msg.total_collection);
                        var percentage = (total_collection * 100.0 / sum).toFixed(2);
                        Ext.ComponentQuery.query('collection_panel progressbar')[0].updateProgress(total_collection/sum, percentage + "%", true);
                    },
                    failure: function() {
                        Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                    }
                });
            }
        });
    },
    collectionSelectionChange: function(selectionModel, selected, eOpts) {
        var grid = this.getCollectionGrid();
        var edit_btn = grid.down("[action=editCollection]");
        var delete_btn = grid.down("[action=deleteCollection]");
        edit_btn.setDisabled(selected.length != 1);
        delete_btn.setDisabled(selected.length != 1);
    },

    /**
     * 当“金额”区域改变时，计算“折合人民币”
     * @param numberfield
     * @param newValue
     */
    calculateRmbWithAmount: function(numberfield, newValue) {
        var form = numberfield.up('form');
        var rmb_field = form.down('[name=rmb]', false);
        var exchange_rate_field = form.down('[name=exchange_rate]', false);

        rmb_field.setValue(this.calculateRmb(newValue, exchange_rate_field.getValue()));
    },
    /**
     *当“当前汇率”区域改变时，计算“折合人民币”
     * @param numberfield
     * @param newValue
     */
    calculateRmbWithExchangeRate: function(numberfield, newValue) {
        var form = numberfield.up('form');
        var rmb_field = form.down('[name=rmb]', false);
        var amount_field = form.down('amount_with_currency numberfield', false);

        rmb_field.setValue(this.calculateRmb(newValue, amount_field.getValue()));
    },
    calculateRmb: function(amount, exchange_rate) {
        return (amount * exchange_rate / 100.00).toFixed(2);
    }
});