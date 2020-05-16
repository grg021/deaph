
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'index',
        path: '',
        component: () => import('pages/Index.vue')
      },
      {
        name: 'retrieve',
        path: 'retrieve',
        component: () => import('pages/Retrieve.vue')
      },
      {
        name: 'verify',
        path: 'verify',
        component: () => import('pages/Verify.vue')
      },
      {
        name: 'booking',
        path: 'booking',
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
