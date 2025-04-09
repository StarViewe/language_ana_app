const tab = localStorage.getItem('tab') || '/home/analyse'
export const constantRouter = [
  {
    name: 'login',
    path: '/login',
    component: () => import('../pages/login/LoginPage.vue'),
    meta: { background: 'login-bg' },
  },
  {
    name: 'home',
    path: '/home',
    component: () => import('../pages/home/HomePage.vue'),
    children: [
      {
        name: 'task',
        path: 'task',
        component: () => import('../pages/home/TaskPage.vue'),
      },
      {
        name: 'userinfo',
        path: 'userinfo',
        component: () => import('../pages/home/UserInfoPage.vue'),
      },
      {
        name: 'analyse',
        path: 'analyse',
        component: () => import('../pages/home/AnalysePage.vue'),
      },
      {
        name: 'admin',
        path: 'admin',
        component: () => import('../pages/home/AdminPage.vue'),
      },
    ],
  },
  {
    path: '/',
    redirect: tab,
  },
  {
    name: 'report',
    path: '/report',
    component: () => import('../pages/home/ReportPage.vue'),
  },
  {
    name: 'lexicalAnaPage',
    path: '/lexicalAnaPage',
    component: () => import('../pages/home/LexicalAnaPage.vue'),
  },
  {
    name: 'syntacticAnaPage',
    path: '/syntacticAnaPage',
    component: () => import('../pages/home/SyntacticAnaPage.vue'),
  },
  {
    path: '/_404',
    name: '_404',
    component: () => import('../pages/home/PageNotFound.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Any',
    redirect: '/_404',
  },
]
