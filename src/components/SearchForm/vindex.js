import FormItemFields from '../FormItemFields'
import { cloneDeep } from 'lodash'
import Store from 'store2'

const store = Store.namespace('compSearchForm')
export const formDefProps = {
  inline: true,
  size: 'small',
  labelWidth: '80px',
  labelPosition: 'left'
}
const itemDefProps = {}
export default {
  name: 'SearchForm',
  components: {
    FormItemFields
  },
  props: {
    formProps: Object,
    items: {
      type: Array,
      required: true
    },
    dynaData: Object,
    btnText: String,
    sending: Boolean,
    remember: Boolean,
    nskey: String
  },
  data () {
    const nsKey = 'data' + (this.nskey || '')
    return {
      nsKey,
      formData: this.getInitFormData(nsKey)
    }
  },

  computed: {
    handleItems () {
      return Array.isArray(this.items) ? this.items.filter(item => !item.disabled) : []
    },
    formProp () {
      return Object.assign({}, formDefProps, this.formProps)
    }
  },
  watch: {
    '$route.name' () {
      this.formData = this.getInitFormData(this.nsKey)
    }
  },
  methods: {
    /** utils **/
    itemProps (item) {
      return Object.assign({}, itemDefProps, item)
    },
    /** bussiness **/
    // 获取初始表单数据
    getInitFormData (nsKey) {
      return this.remember && store.session(nsKey) ? store.session(nsKey) : {}
    },
    // 输出数据过滤，去掉diabled的数据项
    outFormDataFilter () {
      let result = {}
      this.handleItems.forEach(item => {
        if (item.prop) {
          !item.disabled && (result[item.prop] = this.formData[item.prop])
        } else if (Array.isArray(item.fields)) {
          item.fields.forEach(field => {
            field.prop && !field.disabled && (result[field.prop] = this.formData[field.prop])
          })
        }
      })
      return result
    },
    /** events **/
    // 发送搜索表单数据
    onSearch () {
      const outFormData = this.outFormDataFilter()
      store.session(this.nsKey, cloneDeep(outFormData))
      this.$emit('search', outFormData)
    }
  }
}