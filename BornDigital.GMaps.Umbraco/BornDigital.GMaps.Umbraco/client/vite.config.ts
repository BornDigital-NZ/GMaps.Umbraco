import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: {
                "gmaps-editor": "src/gmaps-editor.element.ts",
                "lang/en": "src/lang/en.ts",
                "lang/da": "src/lang/da.ts",
                "lang/de": "src/lang/de.ts",
                "lang/nl": "src/lang/nl.ts",
            },
            formats: ["es"],
            fileName: (_format, entryName) => `${entryName}.js`,
        },
        outDir: "../wwwroot/BornDigital.GMaps",
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            external: [/^@umbraco-cms\/.*/],
        },
    },
    base: "/App_Plugins/BornDigital.GMaps/",
});
