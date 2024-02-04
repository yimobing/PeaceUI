
/**
* Peace UI 
* 一套基于vue开发的前端框架
* Version: 1.10.0
* [适用] Vue 2.0
* Author: Mufeng
* QQ: 1614644937
* Date: 2024.01.23
* Update: 2024.01.25
*/

//————————————————————————————————————————————————
//          下拉控件
//————————————————————————————————————————————————
Vue.component('pea-select', {
    inheritAttrs: false,
    template: `
        <div class="pea-dropdown-area" :ref="ref">
            <input 
                type="text" 
                :value="value"
                :data-id="dataId"
                :title="showInputAlt === false ? '' : value"
                @input="$emit(\'remote-method\', $event.target.value)"
                v-on="inputListeners">
            <div class="pea-dropdown-list">
                <div class="pea-dropdown-going" v-show="visibleGoing">{{loadingText}}</div>
                <div class="pea-dropdown-nodata" v-show="visibleNoData">{{noMatchText}}</div>
                <div class="pea-dropdown-select" v-show="visibleSelect">
                    <ul>
                        <li v-for="(item, index) in remoteSource" @click="onChooseOption({value: item.value, label: item.label})" :title="showOptionAlt === false ? '' : item.label">
                            <span>{{item.label}}</span>
                        </li>
                    </ul>
                </div>
            </div><!--/.pea-dropdown-list-->
        </div><!--/.pea-dropdown-area-->
        `,

    props: {
        // value 输入框值
        ref: {
            type: String,
            default: 'peaDropDownArea',
            required: false
        },
        // 输入框是否显示title属性
        showInputAlt: {
            type: Boolean,
            default: false,
            required: false
        },
        // 下拉项是否显示title属性
        showOptionAlt: {
            type: Boolean,
            default: false,
            required: false
        },
        // 输入框值
        value: {
            type: String,
            default: '',
            required: true
        },
        // remote-source 远程数据源
        remoteSource: {
            type: Array,
            default: [],
            required: true
        },
        // data-id 输入框自定义属性
        dataId: {
            type: String,
            default: '',
            required: false
        },
        // loading-text 远程加载时显示的文字 
        loadingText: {
            type: String,
            default: '数据获取中',
            required: false
        },
        // no-match-text 搜索条件无匹配数据时显示的文字 
        noMatchText: {
            type: String,
            default: '无匹配数据',
            required: false
        },

        // todo: 以下为待实现的功能
        // default-all-option 是否在下拉最前面添加一个默认的下拉项
        defaultAllOption: {
            type: Boolean,
            default: false,
            required: false
        },
        // default-all-label 下拉最前面所添加的默认下拉项显示名称(隐藏值与显示名称相同)
        defaultAllLabel: {
            type: String,
            default: '全部',
            required: false
        }
    },
 
    data() {
        return {
            visibleGoing: false, // 是否显示加载中区域
            visibleNoData: false, // 是否显示无匹配数据区域
            visibleSelect: false // 是否显示下拉区域
        }
    },

    computed: {

        // 让组件使用原生事件时不必加.native，且父级监听器不至于因为组件内元素不支持某个方法(如label不支持focus事件)而失败(不被调用)
        // 参考：https://v2.cn.vuejs.org/v2/guide/components-custom-events.html
        inputListeners: function () {
            var vm = this;
            // `Object.assign` 将所有的对象合并为一个新对象
            return Object.assign({},
                // 我们从父级添加所有的监听器
                this.$listeners,
                // 然后我们添加自定义监听器，
                // 或覆写一些监听器的行为
                {
                    // 这里确保组件配合 `v-model` 的工作
                    // 输入时，原生 on input 事件
                    input: function (event) {
                        let value = event.target.value;
                        // console.log('输入值：', value);
                        vm.visibleGoing = true;
                        vm.visibleNoData = false;
                        vm.visibleSelect = false;
                        vm.$emit('input', value);
                    },
                    // 输入框失焦，原生blur事件
                    blur: function (event) {
                        // console.log('失去焦点了event：', event);
                        // console.log('---------------------');
                    }
                }
            )
        }
    },


    watch: {

        // 得到远程数据时
        remoteSource() { // 当props.remoteSource改变时，触发watch发方法，改变一系列状态
            this.visibleGoing = false;
            this.visibleNoData = false;
            this.visibleSelect = true;
            let arr = this.remoteSource;
            // console.log('远程数据：', arr);
            // console.log('输入框值：', this.value);
            if (arr.length == 0) {
                this.visibleSelect = false;
                this.visibleNoData = true;
                setTimeout(() => {
                    this.visibleNoData = false;
                }, 2000);
            }
            // !!!这里不要改变data，否则会陷入死循环
            // 添加一个默认项“全部”
            // if(arr.length >=1 ){
            //     arr.unshift({
            //         value: '全部',
            //         label: '全部'
            //     });
            // }
            // this.removeSource = arr;
        }
    },


    methods: {

        // 选中值发生变化时触发
        onChooseOption(o) {
            // console.log('选中项val：', o);
            this.visibleSelect = false;
            let val = o.label;
            // this.value = val; // 不能直接修改prop中的value值
            this.$emit('option-change', o); // 触发父组件自定义事件 option-change
            // console.log('下拉后的值：', val);
            // console.log('---------分割线------------');
        },

        // 点击控件以外的区域时关闭控件
        handleHide(e) {
            let drop = this.$refs.peaDropDownArea;
            if (drop && !drop.contains(e.target) && (this.visibleSelect)) {
                this.visibleSelect = false;
            }
            if (drop && !drop.contains(e.target) && (this.visibleGoing)) {
                this.visibleGoing = false;
            }
            if (drop && !drop.contains(e.target) && (this.visibleNoData)) {
                this.visibleNoData = false;
            }
        }
    },
    
    mounted() {
        // 点击页面时
        document.addEventListener('click', this.handleHide, false);
        // 下拉控件位置定位
        let child = this.$refs.peaDropDownArea.children;
        // console.log('child：', child);
        let inputDom = child[0],
            dropDom = child[1];
        let inputWidth = peaceUtil.getElementStyle(inputDom).width.toString(); // .replace(/px/g, '');
        dropDom.style.width = inputWidth;
    }
});



//————————————————————————————————————————————————
//          工具库
//————————————————————————————————————————————————
var peaceUtil = {

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
    }
}