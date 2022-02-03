import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  target:'static',
  router: {
    base: '/solmeshes/'
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'SolMeshes',
    title: 'SolMeshes - Generative Art Collection',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'SolMeshes is a trilogy of generative art NFT collection project on Solana Universe. Arts are tokenized on Solana Blockchain and stored on Arweave (permaweb).',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'SolMeshes, Solana NFT Collection',
      },
      {
        name: 'msapplication-TileColor',
        content: '#ffffff',
      },
      {
        name: 'msapplication-TileImage',
        content: '/solmeshes/ms-icon-144x144.png',
      },
      {
        name: 'theme-color',
        content: '#ffffff',
      },
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        sizes: '57x57',
        href: '/solmeshes/apple-icon-57x57.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '60x60',
        href: '/solmeshes/apple-icon-60x60.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '72x72',
        href: '/solmeshes/apple-icon-72x72.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '76x76',
        href: '/solmeshes/apple-icon-76x76.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '114x114',
        href: '/solmeshes/apple-icon-114x114.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '120x120',
        href: '/solmeshes/apple-icon-120x120.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '144x144',
        href: '/solmeshes/apple-icon-144x144.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        href: '/solmeshes/apple-icon-152x152.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/solmeshes/apple-icon-180x180.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: '/solmeshes/android-icon-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/solmeshes/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/solmeshes/favicon-96x96.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/solmeshes/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/solmeshes/manifest.json' },
    ],
    script: [
      { src: 'https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.1/svg.min.js' },
      { src: 'https://www.googletagmanager.com/gtag/js?id=G-2LP33PN9SR' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/global.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/ga.js', mode: 'client' },
    { src: '~plugins/gleam.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // '@solana/spl-token',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
