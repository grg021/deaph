
const routes = [
  {
    path: '/',
    props: true,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'index',
        path: ':cslug',
        props: true,
        component: () => import('pages/Index.vue')
      },
      {
        name: 'booking',
        path: ':cslug/booking',
        props: true,
        component: () => import('pages/Booking.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
