/**
 * 左边功能列表上的controller
 */

Ext.define('EIM.controller.Functions', {
    extend:'Ext.app.Controller',

    stores:[
        'Functions',
        'Elements'
    ],
    models: [
        'Element'
    ],

    views:[
        'tree.Tree'
    ],

    init:function () {
        var me = this;
        me.control({
            '[allowPrivilege=true]': {
                beforerender: function(button) {
                    var all_elements = Ext.ComponentQuery.query('functree')[0].allElement['elements'];
                    if(button.tempDisabled === undefined) {
                        //在可用/不可用方面，如果在页面上没有另外定义，则用数据库里的
                        button.setDisabled(all_elements[button.id]['disable']);
                    }else{
                        button.setDisabled(button.tempDisabled);
                    }
                    button.setVisible(!all_elements[button.id]['hidden']);
                },
                beforeshow: function(button) {
                    var all_elements = Ext.ComponentQuery.query('functree')[0].allElement['elements'];
                    if(all_elements[button.id]['hidden']) return false;
                },
                beforehide: function(button) {
                    var all_elements = Ext.ComponentQuery.query('functree')[0].allElement['elements'];
                    if(!all_elements[button.id]['hidden']) return false;
                }
            },
            'functree':{
                /**
                 * 鼠标点击树上节点时打开新标签
                 * @param tree
                 * @param record
                 * @param item
                 * @param index
                 * @param e
                 * @param eOpts
                 */
                itemclick:function (tree, record, item, index, e, eOpts) {
                    var is_node = record["raw"]["leaf"];
                    if (is_node) {
                        // var id = record.get("text");
                        var id = record["raw"]["ext_id"];
                        var innerId = record["raw"]["id"];
                        var controller = record["raw"]["controller"];
                        var title = record.get("text");
                        var icon_class = record.get("iconCls")
                        var tabParent = Ext.getCmp('center');

                        if (tabParent) {
                            if (tabParent.getChildByElement(id)) {
                                tabParent.setActiveTab(id);
                            } else {
                                Ext.getBody().mask("加载中，请稍候……");
                                me.onTabLoad(controller);
                                var newTab = tabParent.add({
                                    id: id,
                                    innerId: innerId,
                                    title: title,
                                    iconCls: icon_class,
                                    closable: true,
                                    //以下两项就用默认的就可以，不用另外设置，但要把tabpanel本身的autoDestroy设置成true
                                    //（其实也就是不用另外设置，用默认的而已）
                                    //autoDestroy: false,
                                    //closeAction: 'hide',
                                    xtype:record["raw"]["widget"]
                                });
                                tabParent.setActiveTab(newTab);
//                                me.getPrivilege(controller);
                                Ext.getBody().unmask();
                            }
                        }
                    }
                }
            }
        });
    },
    /**
     * 每个标签打开之前加载它所要用到的组件controller
     * 以及自定义组件controller
     * @param controller
     */
    onTabLoad:function (controller) {
        var me = this;
        load_uniq_controller(me, controller);
        var ux_controllers_array = [
            "Salecases", "Customers", "CustomerUnits", "Contracts", "Quotes", "Products", "AdminInventories", "PersonalMessages",
            "BusinessContacts", "MaterialCodes", "Vendors", "FlowSheets", "Pops", "Vips", "ExpressSheets"
        ];
        if(Ext.Array.indexOf(ux_controllers_array, controller) != -1) {
            load_uniq_controller(me, 'Etscuxes');
        }

        var express_controllers_array = [
            "Customers", "Salecases", "Vendors", "BusinessContacts", "Pops", "Vips"
        ];
        //“客户管理”、“销售个案管理”、“供应商管理”、“商务相关联系人管理”、“公共联系人管理”、“VIP管理”里要用到打印快递单，没别的地儿加载
        if(Ext.Array.indexOf(express_controllers_array, controller) != -1) {
            load_uniq_controller(me, 'ExpressSheets');
        }
    },
    
    /**
     * 每个标签打开之前请求其中用到的组件的权限
     * @param controller
     */
    getPrivilege: function(controller) {
        switch(controller) {
        case 'Quotes':
            Ext.Ajax.request({
                url:'servlet/QuoteServlet?type=pdfbutton',
                success: function(response) {
                    var text = Ext.decode(response.responseText);
                    var pdf_button = Ext.ComponentQuery.query('quote_panel [action=generate_pdf]')[0];
                    var log_button = Ext.ComponentQuery.query('quote_panel [action=generate_log]')[0];
                    if(text["pdf_button"] === true) {
                        pdf_button.show();
                        log_button.show();
                    }else{
                        pdf_button.hide();
                        log_button.hide();
                    }
                },
                failure: function() {
                    var pdf_button = Ext.ComponentQuery.query('quote_panel [action=generate_pdf]')[0];
                    var log_button = Ext.ComponentQuery.query('quote_panel [action=generate_log]')[0];
                    pdf_button.hide();
                    log_button.hide();
                }
            });
            break
        case '':
            break
        default:
            break
        }
    }
});