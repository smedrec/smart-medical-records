import { GitContributors } from "/home/jose/Documents/workspace/smedrec/smart-medical-records/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-rc.88_typescript@5.8.2_vuepress@2.0.0-rc.20_@vuepress+bundle_9ca4d12363b7f4d190ce860fcbc3b348/node_modules/@vuepress/plugin-git/lib/client/components/GitContributors.js";
import { GitChangelog } from "/home/jose/Documents/workspace/smedrec/smart-medical-records/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-rc.88_typescript@5.8.2_vuepress@2.0.0-rc.20_@vuepress+bundle_9ca4d12363b7f4d190ce860fcbc3b348/node_modules/@vuepress/plugin-git/lib/client/components/GitChangelog.js";

export default {
  enhance: ({ app }) => {
    app.component("GitContributors", GitContributors);
    app.component("GitChangelog", GitChangelog);
  },
};
