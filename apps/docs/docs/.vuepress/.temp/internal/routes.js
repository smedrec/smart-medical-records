export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/docs/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"Home"} }],
  ["/get-started.html", { loader: () => import(/* webpackChunkName: "get-started.html" */"/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/docs/docs/.vuepress/.temp/pages/get-started.html.js"), meta: {"title":"Get Started"} }],
  ["/development/CodeStyleGuidelines.html", { loader: () => import(/* webpackChunkName: "development_CodeStyleGuidelines.html" */"/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/docs/docs/.vuepress/.temp/pages/development/CodeStyleGuidelines.html.js"), meta: {"title":"Code Style Guidelines"} }],
  ["/development/ProjectProgressTracker.html", { loader: () => import(/* webpackChunkName: "development_ProjectProgressTracker.html" */"/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/docs/docs/.vuepress/.temp/pages/development/ProjectProgressTracker.html.js"), meta: {"title":"Project Progress Tracker"} }],
  ["/development/", { loader: () => import(/* webpackChunkName: "development_index.html" */"/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/docs/docs/.vuepress/.temp/pages/development/index.html.js"), meta: {"title":"Development Resources"} }],
  ["/development/SecurityCompliance.html", { loader: () => import(/* webpackChunkName: "development_SecurityCompliance.html" */"/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/docs/docs/.vuepress/.temp/pages/development/SecurityCompliance.html.js"), meta: {"title":"Security Compliance Requirements"} }],
  ["/development/TechnicalDesign.html", { loader: () => import(/* webpackChunkName: "development_TechnicalDesign.html" */"/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/docs/docs/.vuepress/.temp/pages/development/TechnicalDesign.html.js"), meta: {"title":"Technical Design Specification"} }],
  ["/development/TestingStrategy.html", { loader: () => import(/* webpackChunkName: "development_TestingStrategy.html" */"/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/docs/docs/.vuepress/.temp/pages/development/TestingStrategy.html.js"), meta: {"title":"Testing Strategy"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/docs/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
  ["/development/tmp/CODE_STYLE.html", { loader: () => import(/* webpackChunkName: "development_tmp_CODE_STYLE.html" */"/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/docs/docs/.vuepress/.temp/pages/development/tmp/CODE_STYLE.html.js"), meta: {"title":""} }],
  ["/development/tmp/PRD.html", { loader: () => import(/* webpackChunkName: "development_tmp_PRD.html" */"/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/docs/docs/.vuepress/.temp/pages/development/tmp/PRD.html.js"), meta: {"title":"smedrec-app - Product Requirements Document"} }],
  ["/development/tmp/PROGRESS.html", { loader: () => import(/* webpackChunkName: "development_tmp_PROGRESS.html" */"/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/docs/docs/.vuepress/.temp/pages/development/tmp/PROGRESS.html.js"), meta: {"title":"smedrec-app - Project Progress Tracker"} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
