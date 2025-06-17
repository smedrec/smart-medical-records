import comp from "/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/docs/docs/.vuepress/.temp/pages/get-started.html.vue"
const data = JSON.parse("{\"path\":\"/get-started.html\",\"title\":\"Get Started\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"Pages\",\"slug\":\"pages\",\"link\":\"#pages\",\"children\":[]},{\"level\":2,\"title\":\"Content\",\"slug\":\"content\",\"link\":\"#content\",\"children\":[]},{\"level\":2,\"title\":\"Configuration\",\"slug\":\"configuration\",\"link\":\"#configuration\",\"children\":[]},{\"level\":2,\"title\":\"Layouts and customization\",\"slug\":\"layouts-and-customization\",\"link\":\"#layouts-and-customization\",\"children\":[]}],\"git\":{\"updatedTime\":1750124292000,\"contributors\":[{\"name\":\"José Cordeiro\",\"username\":\"\",\"email\":\"joseantcordeiro@gmail.com\",\"commits\":1}],\"changelog\":[{\"hash\":\"d672e1fbb5fbdc88f73b19ee7c2bfbecdefc6c0a\",\"time\":1750124292000,\"email\":\"joseantcordeiro@gmail.com\",\"author\":\"José Cordeiro\",\"message\":\"feat: initialize VuePress documentation site with essential configurations and pages\"}]},\"filePathRelative\":\"get-started.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
