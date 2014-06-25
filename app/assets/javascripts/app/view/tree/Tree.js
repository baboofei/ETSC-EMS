Ext.define('EIM.view.tree.Tree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.functree',
    autoRender: true,
    
    title: '功能列表',
    id: 'function_tree',
    store: 'Functions',
    autoScroll: false,
    scroll: 'vertical',//垂直的视情况出现，水平的始终不出现(因为宽度是10000……)
    rootVisible: false,
    width: 200,
    
    initComponent: function(){
        /**
         * 用来存全局数组的缓存
         * “修改汇率”里的改变提交后，后台存新汇率，同时它变
         * “报价项”和“报价块”窗口打开之前，加载它里的值
         */
        this.allDict = [];
        this.allElement = [];//涉及权限的所有元素
        this.allCurrency = [];
        this.allApplication = [];
        this.allArea = [];
        this.allOurCompany = [];
        this.allMaterialCode = [];
        this.allRole = [];
        this.allUser = [];
        this.allMember = [];
        this.allMemberSales = [];
        this.allBuyer = [];
        this.allBusiness = [];
        this.allSupporter = [];
        this.allExhibition = [];
        this.recentExhibition = [];

        //临时存“批量推荐产品”的object，不能存文本
        this.tempBatchProduct = {};
        //临时存“维修水单”二次提交的数据
        this.serviceLogCache = [];

        this.callParent(arguments);
    }
});