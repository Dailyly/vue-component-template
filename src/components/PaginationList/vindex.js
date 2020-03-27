import Store from 'store2'
const propsDefault = {
  pageSizes: [10, 20, 30, 50],
  layout: 'total, sizes, prev, pager, next, jumper'
}
const paginationStore = Store.namespace('paginationList')
const paramStore = Store.namespace('paramStore')
export default {
  name: 'PaginationList',
  components: {
  },
  props: {
    pagination: Object,
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '给我一点时间'
    },
    data: Object,
    extraForm: Object,
    getDataList: {
      type: Function,
      required: true
    },
    pageSizeKey: {
      type: String,
      default: 'size'
    },
    curPageKey: {
      type: String,
      default: 'page'
    },
    refresh: Boolean,
    storeKey: String,
    initData: Object,
    createdAutoSend: Boolean,
    remember: Boolean
  },
  data () {
    const storeKey = this.storeKey ? this.storeKey : 'data'
    const data = {
      pageSize: 20,
      curPage: 1
    }
    this.initData && Object.assign(data, this.initData)
    return Object.assign({
      dataStoreKey: storeKey
    }, this.remember && paginationStore.session(storeKey) ? Object.assign({}, data, paginationStore.session(storeKey)) : data)
  },
  created () {
    this.createdAutoSend && this.getInitPageData()
  },
  computed: {
    orderRules () {
      this.curPage = 1
      return this.orderRules
    },
    handlePagination () {
      return Object.assign({}, propsDefault, this.pagination)
    },
    dataList () {
      return (this.data && Array.isArray(this.data.list)) ? this.data.list : []
    },
    dataTotal () {
      return (this.data && this.data.total) ? Number(this.data.total) : 0
    },
    params () {
      return Object.assign({}, { [this.pageSizeKey]: this.pageSize, [this.curPageKey]: this.curPage }, this.extraForm)
    },
    paginationShow () {
      const { remember, curPage, dataTotal } = this
      return (curPage === 1) || !remember || (remember && dataTotal)
    }
  },
  watch: {
    'extraForm': {
      handler: 'handleExtraForm',
      deep: true
    },
    'params': 'sendFetchParam',
    'refresh': 'refreshList'
  },
  methods: {
    /** utils **/
    getInitPageData () {
      return this.remember && paramStore.session(this.dataStoreKey) ? this.getDataList(paramStore.session(this.dataStoreKey)) : this.sendFetchParam()
    },
    /** bussiness **/
    handleExtraForm (oldVal, newVal) {
      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        this.curPage = 1
        this.sort = {}
      }
    },
    sendFetchParam () {
      this.rememberData()
      this.getDataList(this.params)
    },
    refreshList (newVal) {
      if (newVal) {
        this.sendFetchParam()
        this.$emit('update:refresh', false)
      }
    },
    rememberData () {
      const { curPage, pageSize } = this
      paginationStore.session(this.dataStoreKey, { curPage, pageSize })
      paramStore.session(this.dataStoreKey, this.params)
    },
    /** events **/
    handleSizeChange (val) {
      this.pageSize = val
    }

  }
}
