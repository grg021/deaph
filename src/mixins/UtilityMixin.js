import { scroll } from 'quasar'
import moment from 'moment'
const { getScrollTarget, setScrollPosition } = scroll
export const UtilityMixin = {
  methods: {
    scrollToElement (id) {
      const el = document.getElementById(id)
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 200
      setScrollPosition(target, offset, duration)
    },
    dateFormat (d) {
      return moment(d, 'YYYY/MM/DD').format('ddd, MMM D, YYYY')
    }
  }
}
