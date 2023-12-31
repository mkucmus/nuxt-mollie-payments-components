import {
  defineNuxtModule,
  addPlugin,
  addImports,
  createResolver,
  addComponent,
} from "@nuxt/kit";

import type { MollieOptions } from "./types";
import { resolveOwnDependency } from "./utils";

export default defineNuxtModule<MollieOptions>({
  meta: {
    name: "mollie",
    configKey: "mollie",
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.public.mollie ||= options;

    addPlugin({
      src: resolver.resolve("./runtime/plugins/plugin.server"),
      mode: "server",
    });
    addPlugin({
      src: resolver.resolve("./runtime/plugins/plugin.client"),
      mode: "client",
    });

    addComponent({
      name: "MollieCreditCardComponent",
      filePath: resolver.resolve(
        "./runtime/components/MollieCreditCardComponent.vue"
      ),
    });
    addImports([
      {
        name: "useMollieCreditCard",
        as: "useMollieCreditCard",
        from: resolver.resolve("./runtime/composables/useMollieCreditCard"),
      },
      {
        name: "useMollie",
        as: "useMollie",
        from: resolver.resolve("./runtime/composables/useMollie"),
      },
    ]);

    const composablesDependency = await resolveOwnDependency(
      "@shopware-pwa/composables-next",
      nuxt
    );
    if (composablesDependency) {
      nuxt.options.alias["@shopware-pwa/composables-next"] =
        composablesDependency;

      addComponent({
        name: "ShopwareFrontendsCreditCard",
        filePath: resolver.resolve(
          "./runtime/components/ShopwareFrontendsCreditCard.vue"
        ),
      });
    } else {
      console.warn(
        "@shopware-pwa/composables-next or @shopware-pwa/nuxt3-module package is missing. ShopwareFrontendsCreditCard component was not registered."
      );
    }

    const i18nModuleDependency = await resolveOwnDependency("@nuxt/i18n", nuxt);
    if (i18nModuleDependency) {
    } else {
      console.warn(
        "@nuxt/i18n module is missing. Default value of locale will be used."
      );
    }
  },
});
