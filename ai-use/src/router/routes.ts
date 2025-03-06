const routes = [
    {
        path: '/',
        name: '/',
        component: () => import('@/layout/index.vue'),
        redirect: 'home',
        children: [
            {
                path: '/home',
                name: '/home',
                component: () => import('@/pages/Home.vue'),
            },
            {
                path: '/test',
                name: '/test',
                component: () => import('@/pages/Test.vue'),
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/Login.vue'),
    }]
export default routes
