/**
 * 资讯中心页面上的controller
 */
Ext.define('EIM.controller.Infos', {
    extend: 'Ext.app.Controller',

    stores: [
        'dict.OurCompanies',
        'RealExchangeRates'
//        'GridRoles',
//        'FunctionPrivileges',
//        'ElementPrivileges',
//        'DataPrivileges'
    ],
    models: [
        'dict.OurCompany',
        'RealExchangeRate'
//        'GridRole',
//        'FunctionPrivilege',
//        'ElementPrivilege',
//        'DataPrivilege'
    ],

    views: [
        'info.Panel',
        'info.BankInfoGrid',
        'info.RealExchangeRateGrid'
    ],

    refs: [
//        {
//            ref: 'functiongrid',
//            selector: 'privilege_function_grid'
//        },
//        {
//            ref: 'elementgrid',
//            selector: 'privilege_element_grid'
//        },
//        {
//            ref: 'datagrid',
//            selector: 'privilege_data_grid'
//        }
    ],

    init: function() {
        var me = this;
        me.control({
        });
    }
});