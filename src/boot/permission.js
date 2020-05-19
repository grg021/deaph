import { Loading } from 'quasar'

export default async ({ app, router, Vue }) => {
  router.beforeEach(async (to, from, next) => {
    Loading.show()
    next()
  })

  router.afterEach(() => {
    // finish progress bar
    Loading.hide()
  })
}
