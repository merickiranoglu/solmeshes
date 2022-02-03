<template>
  <v-app dark v-resize="onResize">
    <v-app-bar app>
      <div class="mx-2 pl-4 mt-1" @click="$router.push('/')">
        <a
          ><v-img contain height="32px" width="32px" src="/solmeshes/favicon-96x96.png"> </v-img
        ></a>
      </div>
      <div class="ma-0 pa-0">
        <v-btn
          plain
          :elevation="0"
          class="ma-0 pa-0 appBarBtn"
          @click="$router.push('/')"
        >
          <div class="mr-4" id="smallSvg"></div>
        </v-btn>
      </div>
      <v-spacer></v-spacer>
      <div v-if="!isWindowSmall" class="ma-0 pa-0">
        <v-btn
          plain
          tile
          :elevation="0"
          class="ma-0 px-4 appBarBtn"
          @click="$router.push('/')"
          >Home</v-btn
        ><v-btn
          plain
          tile
          :elevation="0"
          class="ma-0 px-4 appBarBtn"
          @click="$router.push('/about')"
          >About</v-btn
        >
        <v-btn
          plain
          tile
          :elevation="0"
          class="ma-0 px-4 appBarBtn"
          @click="
            $router.push('/collection')
            animateSmallSvg()
          "
          >Collection</v-btn
        >
        <v-btn
          plain
          :elevation="0"
          class="ma-0 px-4 appBarBtn"
          @click="
            $router.push('/attributes')
            animateSmallSvg()
          "
          >Attributes</v-btn
        >
        <v-btn
          plain
          :elevation="0"
          class="ma-0 px-4 appBarBtn"
          @click="
            $router.push('/roadmap')
            animateSmallSvg()
          "
          >Roadmap</v-btn
        >
        <v-btn
          plain
          :elevation="0"
          class="ma-0 px-4 appBarBtn"
          @click="
            $router.push('/faq')
            animateSmallSvg()
          "
          >FAQ</v-btn
        >
      </div>
      <v-spacer></v-spacer>
      <div v-if="isWindowSmall" class="text-center mr-4">
        <v-menu top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              plain
              tile
              :elevation="0"
              icon
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-img contain width="30" height= "30" src="/solmeshes/menu.svg"></v-img>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(btn) in buttons">
              <v-btn
                plain
                tile
                :elevation="0"
                class="ma-0 px-4 appBarBtn"
                @click="$router.push(btn.to)"
                >{{ btn.name }}</v-btn
              >
            </v-list-item>
            <v-list-item>
              <v-btn
                plain
                small
                v-for="externalLinkIcon in $store.state.icons"
                :href="externalLinkIcon.link"
                class="mx-4"
                icon
              >
                <v-icon size="24px">
                  {{ externalLinkIcon.mdiString }}
                </v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div
        v-bind:class="{ connectedWallet: this.$store.state.isWalletConnected }"
        style="display: flex"
        class="mx-2"
      >
        <v-btn
          v-if="!isWindowSmall"
          plain
          :elevation="0"
          class="ml-2 pa-0 appBarBtn"
          @click="$router.push('/selectwallet')"
          style="font-size: 1.35vw"
        >
          <v-img
            v-if="this.$store.state.isWalletConnected"
            contain
            width="13px"
            height="13px"
            src="/solmeshes/solana-logo.svg"
          ></v-img
          ><span class="mr-2" v-if="this.$store.state.isWalletConnected">{{
            this.$store.state.solBalance
          }}</span>
          <v-img
            v-if="this.$store.state.isWalletConnected"
            contain
            width="15px"
            height="15px"
            src="/solmeshes/favicon.ico"
          ></v-img>
          <span class="mr-2" v-if="this.$store.state.isWalletConnected">{{
            this.$store.state.ownedTokenCount
          }}</span>
          <span>{{ this.$store.state.walletStatus }}</span>
        </v-btn>

        <span
          class="mx-2"
          v-if="this.$store.state.isWalletConnected"
          style="width: 25px"
        >
          <v-btn plain elevation="0" class="pb-1" width="25" min-width="25"
            ><v-img
              v-if="this.$store.state.isWalletConnected"
              contain
              width="15px"
              height="15px"
              src="/solmeshes/close-thick.svg"
              @click="disconnectWallet()"
            ></v-img
          ></v-btn>
        </span>
      </div>
    </v-app-bar>
    <v-main style="overflow-x: hidden;">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      bgBlack: {
        backgroundColor: 'black',
        fontFamily: 'Chakra Petch',
      },
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'SolMeshes',
      isWindowSmall: 'false',
      buttons: [
        {
          name: 'Home',
          to: '/',
        },{
          name: 'About',
          to: '/about',
        },
        {
          name: 'Collection',
          to: '/collection',
        },
        {
          name: 'Attributes',
          to: '/attributes',
        },
        {
          name: 'Roadmap',
          to: '/roadmap',
        },
        {
          name: 'FAQ',
          to: '/faq',
        },
      ],
    }
  },
  methods: {
    onResize() {
      this.isWindowSmall = window.innerWidth < 1060
    },
    animateSmallSvg() {
      var width = 210
      var height = 54
      var scale = 1
      var smallSVg = document.getElementById('smallSvg')
      if (smallSvg) {
        smallSvg.innerHTML = ''
      }
      let draw = SVG().addTo('#smallSvg').size(width, height)
      let svgParameters = {
        draw: draw,
        width: 215,
        height: 54,
        scale: 1,
        animateColors: false,
        startColor: 'white',
        outlineWidth: 1,
      }
      this.$store.dispatch('startSolMeshesSvg', svgParameters)
    },
    disconnectWallet() {
      this.$store.dispatch('disconnectWallet')
    },
    connectWalletClicked() {
      if (!this.$store.state.isPhantomInstalled) {
        setTimeout(function () {
          // window.open('https://phantom.app/', '_blank')
        }, 1500)
        return
      }

      if (this.$store.state.isWalletConnected) {
        this.$store.commit('updateisWalletActionRequested', true)
      } else {
        window.solana.connect()
      }
    },
    smClicked() {
      this.$router.push('/')
    },
  },
  computed: {},
  mounted() {
    this.animateSmallSvg()
  },
}
</script>

<style>
.v-application {
  font-family: Chakra Petch !important;
}
.topBar {
}

.appBarBtn {
  font-size: 13px !important;
}

.v-btn__content {
  color: white !important;
}

.v-toolbar__content {
  margin: 0;
  padding: 0;
}

.v-ripple__container {
  display: none !important;
}

.v-btn--plain:not(.v-btn--active):not(.v-btn--loading):not(:focus):not(:hover)
  .v-btn__content {
  opacity: 0.75;
}

.connectedWallet {
  border: 1px #4caf50 solid;
  margin-right: 8px;
  margin-left: 8px;
}
</style>
