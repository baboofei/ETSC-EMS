/***
 * 别改这个文件了……
 */
Ext.define('EIM.model.Vendor', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'vendor_unit>id',
        type: 'int'
    }, {
        name: 'vendor_unit>(name|unit_aliases>unit_alias)',
        type: 'string'
    }, {
        name: 'department',
        type: 'string'
    }, {
        name: 'position',
        type: 'string'
    }, {
        name: 'phone',
        type: 'string'
    }, {
        name: 'mobile',
        type: 'string'
    }, {
        name: 'fax',
        type: 'string'
    }, {
        name: 'email',
        type: 'string'
    }, {
        name: 'comment',
        type: 'string'
    }]
});