import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
export const UtilityMixin = {
  methods: {
    scrollToElement (id) {
      const el = document.getElementById(id)
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 200
      setScrollPosition(target, offset, duration)
    }
  }
}
