/**
 * [peuiTreeview]
 * 树型菜单控件
 * @Version: 1.0.0
 * @Author: Mufeng
 * @Date: 2024.12.12
 * @Pubdate: 2024.12.19
 * @官网： https://github.com/yimobing/peaceui
 */
// 区县
; (function (root, factory) {
    if (typeof define === 'function' && define.amd) { // amd
        define(factory);
    } else if (typeof exports === 'object') { // umd
        module.exports = factory();
    } else {
        window.peuiTreeview = factory();
    }
})(this, function () {

    //————————————————————————————————————————————————————————————————
    // 插件构造函数，即对外暴露的函数名，挂载到 window 对象上
    //————————————————————————————————————————————————————————————————
    function peuiTreeview(element, config) {
        if (arguments.length == 0) {
            return new MyPlugin();
        }
        else {
            var elem = element, opts = config;
            if (arguments.length == 1 && typeof element === 'object') {
                elem = '';
                opts = config;
            }
            return new MyPlugin(elem, opts);
        }
    }


    //————————————————————————————————————————————————————————————————
    // 定义一个新的构造函数(私有函数)
    //————————————————————————————————————————————————————————————————
    var MyPlugin = function (elem, opts) {
        var me = this;
        // console.log('this：', this); // 这里的this指向函数本身
        if (arguments.length != 0) {
            me.init(elem, opts);
        }
    };



    // 新的构造函数原型模式定义实例方法，仅内部调用(私有的)
    MyPlugin.prototype = {

        //————————————————————————————————————————————————
        /**
         * 初始化
         * @param {Selector} elem 绑定控件的选择器ID
         * @param {Object} opts 参数
         */
        init: function (elem, opts) {
            // 要实现的功能：
            // 每个菜单前面或后面的复选框按钮，复选框是否禁用、默认是否勾选
            // 每个菜单包含元素：上一级编号、顶级编号、菜单编号、菜单名称、描述文字
            // 每个菜单都有增、删、修改功能，功能可全局控制或分开控制显示或隐藏
            // 每个菜单增、删、修改功能的布局方式（是在... 后面点击显示，还是直接显示在菜单名秒后面)
            // 自定义菜单前面的图标、图标是否显示
            // 自定义菜单前面的图标(比如图文件夹减号、文件夹加号)，图标是否显示
            // 点击菜单收起或下拉，点击菜单是否收起或下拉所有子菜单
            // 菜单具有查找功能

            var me = this;
            me.defaults = {
                theme: "", // 主题，默认空表示线条型(可选)。值： arrow 箭头型, line 线条型虚线, line-solid 线条型实线, line-black 线条型黑实线, line-red 线条型红实线
                nodataTips: "没有任何菜单，请先添加顶级菜单", // 空数据时的提示信息，有默认值(可选)
                data: [], // 数据源，默认空数组(可选)
                fields: { // 自定义数据源字段
                    topid: "", // 顶级菜单编号，默认空(可选)
                    reid: "", // 上级菜单编号，默认空(可选)
                    id: "id", // 菜单编号，默认id(可选)
                    title: "value", // 菜单名称，默认title(可选)
                    subtitle: "subtitle", // 菜单描述比如副标题，默认subtitle(可选)
                    url: "url", // 菜单链接地址，默认url(可选)
                    lock: "lock", // 菜单是否加锁，默认lock(可选)
                    checked: "checked", // 复选框勾选，默认checked(可选)。字段不存在时默认不勾选
                    forbidden: "forbidden" // 复选框禁用，默认forbidden(可选)。字段不存在时默认不禁用
                },
                // 菜单搜索功能(可选) test1
                search: {
                    enable: false, // 是否启用，默认false(可选)
                    placeholder: "输入关键字查找", // 占位符文字，有默认值(可选)
                    showQuery: false, // 是否显示搜索按钮，默认false(可选)。值为false时, 输入框一输入就触发搜索, true 时通过点击按钮触发搜索
                    noDataText: "暂无数据" // 无数据时显示的文字，有默认值(可选)
                },
                showCheckbox: false, // 是否显示复选框，默认false(可选)
                showFolder: true, // 是否显示菜单图标即文件或文件夹图标，默认true(可选)
                treeItemExpandAndCollapse: false, // 树型选项点击时是否展开或收起，默认true(可选)

                // 菜单图标及菜单名称点击回调
                // 返回值e格式：{ topid: "顶级菜单编号", reid: "上一级菜单编号", id: "当前菜单编号", title: "当前菜单名称", subtitle: "当前菜单描述", url: "当前菜单链接地址", lock: "当前菜单是否加锁" }：
                treeItemClickCallback: null, // 树型选项点击时的回调函数，默认null(可选)。返回值为e。
                treeIconClickCallBack: null, // 树型图标点击时的回调函数，默认null(可选)。返回值为e。
                
                // 菜单收起时(可选) test1
                collapse: {
                    limit: "son", // 收起范围，默认son(可选)。值： son 仅收起子级, children 收起所有子孙级
                    callback: null // 回调函数，默认null(可选)。返回值参数e格式：{ label: "菜单名称", id: "菜单编号", preid: "上一级菜单编号", topid: "顶级菜单编号" }
                },
                // 菜单展开时(可选) test1
                expand: {
                    limit: "son", // 收起范围，默认son(可选)。值： son 仅收起子级, children 收起所有子孙级
                    callback: null // 回调函数，默认null(可选)。返回值参数e格式：{ label: "菜单名称", id: "菜单编号", preid: "上一级菜单编号", topid: "顶级菜单编号" }
                },
                // 操作按钮功能(可选)
                operation: {
                    enable: false, // 是否启用
                    mode: "dot", // 显示方式，默认dot(可选)。值： dot 显示三个点元素(点击3个点后再显示操作按钮), direct 直接显示。。 direct 时增删改按钮有问题，会重复触发或无反应 test2

                    // 操作按钮组(可选)
                    // [参数说明] 
                    // click 参数返回值e格式：{ topid: "顶级菜单编号", reid: "上一级菜单编号", id: "当前菜单编号", title: "当前菜单名称", subtitle: "当前菜单描述", url: "当前菜单链接地址", lock: "当前菜单是否加锁"}
                    // complete 参数返回值e格式：{ el*： "el开头的是当前各个节点", topid: "顶级菜单编号", reid: "上一级菜单编号", id: "当前菜单编号", title: "当前菜单名称", "其它表单字段名": "其它表单字段值"}。其中 其它表单字段名及字段值是根据参数formData中的name决定的
                    // formData 是一个数组，表示其它表单字段，数组元素是一个Object对象，Object对象中的属性有：title 输入框文本, type 输入框类型(值input/textarea/checkbox), name 输入框name属性值(name和数据源的字段相同时, value将取自数据源的字段值), must 是否必填, placeholder 占位符, value 输入框值
                    // eg. 
                    // formData: [ 
                    //     { title: "分类描述", type: "input", name: "subtitle", must: true, placeholder: "请填写分类描述", value: "无" },
                    //     { title: "分类地址", type: "textarea", name: "url", must: true, placeholder: "请填写分类地址",value: "无" },
                    //     { title: "加锁", type: "checkbox", name: "lock", must: false, placeholder: "",value: "1" },
                    //     { title: "店铺盘点", type: "input", name: "pandian", must: false, placeholder: "",value: "月底要结算啦" }
                    // ]
                    
                    buttons: [{
                        caption: "添加菜单", // 窗口标题，有默认值(可选)
                        mode: "add", // 按钮类型，即对树型选项的操作方式。值： add 添加, edit 修改, del 删除
                        text: "新增", // 按钮文本，有默认值(可选)
                        formData: [],  // 窗口表单，默认空数组(可选)
                        click: null, // 点击按钮时的回调函数，默认空(可选)。返回值为e。
                        complete: null // 表单填写完成的回调函数，默认空(可选)。返回值为e。
                    }, {
                        caption: "修改菜单", // 窗口标题，有默认值(可选)
                        mode: "edit", // 按钮类型，即对树型选项的操作方式。值： add 添加, edit 修改, del 删除
                        text: "修改", // 按钮文本，有默认值(可选)
                        formData: [], // 窗口表单，默认空数组(可选)
                        click: null, // 点击按钮时的回调函数，默认空(可选)。返回值为e。
                        complete: null // 表单填写完成的回调函数，默认空(可选)。返回值为e。
                    }, {
                        mode: "del", // 按钮类型，即对树型选项的操作方式。值： add 添加, edit 修改, del 删除
                        text: "删除", // 按钮文本，有默认值(可选)
                        callback: null // 点击按钮时的回调函数，默认空(可选)
                    }]
                }


            }
            me.settings = utils.combine(true, me.defaults, opts || {});
            me.settings.elem = elem;
            // 取参数值
            var theme = me.settings.theme,
                dataSource = me.settings.data;

            // 创建节点
            var classIdContainer = elem.toString().replace(/(\#|\.)/g, '');
            var nodeContainer = document.getElementById(classIdContainer) != null ?
                document.getElementById(classIdContainer) :
                document.getElementsByClassName(classIdContainer).length == 0 ? null : document.getElementsByClassName(classIdContainer)[0];
            if (nodeContainer == null) {
                var tips = '绑定的节点' + elem + '不存在，请检查！';
                var errs = tips.toString().replace(/(<br>)/g, '');
                alert(errs);
                console.error(errs);
                return;
            }
            var classnameRoot = 'pea-treeview';
            if (theme == 'arrow') {
                classnameRoot += ' theme-arrow';
            }
            else {
                classnameRoot += ' theme-line';
                if (theme != '' && theme != 'line') classnameRoot += ' theme-' + theme;
            }
            var nodeRoot = document.createElement('div');
            nodeRoot.className = classnameRoot;
            nodeContainer.appendChild(nodeRoot);

            // 全局赋值
            me.$container = nodeContainer;
            me.$nodeRoot = nodeRoot;
            // me.$primaryData = dataSource; // 初始的数据源

            // 循环数据，创建菜单内容
            createTreeView(me, dataSource);
        },



        //————————————————————————————————————————————————
        /**
         * 添加一个顶级菜单
         * @param {Object} oneRowData 新添加的这个顶级菜单数据源(单条)
         */
        addTopMenu: function (oneRowData) {
            var me = this;
            var datasource = Array.isArray(oneRowData) ? oneRowData : [ oneRowData ];
            createTreeView(me, datasource);
        },



        //————————————————————————————————————————————————
        /**
         * 添加一个子菜单
         * @param {HtmlElement} elMenu 新添加的这个子菜单所在父级菜单的Menu节点
         * @param {Object} oneRowData 新添加的这个子菜单数据源(单条)
         */
        addSonMenu: function (elMenu, oneRowData) {
            var me = this;
            var tmpStr = helpers._getOneMenuHtml(me, oneRowData);
            var ulNode = utils.getNextElement(elMenu);
            var liNode = elMenu.parentNode;
            var hitNode = utils.getPrevElement(elMenu);
            var isExistUl = ulNode == null || typeof ulNode == 'undefined' ? false : true;
            if (isExistUl == false) { // 最后一级选项添加选项时
                // tmpStr = '<ul>' + tmpStr + '</ul>';
                // utils.appendHTML(tmpStr, liNode);
                var ulDiv = document.createElement('ul');
                liNode.appendChild(ulDiv);
                utils.appendHTML(tmpStr, ulDiv);
                ulNode = ulDiv;
                
                liNode.classList.remove('last');
                liNode.classList.add('collapsable');
                hitNode.style.setProperty('display', 'block'); 
            }
            else {
                utils.appendHTML(tmpStr, ulNode);
            }
            // console.log('elMenu：', elMenu);
            // console.log('ulNode：', ulNode);
            var newLiNode = ulNode.children[ulNode.children.length - 1];
            // 添加树型菜单展开收起事件
            var $hitNodeList = utils.getChildrenElement(newLiNode, 'treeview__hitarea'), // 伸缩节点
                $menuNodeList = utils.getChildrenElement(newLiNode, 'treeview__menu'); // 名称节点
            treeEventHelper.doneTreeIconClickEvent(me, $hitNodeList);
            treeEventHelper.doneTreeItemClickEvent(me, $menuNodeList);
            // 添加树型菜单操作管理事件
            if (me.settings.operation.enable) {
                var $newOperteList = utils.getChildrenElement(newLiNode, 'treeview__menu_operate'); // 操作节
                // console.log('newLinode：', newLiNode)
                // console.log('newOperateNode：', Array.from($newOperteList));
                treeEventHelper.doneTreeOperationEvent(me, $newOperteList);
            }
        },



        //————————————————————————————————————————————————
        /**
         * 修改一个菜单
         * @param {HtmlElement} elMenu 当前菜单所在父级菜单的Menu节点
         * @param {Object} oneRowData 当前菜单数据源(单条)
         */
        editMenu: function (elMenu, oneRowData) {
            var me = this;
            var hitNode = utils.getPrevElement(elMenu),
                titleNode = utils.getChildrenElement(elMenu, 'tv-menu-title')[0],
                subtitleNode = utils.getChildrenElement(elMenu, 'tv-menu-subtitle')[0];
            // console.log('titleNode：', titleNode);
            // console.log('subtitleNode：', subtitleNode);
            var source = helpers._getFormatData(me, oneRowData);
            // console.log('oneRowData：', oneRowData);
            // console.log('source：', source);
            var title = source["title"],
                subtitle = source["subtitle"],
                url = source["url"],
                lock = source["lock"];
            // 更新界面上的值1
            if(subtitle.toString().replace(/\s/g, '') !== ''){
                subtitleNode.style.display = '';
            }
            titleNode.innerText = title;
            subtitleNode.innerText = subtitle.toString().replace(/\s/g, '') == '' ? '' : '(' + subtitle + ')';
            elMenu.dataset.url = url;
            elMenu.dataset.lock = lock;
            hitNode.dataset.url = url;
            hitNode.dataset.lock = lock;
        },


        /**
         * 删除一个菜单
         * @param {HtmlElement} elMenu 当前菜单所在父级菜单的Menu节点
         */
        deleteMenu: function (elMenu) {
            var me = this;
            var liNode = elMenu.parentNode;
            liNode.remove();
            // 全部删完后，显示没有数据的提示信息
            var nodeRoot = me.$nodeRoot;
            var ulList = utils.getChildElement(nodeRoot, 'ul'),
                ulNode = ulList.length > 0 ? ulList[0] : null; // ul节点
            if (ulNode != null && ulNode.childNodes.length == 0) {
                nodeRoot.innerHTML = '<div class="treeview__nodata">' + me.settings.nodataTips + '</div>';
            }
        },
         

         
        //————————————————————————————————————————————————
        /**
         * 创建/打开模态窗口
         * @param {Object} opts 参数对象
         */
        openModal: function (opts) {
            var originals = {
                caption: "标题", // 窗口标题，有默认值(可选)
                confirmText: "确定", // 确定按钮文本(可选)
                cancelText: "取消", // 取消按钮文本(可选)
                showCancel: true, // 是否显示取消按钮，默认true(可选)
                showClose: true, // 是否显示关闭按钮(打叉图标)，默认true(可选)
                showMask: true, // 是否显示遮罩层，默认true(可选)
                zIndex: 99, // 窗口层级，默认99(可选)
                content: "", // 窗口内容(可选)。支持HTML
                over: null, // 窗口创建完成的回调函数，默认null(可选)
                confirm: null, // 确定按钮回调函数，默认null(可选)
                cancel: null, // 取消按钮回调函数，默认null(可选)
                close: null, // 关闭按钮回调函数，默认null(可选)
            }
            var finals = utils.combine(true, originals, opts || {});
            var modalZindex = isNaN(parseInt(finals.zIndex)) ? originals.zIndex : parseInt(finals.zIndex),
                dialogZindex = parseInt(modalZindex) - 1,
                maskZindex = dialogZindex - 1;
            //
            var modalNode = document.createElement('div');
            modalNode.className = 'pea-modal';
            modalNode.style.zIndex = modalZindex;
            // document.body.appendChild(modalNode);
            utils.appendChild(modalNode, document.body);
            var dialogStyleStr = ' style="z-index: ' + dialogZindex + '"',
                maskStyleStr = ' style="z-index: ' + maskZindex + '"';
            var contentHtml = [
                '<div class="modal__dialog"' + dialogStyleStr + '>',
                    '<div class="modal__dialog_header">',
                        '<div class="modal__dialog_header_title">' + finals.caption + '</div>',
                        !finals.showClose ? '' : '<div class="modal__dialog_header_close"></div>',
                        '</div > ',
                    '<div class="modal__dialog_content">' + finals.content + '</div>',
                    '<div class="modal__dialog_footer">',
                        '<button type="button" class="modal_btn_confirm">' + finals.confirmText + '</button>',
                        !finals.showCancel ? '' : '<button type="button" class="modal_btn_cancel">' + finals.cancelText + '</button>',
                    '</div>',
                '</div> ',
                !finals.showMask ? '' : '<div class="modal__mask"' + maskStyleStr + '></div>'
            ].join('\r\n');
            utils.appendHTML(contentHtml, modalNode);
            // var dialogNode = document.getElementsByClassName('modal__dialog')[0];
            // var width = utils.getElementWidth(dialogNode);
            // console.log('width：', width);
            // 窗口创建完成
            if (finals.over) {
                finals.over();
            }
            // 交互操作
            var $btnCloseList = document.getElementsByClassName('modal__dialog_header_close'),
                $btnConfirmList = document.getElementsByClassName('modal_btn_confirm'),
                $btnCancelList = document.getElementsByClassName('modal_btn_cancel');
            
            // console.log('$btnCloseList', $btnCloseList);
            // console.log('$btnConfirmList', $btnConfirmList);
            // console.log('$btnCancelList', $btnCancelList);

            if ($btnCloseList.length > 0) {
                $btnCloseList[0].addEventListener('click', function () { // 关闭按钮
                    modalNode.remove();
                });
            }
            if ($btnConfirmList.length > 0) { // 确定按钮
                $btnConfirmList[0].addEventListener('click', function () {
                    if (finals.confirm) {
                        finals.confirm();
                    }
                    // modalNode.remove();
                });
            }
            if ($btnCancelList.length > 0) { // 取消按钮
                $btnCancelList[0].addEventListener('click', function () {
                    modalNode.remove();
                });
            }
        },



        //————————————————————————————————————————————————
        /**
         * 关闭模态窗口
         */
        closeModal: function () {
            var $modalList = document.getElementsByClassName('pea-modal');
            Array.from($modalList).forEach(function (node) {
                node.remove();
            });
        },


        
        //————————————————————————————————————————————————
        /**
         * 打开菜单管理模态窗口
         * @param {Object} opts 参数对象
         * @param {Array} formData 窗口表单数组。格式和参数 operation.buttons.formData 相同
         * @param {Function} callback 回调函数(可选)
         */
        openMenuManagerModal: function (opts, formData, callback) {
            var me = this;
            var originals = {
                // 窗口参数
                caption: "窗口标题", // 窗口标题，有默认值(可选)
                mode: "add", // 窗口模式，默认add(可选)。值： add 添加菜单, edit 修改菜单
                // 节点参数
                elLi: null, // li节点
                elMenu: null, // menu节点
                elItem: null, // 选项节点
                elTitle: null, // 标题节点
                elSubtitle: null, // 副标题节点
                // 当前菜单参数
                topid: 0, // 顶级菜单编号，默认0(可选)
                reid: 0, // 上一级菜单编号，默认0(可选)
                id: "", // 当前菜单编号，默认空(可选)
                title: "", // 当前菜单名称，默认空(可选)
                subtitle: "", // 当前菜单描述，默认空(可选)
                url: "", // 当前菜单链接地址，默认空(可选)
                lock: "0" // 当前菜单是否加锁，默认0(可选)
            }
            var finals = utils.combine(true, originals, opts || {});
            //
            var caption = finals.caption,
                mode = finals.mode;
            var elLi = finals.elLi,
                elMenu = finals.elMenu,
                elItem = finals.elItem,
                elTitle = finals.elTitle,
                elSubtitle = finals.elSubtitle;
            var topid = finals.topid,
                reid = finals.reid,
                id = finals.id,
                title = finals.title,
                subtitle = finals.subtitle,
                url = finals.url,
                lock = finals.lock;
            //
            var formHtml = '';
            if (Array.isArray(formData)) {
                formData.forEach(function (row) {
                    var _title = row.title,
                        _name = row.name,
                        _type = row.type,
                        _must = row.must,
                        _placeholder = row.placeholder,
                        _value = row.value;
                    if (mode == 'edit') {
                        if (_name == "title") _value = title;
                        if (_name == "subtitle") _value = subtitle;
                        else if (_name == "url") _value = url;
                        else if (_name == "lock") _value = lock;
                    }
                    var tagStr = '';
                    var checkedStr = '',
                        nameStr = ' name="' + _name + '"',
                        classStr = ' class="i-pe-tree-' + _name + '"',
                        placeStr = ' placeholder="' + _placeholder + '" onfocus="this.placeholder=\'\'" onblur="this.placeholder=\'' + _placeholder + '\'"';;
                    if (_type == 'input') {
                        tagStr = '<input type="text"' + nameStr + classStr + placeStr + 'value="' + _value + '"/>';
                    }
                    else if (_type == 'textarea') {
                        tagStr = '<textarea' + nameStr + classStr + placeStr + '>' + _value + '</textarea>';
                    }
                    else if (_type == 'checkbox') {
                        checkedStr = _value == '1' || _value == 'true' || _value === true ? ' checked' : '';
                        tagStr = '<input type="checkbox"' + nameStr + classStr + checkedStr + '/>';
                    }
                    formHtml += [
                        '<div class="treeview__form_cell">',
                            !_must ? '' : '<div class="treeview__form_cell_must">*</div>',
                            '<div class="treeview__form_cell_label"><label>' + _title + '</label></div>',
                            '<div class="treeview__form_cell_text">' + tagStr + '</div>',
                        '</div>',
                    ].join('\r\n')
                });
            }
            

            var contentHtml = '<div class="treeview__form">' + formHtml + '</div>';
            var nodataClassName = 'emp-no-data';
            me.openModal({
                caption: caption, // 窗口标题，有默认值(可选)
                confirmText: "确定", // 确定按钮文本(可选)
                cancelText: "取消", // 取消按钮文本(可选)
                showCancel: false, // 是否显示取消按钮，默认true(可选)
                showClose: true, // 是否显示关闭按钮(打叉图标)，默认true(可选)
                showMask: true, // 是否显示遮罩层，默认true(可选)
                zIndex: 50, // 窗口层级，默认99(可选)
                content: contentHtml,
                over: function () { // 窗口创建完成的回调函数，默认null(可选)
                    var $cellList = document.getElementsByClassName('treeview__form_cell_text');
                    Array.from($cellList).forEach(function (cellNode) {
                        var $inputNode = utils.getChildElement(cellNode)[0];
                        var $mustList = utils.getChildElement(cellNode.parentNode, 'treeview__form_cell_must');
                        var $mustNode = $mustList.length == 0 ? null : $mustList[0];
                        if ($mustNode != null) {
                            $inputNode.addEventListener('input', function (e) {
                                if (e.target.value.toString().replace(/\s+/g, '') !== '') {
                                    e.target.classList.remove(nodataClassName);
                                }
                                else {
                                    e.target.classList.add(nodataClassName);
                                }
                            })
                        }
                    });
                }, 
                confirm: function () {
                    // console.log('ccc'); 
                    var backObj = {
                        elLi: elLi,
                        elMenu: elMenu,
                        elItem: elItem,
                        elTitle: elTitle,
                        elSubtitle: elSubtitle,
                        topid: topid,
                        reid: reid,
                        id: id
                    }
                    var newVal = title;
                    var $cellList = document.getElementsByClassName('treeview__form_cell_text');
                    Array.from($cellList).forEach(function (cellNode) {
                        var $inputNode = utils.getChildElement(cellNode)[0];
                        var $mustList = utils.getChildElement(cellNode.parentNode, 'treeview__form_cell_must');
                        var $mustNode = $mustList.length == 0 ? null : $mustList[0];
                        var inputType = $inputNode.getAttribute('type'),
                            inputName = $inputNode.getAttribute('name');
                        newVal = inputType == 'checkbox' ? ($inputNode.checked ? 1 : 0) : $inputNode.value;
                        backObj[inputName] = newVal;
                        // console.log('输入框节点：', $inputNode);
                        // console.log('输入框值：', newVal);
                        if ($mustNode != null) {
                            if (newVal.toString().replace(/\s+/g, '') == '') {
                                $inputNode.classList.add(nodataClassName);
                            }
                            else {
                                $inputNode.classList.remove(nodataClassName);
                            }
                        }
                    });
                    // console.log('backObj：', backObj);
                    if (callback) {
                        callback(backObj);
                    }
                }
            });
        }
         
    };







    //————————————————————————————————————————————————————————————————
    // 函数：创建树型菜单
    //————————————————————————————————————————————————————————————————
    /**
     * 创建树型菜单数据源
     * @param {Object} me 当前插件对象
     * @param {Array} datasource 树型菜单数据源，数组类型
     */
    var createTreeView = function (me, datasource) {
        var nodeRoot = me.$nodeRoot;
        if (datasource.length > 0) {
            var treeHtml = '';
            datasource.forEach(function (item, index) {
                treeHtml += helpers._getOneMenuHtml(me, item);
            });
            var ulList = utils.getChildElement(nodeRoot, 'ul'),
                ulNode = ulList.length > 0 ? ulList[0] : null; // ul节点
            // console.log('$ulNode：', $ulNode);
            // 新增顶级菜单时
            if (ulNode != null) {
                // console.log('子丑aaa');
                utils.appendHTML(treeHtml, ulNode);
                var newLiNode = ulNode.children[ulNode.children.length - 1]; // li节点
                // console.log('newLiNode:', newLiNode);
                // 添加树型菜单展开收起事件
                var $hitNodeList = utils.getChildrenElement(newLiNode, 'treeview__hitarea'), // 伸缩节点
                    $menuNodeList = utils.getChildrenElement(newLiNode, 'treeview__menu'); // 名称节点
                treeEventHelper.doneTreeIconClickEvent(me, $hitNodeList);
                treeEventHelper.doneTreeItemClickEvent(me, $menuNodeList);
                // 添加树型菜单操作管理事件
                if (me.settings.operation.enable) {
                    var $newOperteList = utils.getChildrenElement(newLiNode, 'treeview__menu_operate'); // 操作节点
                    // console.log('newOperateNode：', $newOperteList);
                    treeEventHelper.doneTreeOperationEvent(me, $newOperteList);
                }
            }

            // 初始化菜单时
            else {
                // console.log('寅bbb');
                nodeRoot.innerHTML = '';
                var allHtml = '<ul>' + treeHtml + '</ul>';
                utils.appendHTML(allHtml, nodeRoot);
                // 添加树型菜单展开收起事件
                var $hitNodeList = document.getElementsByClassName('treeview__hitarea'), // 伸缩节点
                    $menuNodeList = document.getElementsByClassName('treeview__menu'); // 名称节点
                treeEventHelper.doneTreeIconClickEvent(me, $hitNodeList);
                treeEventHelper.doneTreeItemClickEvent(me, $menuNodeList);
                // 添加树型菜单操作管理事件
                if (me.settings.operation.enable) {
                    var $operateList = document.getElementsByClassName('treeview__menu_operate');
                    treeEventHelper.doneTreeOperationEvent(me, $operateList);
                }
            }
            
        }
        else {
            // 显示没有数据的提示信息
            nodeRoot.innerHTML = '<div class="treeview__nodata">' + me.settings.nodataTips + '</div>';
        }

    };
    




    //————————————————————————————————————————————————————————————————
    // 树型菜单事件帮助库
    //————————————————————————————————————————————————————————————————
    var treeEventHelper = {

        //————————————————————————————————————————————————
        /**
         * 树型图标点击事件，点击菜单图标
         * @param {Object} me 当前插件对象
         * @param {HtmlElement} currentNode 当前点击的节点
         * @param {String} method 菜单收起展开的作用域
         */
        doneTreeIconClickEvent: function (me, currentNode, method) {
            var _this = this;
            Array.from(currentNode).forEach(function (oneNode) {
                oneNode.addEventListener('click', function () {
                    _this.fnTreeSlideUpDown(oneNode);
                    if (me.settings.treeIconClickCallBack) {
                        var menuNode = utils.getNextElement(oneNode);
                        var treeItemNode = utils.getChildElement(menuNode, 'treeview__menu_item')[0],
                            titleNode = utils.getChildElement(treeItemNode, 'tv-menu-title')[0],
                            subtitleList = utils.getChildElement(treeItemNode, 'tv-menu-subtitle');
                        var subtitleNode = subtitleList.length == 0 ? null : subtitleList[0];
                        var topid = oneNode.getAttribute('data-topid'),
                            reid = oneNode.getAttribute('data-reid'),
                            id = oneNode.getAttribute('data-id'),
                            title = titleNode.innerText,
                            subtitle = subtitleNode == null ? '' : subtitleNode.innerText,
                            url = oneNode.getAttribute('data-url'),
                            lock = oneNode.getAttribute('data-lock');
                        subtitle = subtitle.toString().replace(/(\(|\))/g, '');
                        // var arr = [topid, reid, reid, id, title, subtitle, url, lock ];
                        // console.log('点击菜单时的数组：', arr);
                        me.settings.treeIconClickCallBack({
                            topid: topid,
                            reid: reid,
                            id: id,
                            title: title,
                            subtitle: subtitle,
                            url: url,
                            lock: lock
                        });
                    }
                });
            });
        },



        /**
         * 树型选项点击事件，点击菜单名称
         * @param {Object} me 当前插件对象
         * @param {HtmlElement} currentNode 当前点击的节点
         */
        doneTreeItemClickEvent: function (me, currentNode) {
            var _this = this;
            Array.from(currentNode).forEach(function (oneNode) {
                var treeItemNode = utils.getChildElement(oneNode, 'treeview__menu_item')[0];
                treeItemNode.addEventListener('click', function () {
                    // console.log('oneNode：', oneNode);
                    if (me.settings.treeItemExpandAndCollapse) {
                        _this.fnTreeSlideUpDown(oneNode);
                    }
                    // 菜单点击回调
                    if (me.settings.treeItemClickCallback) {
                        var titleNode = utils.getChildElement(treeItemNode, 'tv-menu-title')[0],
                            subtitleList = utils.getChildElement(treeItemNode, 'tv-menu-subtitle');
                        var subtitleNode = subtitleList.length == 0 ? null : subtitleList[0];
                        var topid = oneNode.getAttribute('data-topid'),
                            reid = oneNode.getAttribute('data-reid'),
                            id = oneNode.getAttribute('data-id'),
                            title = titleNode.innerText,
                            subtitle = subtitleNode == null ? '' : subtitleNode.innerText,
                            url = oneNode.getAttribute('data-url'),
                            lock = oneNode.getAttribute('data-lock');
                        subtitle = subtitle.toString().replace(/(\(|\))/g, '');
                        // var arr = [topid, reid, reid, id, title, subtitle, url, lock ];
                        // console.log('点击菜单时的数组：', arr);
                        me.settings.treeItemClickCallback({
                            topid: topid,
                            reid: reid,
                            id: id,
                            title: title,
                            subtitle: subtitle,
                            url: url,
                            lock: lock
                        });
                    }
                });
            });
        },



        /**
         * 树型菜单展开收起事件
         * @param {HtmlElement} currentNode 当前点击的节点
         */
        fnTreeSlideUpDown: function(currentNode) {
            // console.log('操作节点：', currentNode);
            var $nowLi = currentNode.parentNode;
            var liClassName = Array.from($nowLi.classList); // 父节点li样式名
            var ulCollection = utils.getAllNextElement(currentNode, 'ul');
            var $childUl = ulCollection.length > 0 ? ulCollection[0] : null; // 子菜单节点ul
            // console.log('子菜单节点：', $childUl);
            // console.log('当前Li节点样式名：', liClassName);
            // 菜单收起展开
            // if (liClassName.includes('collapsable') || liClassName.includes('expandable')) { // 表示并非最后一级菜单时
            if($childUl != null){
                if (liClassName.includes('collapsable')) { // 收起
                    $nowLi.classList.remove('collapsable');
                    $nowLi.classList.add('expandable');
                    $childUl.style.setProperty('display', 'none');
                }
                else { // 展开
                    $nowLi.classList.remove('expandable');
                    $nowLi.classList.add('collapsable');
                    $childUl.style.setProperty('display', 'block');
                }
            }
        },



        //————————————————————————————————————————————————
        /**
         * 树型菜单操作管理按钮点击事件、点击增删改按钮、点击三个点按钮
         * @param {Object} me 当前插件对象
         * @param {Object} operNodeList 指定操作节点List。如果不指定，新增的节点没法操作
         */
        doneTreeOperationEvent: function (me, operNodeList) {
            var _this = this;
            // 先创建增删改浮层，再触发打开增删改窗口
            if (me.settings.operation.mode == '' || me.settings.operation.mode == 'dot') {
                var manageClassName = 'treeview__menu_manage';
                Array.from(operNodeList).forEach(function (node) {
                    node.addEventListener('click', function () {
                        var parentNode = node.parentNode;
                        var selfBrotherNode = utils.getNextElement(node);
                        // console.log('selfBrotherNode：', selfBrotherNode);
                        if (selfBrotherNode != null) {
                            selfBrotherNode.remove();
                            return;
                        }
                        var otherItemNode = document.getElementsByClassName(manageClassName);
                        if (otherItemNode.length != 0) {
                            otherItemNode[0].remove();
                        }
                        // 创建节点
                        var manageNode = document.createElement('div');
                        manageNode.className = 'treeview__menu_handle ' + manageClassName;
                        parentNode.appendChild(manageNode);
                        // 设置位移
                        var offsetTop = utils.getElementTop(node),
                         offsetLeft = utils.getElementLeft(node);
                        // console.log('node：', node);
                        // console.log('距离左侧x：', offsetLeft, '\n距离顶部y：', offsetTop);
                        var top = offsetTop + 20,
                            left = offsetLeft - 42;
                        // console.log('top:', top, 'left:', left);
                        manageNode.style.position = 'fixed';
                        manageNode.style.top = top + 'px';
                        manageNode.style.left = left + 'px';
                        //
                        var operateHtml = helpers._getOperateHtml(me);
                        utils.appendHTML(operateHtml, manageNode);
                        _this.fnTreeItemManage(me);
                    });
                });

                // 点击页面其它地方时，关闭浮动层
                document.addEventListener('click', function (e) {
                    var target = e.target;
                    // console.log('target：', e.target);
                    var floatLayer = document.getElementsByClassName(manageClassName);
                    if (floatLayer.length > 0) {
                        // 使用 closest() 方法检查点击的是否是三个点元素、浮动层或其子元素之一
                        var closeDotNode = target.closest('.treeview__menu_operate');
                        var closeFatherNode = target.closest('.' + manageClassName);
                        // console.log('最接近的祖先1：', closeDotNode);
                        // console.log('最接近的祖先2：', closeFatherNode);
                        // 如果点击的是三个点元素或浮动层则中断掉不操作，否则关闭浮动层
                        if (closeDotNode != null || floatLayer[0].contains(closeFatherNode)) return;
                        floatLayer[0].remove();
                    }
                });
            }

            // 直接打开增删改窗口
            else {
                _this.fnTreeItemManage(me);
            }
        },

        
        /**
         * 树型菜单增删改按钮
         * @param {Object} me 当前插件对象
         */
        fnTreeItemManage: function (me) {
            var $addBtnList = document.getElementsByName('treeManageButton');
            Array.from($addBtnList).forEach(function (node) {
                node.addEventListener('click', function () {
                    // console.log('node：', node); 
                    var btnMode = node.getAttribute('data-mode');
                    var menuNode = node.parentNode.parentNode;
                        liNode = menuNode.parentNode,
                        itemNode = utils.getChildElement(menuNode, 'treeview__menu_item')[0],
                        titleNode = utils.getChildElement(itemNode, 'tv-menu-title')[0];
                    var subtitleList = utils.getChildElement(itemNode, 'tv-menu-subtitle');
                        subtitleNode = subtitleList.length == 0 ? null : subtitleList[0];
                    // console.log('菜单节点：', menuNode); 
                    // console.log('菜单LI节点：', liNode); 
                    // console.log('菜单选项节点：', itemNode);
                    // console.log('菜单名称节点：', titleNode);
                    // console.log('菜单描述节点：', subtitleNode);
                    var topid = menuNode.getAttribute('data-topid'), // 顶级菜单编号
                        reid = menuNode.getAttribute('data-reid'), // 上级菜单编号
                        id = menuNode.getAttribute('data-id'), // 当前菜单编号
                        title = titleNode.innerText, // 当前菜单名称
                        subtitle = subtitleNode == null ? '' : subtitleNode.innerText, // 当前菜单描述
                        url = menuNode.getAttribute('data-url'), // 当前菜单链接地址
                        lock = menuNode.getAttribute('data-lock'); // 当前菜单是否加锁
                    subtitle = subtitle.toString().replace(/(\(|\))/g, '');
                    // var arr = [ topid, reid, id, title, subtitle, url, lock ];
                    // console.log('arr：', arr);

                    // 循环按钮组，找到对应点击的按钮
                    var caption = ''; mode = '', formData = [], btnClickEvent = null, btnCompleteEvent = null;
                    var btnGroupArr = me.settings.operation.buttons;
                    for (var i = 0; i < btnGroupArr.length; i++){
                        var row = btnGroupArr[i];
                        if (btnMode == row.mode) {
                            caption = row.caption;
                            mode = row.mode;
                            formData = row.formData;
                            btnClickEvent = row.click;
                            btnCompleteEvent = row.complete;
                            // console.log('我循环了几次啦');
                            break;
                        }
                    }

                    // console.log('添加或修改按钮');
                    // console.log('-------------');
                    var callObj = {
                        // 节点参数
                        elLi: liNode,
                        elMenu: menuNode,
                        elItem: itemNode,
                        elTitle: titleNode,
                        elSubtitle: subtitleNode,
                        // 当前菜单参数
                        topid: topid,
                        reid: reid,
                        id: id,
                        title: title,
                        subtitle: subtitle,
                        url: url,
                        lock: lock
                    }
                    // 删除按钮回调
                    if (mode == 'del') {
                        if (btnClickEvent) {
                            btnClickEvent(callObj);
                        }
                    }

                    // 新增和修改按钮时打开模态窗口
                    else if (mode == 'add' || mode == 'edit') {
                        var paramObj = {
                            // 窗口参数
                            caption: caption, // 窗口标题，有默认值(可选)
                            mode: mode // 窗口模式，默认add(可选)。值： add 添加菜单, edit 修改菜单
                        }
                        for (var v in callObj) { // 两个对象参数合并在一起
                            paramObj[v] = callObj[v]
                        }
                        
                        me.closeModal(); // 这里可能会有多个模态窗口，先关闭所有一下 test2
                        me.openMenuManagerModal(paramObj,
                            formData,
                            btnCompleteEvent
                        );
                    }

                    
                });
            });
        }

    }; // END treeEventHelper







    //————————————————————————————————————————————————————————————————
    // 帮助库
    //————————————————————————————————————————————————————————————————
    var helpers = {
        
        /**
         * 获取单条标准化的数据源
         * 即：将单条数据源格式化并返回
         * @param {Object} me 当前对象
         * @param {Object} oneRowData 一个菜单的数据源(单条数据)
         * @returns {Object} 返回标准化的数据源
         */
        _getFormatData: function (me, oneRowData) {
            var fieldObj = me.settings.fields;
            var fTopid = fieldObj["topid"],
                fReid = fieldObj["reid"],
                fId = fieldObj["id"],
                fTitle = fieldObj["title"],
                fDescribe = fieldObj["subtitle"],
                fLock = fieldObj["lock"],
                fUrl = fieldObj["url"],
                fChecked = fieldObj["checked"],
                fForbidden = fieldObj["forbidden"];
            // 取值
            var vTopid = oneRowData[fTopid],
                vReid = oneRowData[fReid],
                vId = oneRowData[fId],
                vTitle = oneRowData[fTitle],
                vDescribe = typeof oneRowData[fDescribe] == 'undefined' ? '' : oneRowData[fDescribe],
                vLock = typeof oneRowData[fLock] == 'undefined' ? 0 : (oneRowData[fLock] != '1' && oneRowData[fLock] !== 'true' && oneRowData[fLock] !== true) ? 0 : 1,
                vUrl = typeof oneRowData[fUrl] == 'undefined' ? '' : oneRowData[fUrl],
                vChecked = typeof oneRowData[fChecked] == 'undefined' ? '' : oneRowData[fChecked],
                vForbidden = typeof oneRowData[fForbidden] == 'undefined' ? '' : oneRowData[fForbidden];
            return {
                topid: vTopid,
                reid: vReid,
                id: vId,
                title: vTitle,
                subtitle: vDescribe,
                lock: vLock,
                url: vUrl,
                checked: vChecked,
                forbidden: vForbidden
            }
        },


        /**
         * 获取一个菜单的HTML内容
         * @param {Object} me 当前控件对象
         * @param {Object} oneRowData 一个菜单的数据源
         * @returns 返回HTML字符串
         */
        _getOneMenuHtml: function (me, oneRowData) {
            var _this = this;
            var source = _this._getFormatData(me, oneRowData);
            var topid = source["topid"],
                reid = source["reid"],
                id = source["id"],
                title = source["title"],
                describe = source["subtitle"],
                url = source["url"],
                lock = source["lock"],
                checked = source["checked"],
                forbidden = source["forbidden"];
            var isFobiddenCheckbox = typeof forbidden == 'undefined' ? false : (forbidden === true || forbidden === 'true' ? true : false);
                var isCheckedCheckbox = typeof checked == 'undefined' ? false : (checked === true || checked === 'true' || checked == '1' ? true : false);
            
            var hasChildren = typeof oneRowData.data != 'undefined' && oneRowData.data.length > 0 ? true : false;
            var liClassName = !hasChildren ? 'last' : 'collapsable';
            var liClassStr = liClassName == '' ? '' : ' class="' + liClassName + '"';
            var hidIdStr = ' data-topid="' + topid + '" data-reid="' + reid + '" data-id="' + id + '" data-url="' + url + '" data-lock="' + lock + '"'; // 隐藏值

            var html = [
                '<li' + liClassStr + '>',
                    (function () {
                        var tmpStyle = hasChildren ? '' : ' style="display: none"';
                        var tmpStr = '<div class="treeview__hitarea"' + hidIdStr + tmpStyle + '></div>';
                        return tmpStr;
                    })(),
                    '<div class="treeview__menu"' + hidIdStr + '>',
                        (function () {
                            var tmpStr = '';
                            if (me.settings.showCheckbox) {
                                tmpStr = [
                                    '<div class="treeview__menu_tick">',
                                    (function () {
                                        var checkedStr = !isCheckedCheckbox ? '' : ' checked';
                                        var disabledStr = !isFobiddenCheckbox ? '' : ' disabled';
                                        return '<input type="checkbox"' + checkedStr + disabledStr + ' aria-label="复选框">';
                                    })(),
                                    '</div> ',
                                ].join('\r\n');
                                return tmpStr;
                            }
                        })(),
                        '<div class="treeview__menu_item">',
                            me.settings.showFolder === false ? '' : '<i aria-label="菜单图标"></i>',
                            '<span class="tv-menu-title">' + title + '</span>',
                            (function () {
                                var tmpStyleStr = describe.toString().replace(/\s+/g, '') !== '' ? '' : ' style="display: none"';
                                var tmpText = describe.toString().replace(/\s+/g, '') == '' ? '' : '(' + describe + ')';
                                var tmpStr = '<em class="tv-menu-subtitle"' + tmpStyleStr + '>' + tmpText + '</em>';
                                return tmpStr;
                            })(),
                        '</div>',
                        (function () {
                            var tmpStr = '';
                            if (me.settings.operation.enable) {
                                if (me.settings.operation.mode == '' || me.settings.operation.mode == 'dot') {
                                    tmpStr = '<div class="treeview__menu_operate" title="点击进行管理"></div>';
                                }
                                else {
                                    tmpStr = '<div class="treeview__menu_handle treeview__menu_perform">';
                                    tmpStr += helpers._getOperateHtml(me); 
                                    tmpStr += '</div>';
                                }
                            }
                            return tmpStr;
                        })(), 
                    '</div>',
                    (function () {
                        var tmpStr = '';
                        if (hasChildren) {
                            tmpStr += '<ul>';
                            oneRowData.data.forEach(function (item) {
                                tmpStr += _this._getOneMenuHtml(me, item);
                            });
                            tmpStr += '</ul>';
                        }
                        return tmpStr;
                    })(),
                '</li>'
            ].join('\r\n');
            return html;
        },



        /**
         * 获取操作按钮HTML内容
         * @param {Object} me 当前控件对象
         * @returns {String} 返回HTML字符串
         */
        _getOperateHtml: function (me) {
            var btnArr = me.settings.operation.buttons;
            var tmpHtml = '';
            btnArr.forEach(function (item) {
                var _mode = item.mode,
                    _text = item.text;
                tmpHtml += [
                    '<button type="button" data-mode="' + _mode + '" name="treeManageButton" class="tree_btn tree_btn_' + _mode + '" title="' + _text + '">',
                        '<i class="fa-' + _mode + '"></i>',
                        '<span class="">' + _text + '</span>',
                    '</button > '
                ].join('\r\n')
            });
            return tmpHtml;
        }

    };


    //————————————————————————————————————————————————————————————————
    // 工具库
    //————————————————————————————————————————————————————————————————
    var utils = {
        /**
         * 原生JS合并对象2
         * 即用两个对象来拓展，返回拓展后的新对象
         * @param {Boolean} deep 是否深度合并，默认false
         * @param {Bbject} defs 第1个被合并的对象(可选)
         * @param {Object} opts 第2个被合并的对象(可选)
         * @param {Object} method 其它操作方式(可选)
            参数 method = {
                isToEmptyObject: true, // 是否合并到空对象上
                includePrototype: true, // 是否遍历合并源对象原型链上的属性，默认true
                forEach: function(target, name, sourceItem) {
                    target[name] = sourceItem + 'hello， 自定义每个合并项';
                    return target;
                }
            }
        * @returns {Object} 返回合并后的目标对象
        */
        combine: function (deep, defs, opts, method) {
            var options = {};
            if (typeof deep === 'boolean') options = { isDeep: deep === false ? false : true };
            else options = { isDeep: false }
            if (typeof method === 'object') options = method;

            /**
             * 子函数：合并对象
             * @param {object} options 选项
             * @returns {object} 返回合并后的对象
             * [参考]：https://segmentfault.com/a/1190000011492291
             * [示例]
                // eg1.普通合并(浅合并)
                var target = EXT().merge(data1, data2);
                // eg2. isDeep 选择是否进行深合并。true 深度合并, false 浅合并，默认true
                var target = EXT({ isDeep: false }).merge(data1, data2);
                // eg3. includePrototype：选择是否要遍历对象的原型链，默认为 true
                var target = EXT({ includePrototype: false }).merge(data1, data2);
                // eg4. forEach：对每个合并项进行自定义处理
                var target = EXT({
                    forEach: function(target, name, sourceItem) {
                        target[name] = sourceItem + 'hello， 自定义每个合并项';
                        return target;
                    }
                }).merge(data1, data2);
            */
            function EXT(options) {
                return new EXT.prototype.init(options);
            };
            EXT.fn = EXT.prototype = {
                type: function (o) {
                    return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
                },
                typeMap: {
                    object: function () {
                        return {};
                    },
                    array: function () {
                        return [];
                    }
                },
                // 默认配置项
                defaults: {
                    isDeep: true, // 是否深合并，默认true
                    isToEmptyObject: true, // 是否合并到空对象上
                    includePrototype: true, // 是否遍历合并源对象原型链上的属性，默认true
                    forEach: function (target, name, sourceItem) { // 用于对每个合并项进行自定义修正
                        target[name] = sourceItem;
                        return target;
                    }
                },
                // 将配置项合并到默认配置项
                init: function (options) {
                    for (var name in options) {
                        this.defaults[name] = options[name];
                    }
                    return this;
                },
                merge: function () {
                    var self = this,
                        _default = self.defaults,
                        i = 1,
                        length = arguments.length,
                        // 根据是否全并到空对象{}中，决定对象采取”引用”还是“只赋值不引用”的方式
                        // config = arguments[0] || {},
                        config = _default.isToEmptyObject ? JSON.parse(JSON.stringify(arguments[0] || {})) : arguments[0] || {}, // 默认配置项
                        source,
                        configItem,
                        sourceItem,
                        tiType,
                        siType,
                        clone,
                        name;
                    // console.log('默认配置项defs：', defs, '\n默认配置项config：', config, '\n第1个参数：', arguments[0]);
                    for (; i < length; i++) {
                        // 判断源对象是否为空
                        if ((source = arguments[i]) != null) {
                            for (name in source) {
                                var hasPro = source.hasOwnProperty(name);
                                // 是否遍历源对象的原型链
                                if (hasPro || _default.includePrototype) {
                                    configItem = config[name];
                                    sourceItem = source[name];
                                    tiType = self.type(configItem);
                                    siType = self.type(sourceItem);
                                    // 防止出现回环
                                    if (config === sourceItem) {
                                        continue;
                                    }
                                    // 如果复制的是对象或者数组
                                    if (_default.isDeep && sourceItem != null && self.typeMap[siType]) {
                                        clone = configItem != null && tiType === siType ? configItem : self.typeMap[siType]();
                                        // 递归
                                        config[name] = self.merge(clone, sourceItem);
                                    } else {
                                        clone = hasPro ? config : config.__proto__;
                                        // 处理每一个合并项
                                        clone = _default.forEach.call(self, clone, name, sourceItem);
                                    }
                                }
                            }
                        }
                    }
                    return config;
                }
            };
            EXT.fn.init.prototype = EXT.fn;

            // 调用并返回结果
            return EXT(options).merge(defs, opts);
        },


        /**
         * 原生js在已存在的节点后面插入新节点(兼容ie9-)
         * @param {HTML DOM} newNode 新节点
         * @param {HTML DOM} existingNode 已存在的节点
         */
        insertAfter: function(newNode, existingNode) {
            var parent = existingNode.parentNode;
            // 最后一个子节点 lastElementChild兼容其他浏览器 lastChild  兼容ie678;
            var lastNode = parent.lastElementChild || parent.lastChild;
            // 兄弟节点同样也是有兼容性
            var siblingNode = existingNode.nextElementSibling || existingNode.nextSibling;
            if (lastNode == existingNode) // 先判断目标节点是不是父级的最后一个节点，如果是的话，直接给父级加子节点就好
            { 
                parent.appendChild(newNode);
            }
            else // 不是最好后一个节点  那么插入到目标元素的下一个兄弟节点之前（就相当于目标元素的insertafter）
            { 
                parent.insertBefore(newNode, siblingNode);
            }
        },


        /**
         * 重定义并优化原生的 Node.appendChild 方法
         * 向父节点中添加子节点，并将子节点插入到父节点内部的最后面，但在script/style节点前面
         * add 20241022-1
         * @param {HTML DOM} newNode childNode 子节点
         * @param {HTML DOM} fatherNode 父节点
         * add 20240929-1
         */
        appendChild: function (childNode, fatherNode) {
            var childrenNode = fatherNode.children; // 获取父节点的直接子元素
            // 将子节点插入到内部的最后面，但不包括style和script元素
            for (var i = childrenNode.length - 1; i >= 0; i--) { // 循环倒装一下
                if (childrenNode[i].tagName === "STYLE" || childrenNode[i].tagName === "SCRIPT" || childrenNode[i].className === 'controls') {
                    continue; // 跳过style和script元素
                }
                this.insertAfter(childNode, childrenNode[i]);
                break; // 只插入一次，因为新节点会被插入到最后一个style/script元素之前
            }
        },
    

        /**
         * 原生js append字符串
         * 即：向父节点中添加子节点HTML字符串，将把该HTML插入到父节点内部的最后面
         * @param {String} str 子节点字符串
         * @param {HTML DOM} el 父节点
         */
        appendHTML: function(str, el){
            HTMLElement.prototype.appendStr = function(str) {
                var divTemp = document.createElement("div"), nodes = null, 
                    fragment = document.createDocumentFragment(); // 文档片段，一次性append，提高性能
                divTemp.innerHTML = str;
                nodes = divTemp.childNodes;
                for (var i=0, length=nodes.length; i<length; i+=1) {
                    fragment.appendChild(nodes[i].cloneNode(true));
                }
                this.appendChild(fragment);
                // 据说下面这样子世界会更清净
                nodes = null;
                fragment = null;
            }
            el.appendStr(str);
        },


        /**
         * 原生js获取所有子节点或指定子节点元素集合(不含孙子节点) (兼容ie6+) 
         * 注：已排除文本、空格，换行符
         * @param {HTML DOM} o 当前节点
         * @param {String} classOrTagName 指定要找的子节点的样式名或标签名(可选) .eg. 'user', 'input'
         * @returns {NodeList || Array} 返回所有子节点集合(可能为null)，或者某个特定样式名的子节点集合(可能为空数组)
         */
        getChildElement: function(o, classOrTagName){
            if(o == null) return null;
            var children = o.childNodes;
            for (var i = 0; i < children.length; i++) {
                var s = children[i].nodeName,
                    r = children[i].nodeValue;
                if (s == "#comment" || (s == "#text" && /\s/.test(r))) { // 排除注释节点或文本节点或空节点(空或换行)
                    o.removeChild(children[i]);
                }
            }
            var childNodeList = o.childNodes;
            var result = [];
            if (typeof classOrTagName != 'undefined') {
                childNodeList.forEach(function (node) {
                    var classArr = Array.from(node.classList),
                        tagname = node.tagName.toString().toLocaleLowerCase();
                    if (classArr.includes(classOrTagName) || tagname == classOrTagName) {
                        result.push(node);
                    }
                })
            }
            return (typeof classOrTagName == 'undefined') ? childNodeList : result;
        },

        /**
         * 原生js查找特定类名的子孙节点(包含孙子节点) (兼容ie6+)
         * @param {HTML Element} o 当前节点
         * @param {String} classOrTagName 要找的子孙节点的样式名或标签名.eg. 'user', 'input'
         * @returns {Array} 返回找到的子孙节点组成的数组。空数组表示没找到
         */
        getChildrenElement: function (o, classOrTagName) {
            var result = [];
            function search(node) {
                var classArr = Array.from(node.classList),
                    tagname = node.tagName.toString().toLocaleLowerCase();
                if (classArr.includes(classOrTagName) || tagname == classOrTagName) {
                    result.push(node);
                }
                var child = node.children;
                Array.prototype.forEach.call(child, function(element) {
                    search(element);
                });
            }
            search(o);
            return result;
        },


        /**
         * 原生js获取下一个兄弟节点 (兼容ie6+)
         * 注：已排除文本、空格，换行符
         * @param {HTML DOM} o 当前元素对象节点
         * @returns {HTML DOM || null} 返回元素对象或null
         */
        getNextElement: function(o){
            if(o == null) return null;
            var e = o.nextSibling;
            if(e == null){ // 测试节点是否存在，否则返回null
                return null;
            }
            if(e.nodeType == 3){ // 如果元素为文本节点
                var two = this.getNextElement(e);
                if(two != null && two.nodeType == 1)
                    return two;
            }else{
                if(e.nodeType == 1){ // 确认节点为元素节点才返回
                    return e;
                }else{
                    return null;
                }
            }
        },


        /**
         * 原生js获取后面所有的兄弟节点 (兼容ie6+)
         * 注：已排除文本、空格，换行符
         * @param {HTML DOM} o 当前元素对象节点
         * @param {String} classOrTagName 要找的后面的兄弟节点样式名或标签名(可选)。eg. 'user', 'input'
         * @returns {Array} 返回数组，数组中的元素为dom对象
         */
        getAllNextElement: function(o, classOrTagName){
            var arr = [];
            var parent = o.parentNode;
            if(parent == null) return [];
            var index = -1;
            for(var i = 0; i < parent.children.length; i++){
                var child = parent.children[i];
                if(child == o){
                    index = i;
                }else{
                    if (index != -1 && i > index) {
                        if (typeof classOrTagName != 'undefined') {
                            var className = Array.from(child.classList),
                                tagName = child.tagName.toString().toLocaleLowerCase();
                            if (className.includes(classOrTagName) || tagName == classOrTagName) {
                                arr.push(child);
                            }
                        }
                        else {
                            arr.push(child);
                        }
                    }
                }
            }
            return arr;
        },


        /**
         * 原生js获取上一个兄弟节点 (兼容ie6+)
         * 注：已排除文本、空格，换行符
         * @param {HTML DOM} o 当前节点
         * @returns {HTML DOM || null} 返回元素对象或null
         */
        getPrevElement: function(o){
            if(o == null) return null;
            var e = o.previousSibling;
            if(e == null){ // 测试节点是否存在，否则返回null
                return null;
            }
            if(e.nodeType == 3){ // 如果元素为文本节点
                var two = this.getPrevElement(e);
                if(two != null && two.nodeType == 1)
                    return two;
            }else{
                if(e.nodeType == 1){ // 确认节点为元素节点才返回
                    return e;
                }else{
                    return null;
                }
            }
        },


        /**
         * 原生js获取元素style属性
         * [用途]：原生js获取元素margin外边距、内边距padding
         * [注意]：返回值中的各个属性值带单位px
         * 兼容性：兼容IE、火狐、谷歌
         * @param {HTML DOM} o DOM元素。
         * @returns {object} 返回元素的各种css属性组成的数组。
         * [示例]
            var div = document.getElementById("user");
            var style = getElementStyle(div);
            alert(style.marginTop);
        */
        getElementStyle: function(o){
            //  兼容IE和火狐谷歌等的写法
            if (window.getComputedStyle) {
                var style = getComputedStyle(o, null);
            } else {
                style = o.currentStyle; // 兼容IE
            }
            return style;
        },



        /**
         * 原生js获取元素宽度
         * add 20241112-1
         * @param {HTML DOM} o 某个元素
         * @returns 返回该元素的宽度值
         */
        getElementWidth: function(o) {
            if (!o) return 0;
            // 获取元素的宽度，考虑元素可能被隐藏
            var styles = this.getElementStyle(o);
            var w = o.offsetWidth;
            var paddingLeft = parseFloat(styles.paddingLeft);
            var paddingRight = parseFloat(styles.paddingRight);
            var borderLeft = parseFloat(styles.borderLeftWidth);
            var borderRight = parseFloat(styles.borderRightWidth);
            // 如果元素被隐藏，宽度可能为0，此时使用内部尺寸作为参考
            if (w === 0 && !isNaN(paddingLeft) && !isNaN(paddingRight) && !isNaN(borderLeft) && !isNaN(borderRight)) {
                w = o.clientWidth;
                w += isNaN(paddingLeft) ? 0 : paddingLeft;
                w += isNaN(paddingRight) ? 0 : paddingRight;
                w += isNaN(borderLeft) ? 0 : borderLeft;
                w += isNaN(borderRight) ? 0 : borderRight;
            }
            return w;
        },

        
        
        /**
         * 原生js获取元素高度
         * add 20241122-1
         * @param {HTML DOM} o 某个元素
         * @returns 返回该元素的宽度值
         */
        getElementHeight: function(o) {
            if (!o) return 0;
            // 获取元素的宽度，考虑元素可能被隐藏
            var styles = this.getElementStyle(o);
            var h = o.offsetHeight;
            var paddingTop = parseFloat(styles.paddingTop);
            var paddingBottom = parseFloat(styles.paddingBottom);
            var borderTop = parseFloat(styles.borderTopWidth);
            var borderBottom = parseFloat(styles.borderBottomWidth);
            // 如果元素被隐藏，宽度可能为0，此时使用内部尺寸作为参考
            if (h === 0 && !isNaN(paddingTop) && !isNaN(paddingBottom) && !isNaN(borderTop) && !isNaN(borderBottom)) {
                h = o.clientHeight;
                h += isNaN(paddingTop) ? 0 : paddingTop;
                h += isNaN(paddingBottom) ? 0 : paddingBottom;
                h += isNaN(borderTop) ? 0 : borderTop;
                h += isNaN(borderBottom) ? 0 : borderBottom;
            }
            return h;
        },



        /**
         * 原生js获取元素到浏览器顶部的距离，即offsetTop
         * 注：不能直接使用obj.offsetTop，因为它获取的是你绑定元素上边框相对离自己最近且position属性为非static的祖先元素的偏移量
         * @param {HTML DOM} o DOM元素。
         * @returns {number} 返回距离值
         */
        getElementTop: function(o) {
            var actualTop = o.offsetTop;
            var current = o.offsetParent;
            while (current !== null) {
                actualTop += current.offsetTop;
                current = current.offsetParent;
            }
            // 当HTML节点有设置margin值时
            var docStyle = this.getElementStyle(document.documentElement), // HTML节点
                docMarTop = Math.ceil(docStyle.marginTop.toString().replace(/([\px]+)/g, ''));
            actualTop += docMarTop;
            return actualTop;
        },
        
        
        /**
         * 原生js获取元素到浏览器左侧的距离，即offsetLeft
         * 注：不能直接使用obj.offsetLeft，因为它获取的是你绑定元素上边框相对离自己最近且position属性为非static的祖先元素的偏移量
         * @param {HTML DOM} element DOM元素。
         * @returns {number} 返回距离值
         */
        getElementLeft: function(o) {
            var actualLeft = o.offsetLeft;
            var current = o.offsetParent;
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
            // 当HTML节点宽度不是100%时
            var winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var docStyle = this.getElementStyle(document.documentElement), // HTML节点
                docW = parseFloat(docStyle.width.toString().replace(/([\px]+)/g, ''));
            actualLeft += ( window.innerWidth == docW || document.documentElement.clientWidth == docW || document.body.clientWidth == docW ) ? 0 : Math.ceil( (winW - docW) / 2 );
            return actualLeft;
        }
          
    };

    
    // 返回对象
    return peuiTreeview;
});