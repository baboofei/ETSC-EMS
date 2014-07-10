/**
 * 先写这么几个字段测试着
 */
Ext.define('EIM.model.ContractChart', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'number',
        type: 'string'
    }, {
        name: 'summary',
        type: 'string'
    }, {
        name: 'currency_id',
        type: 'int'
    }, {
        name: 'sum',
        type: 'float'
    }, {
        name: 'rmb',
        type: 'float'
    }, {
        name: 'dealer_name',
        type: 'string'
    }]
});