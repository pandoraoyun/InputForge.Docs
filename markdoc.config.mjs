import { component, defineMarkdocConfig } from '@astrojs/markdoc/config';
import starlightMarkdoc from '@astrojs/starlight-markdoc';


export default defineMarkdocConfig({
  tags: {
    testo: {
       render: component("./src/components/Testo.astro")
    },
    "code-block": {
      render: component("./src/components/Code.astro"),
      attributes: {
        lang: { type: String }
      },
      
    },
    prose: {
        render: component("./src/components/Prose.astro")
      }
  },
  extends: [starlightMarkdoc()],
});