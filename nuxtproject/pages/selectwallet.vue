<template>
  <v-layout class="mt-5 pa-0" style="justify-content: center">
    <v-container fluid>
      <v-row
        v-if="!$store.state.isWalletConnected"
        style="justify-content: center"
      >
        <div style="display: inline-flex; justify-content: center">
          <div class="pr-10" style="border-right: 1px white solid">
            <div class="mb-5" style="text-align: center; font-size: 3vw">
              Sollet
            </div>
            <a
              ><v-img
                @click="connectSollet()"
                width="10vw"
                height="10vw"
                src="https://raw.githubusercontent.com/solana-labs/oyster/main/assets/wallets/sollet.svg"
                style="margin: auto"
              ></v-img
            ></a>
          </div>
          <div class="px-5">
            <div class="mb-5" style="text-align: center; font-size: 3vw">
              Phantom
            </div>
            <a
              ><v-img
                @click="connectPhantom()"
                width="10vw"
                height="10vw"
                src="/solmeshes//phantom-logo.svg"
                style="margin: auto"
              ></v-img
            ></a>
          </div>
          <div class="pl-10" style="border-left: 1px white solid">
            <div class="mb-5" style="text-align: center; font-size: 3vw">
              Solflare
            </div>
            <a
              ><v-img
                @click="connectSolFlare()"
                width="10vw"
                height="10vw"
                src="https://solflare.com/assets/logo-icon.26659b6d.svg"
                style="margin: auto"
              ></v-img
            ></a>
          </div>
        </div>
      </v-row>
      <v-row style="justify-content: center" class="mt-16">
        <a :href="installLink">{{ errorMessage }}</a>
      </v-row>
      <v-row
        v-if="$store.state.isWalletConnected"
        style="justify-content: center"
        class="mt-16"
      >
        <div style="display: inline-flex; justify-content: center">
          Wallet Adress: {{ $store.state.connectedWalletPublicKey }}
        </div>
      </v-row>
      <v-row
        v-if="$store.state.isWalletConnected"
        style="justify-content: center"
        class="mt-16"
      >
        <div style="display: inline-flex; justify-content: center">
          Balance: {{ $store.state.solBalance }}
        </div>
      </v-row>
      <v-row
        v-if="$store.state.isWalletConnected"
        style="justify-content: center"
        class="mt-16"
      >
        <div style="display: inline-flex; justify-content: center">
          Owned SolMeshes: {{ $store.state.ownedTokenCount }}
        </div>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
import Wallet from '@project-serum/sol-wallet-adapter'

export default {
  data() {
    return {
      status: 'Not connected.',
      errorMessage: '',
      installLink: '',
    }
  },
  components: {},
  methods: {
    async connectSollet() {
      let provider = 'https://www.sollet.io'
      let wallet = new Wallet(provider)
      wallet.on('connect', (key) => {
        var publicKey = key.toBase58()
        this.$store.commit('updateWalletPublicKey', window.solflare.publicKey)
        var firstPart = publicKey.substring(0, 4)
        var lastPart = publicKey.slice(-4)
        this.$store.commit(
          'updateWalletStatus',
          '(' + firstPart + ' ... ' + lastPart + ')'
        )
        this.$store.commit('updateIsWalletConnected', true)
        this.$store.dispatch(
          'getWalletInfo',
          Object.values(this.$store.state.smCollectionAddresses)
        )
      })
      wallet.on('disconnect', () => console.log('Disconnected'))
      await wallet.connect()
    },
    connectPhantom() {
      const isPhantomInstalled = window.solana && window.solana.isPhantom
      if (isPhantomInstalled) {
        window.solana.connect()
      } else {
        this.errorMessage = 'Click here to install Phantom Wallet'
        this.installLink = 'https://phantom.app/'
      }
    },
    connectSolFlare() {
      const isSolflareInstalled = window.solflare && window.solflare.isSolflare
      if (isSolflareInstalled) {
        window.solflare.connect()
      } else {
        this.errorMessage = 'Click here to install SolFlare'
        this.installLink = 'https://solflare.com/'
      }
    },
    disconnectWallet() {
      this.$store.dispatch('disconnectWallet')
    },
  },
  mounted() {
    this.$store.commit(
      'updatePhantomInstalledState',
      window.solana && window.solana.isPhantom
    )
    if (window.solflare && window.solflare.isSolflare) {
      window.solflare.on('connect', () => {
        this.$store.commit('updateWalletPublicKey', window.solflare.publicKey)
        var publicKey = window.solflare.publicKey.toString()
        var firstPart = publicKey.substring(0, 4)
        var lastPart = publicKey.slice(-4)
        this.$store.commit(
          'updateWalletStatus',
          '(' + firstPart + ' ... ' + lastPart + ')'
        )
        this.$store.commit('updateIsWalletConnected', true)
        this.$store.dispatch(
          'getWalletInfo',
          Object.values(this.$store.state.smCollectionAddresses)
        )
      })
    }

    if (window.solana && window.solana.isPhantom) {
      window.solana.on('connect', () => {
        this.$store.commit('updateWalletPublicKey', window.solana.publicKey)
        var publicKey = window.solana.publicKey.toString()
        var firstPart = publicKey.substring(0, 4)
        var lastPart = publicKey.slice(-4)
        this.$store.commit(
          'updateWalletStatus',
          '(' + firstPart + ' ... ' + lastPart + ')'
        )
        this.$store.commit('updateIsWalletConnected', true)
        this.$store.dispatch(
          'getWalletInfo',
          Object.values(this.$store.state.smCollectionAddresses)
        )
        this.$router.push('/')
      })
      window.solana.on('disconnect', () => {
        this.$store.commit('updateWalletPublicKey', '')
        this.status = 'Disconnected.'
      })
    }
  },
}
</script>

<style></style>
