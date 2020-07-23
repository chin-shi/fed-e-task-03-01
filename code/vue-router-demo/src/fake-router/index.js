let _Vue = null
export default class VueRouter {
  constructor (options) {
    this.options = options
    this.routeMap = {}
    this.data = _Vue.observable({
      current: '/'
    })
  }

  static install (Vue) {
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    _Vue = Vue
    _Vue.mixin({
      beforeCreate () {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  init () {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }

  createRouteMap () {
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  initComponents (Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      render (h) {
        return h(
          'a',
          {
            attrs: {
              href: this.to
            },
            on: {
              click: this.clickHandle
            }
          },
          [this.$slots.default]
        )
      },
      methods: {
        clickHandle (e) {
          // history.pushState({}, '', this.to)
          window.location.hash = this.to
          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
    })
    const self = this
    Vue.component('router-view', {
      render (h) {
        const compoent = self.routeMap[self.data.current]
        return h(compoent)
      }
    })
  }

  initEvent () {
    window.addEventListener('load', () => {
      window.location.hash = '/'
    })
    window.addEventListener('hashchange', () => {
      this.data.current = window.location.hash.slice(1)
    })
    // history
    // window.addEventListener('popstate', () => {
    //   this.data.current = window.location.pathname
    // })
  }
}
