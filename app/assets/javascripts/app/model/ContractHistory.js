/**
 * 先写这么几个字段测试着
 */
Ext.define('EIM.model.ContractHistory', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'contract_id',
            type: 'int'
        },
        {
            name: 'natural_language',
            type: 'text'
        },
        {
            name: 'reason',
            type: 'string'
        },
        {
            name: 'user_id',
            type: 'int'
        },
        {
            name: 'user>name',
            type: 'string'
        },
        {
            name: 'created_at',
            type: 'date'
        }
    ]
});