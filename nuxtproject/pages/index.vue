<template>
  <v-layout v-resize="onResize" column justify-center>
    <div style="z-index: 2" id="stickyIcons">
      <v-btn
        plain
        v-for="icon in $store.state.icons"
        class="mx-4"
        icon
        :href="icon.link"
        style="display: flex"
      >
        <v-icon size="24px">
          {{ icon.mdiString }}
        </v-icon>
      </v-btn>
    </div>
    <div class="text-center">
      <div v-if="!isWindowSmallerThan420px" id="svgSolMeshes"></div>

      <div v-if="!isWindowSmallerThan420px">
        <div class="ma-0 pa-0">
          <p
            style="
              font-size: 30px !important;
              margin-left: 8%;
              margin-right: 8%;
            "
          >
            A Trilogy of Generative Art NFT Collection Project on Solana
            Universe
          </p>
          <p
            style="
              font-family: Oxanium;
              font-style: italic;
              margin-left: 8%;
              margin-right: 8%;
            "
          >
            Be prepared for the beauty of shapes
          </p>
        </div>
      </div>

      <div v-if="isWindowSmallerThan420px">
        <div class="mt-8 pa-0">
          <p
            style="
              font-size: 30px !important;
              margin-left: 8%;
              margin-right: 8%;
            "
          >
            A Trilogy of Generative Art NFT Collection Project on Solana
            Universe
          </p>
          <p
            style="
              font-family: Oxanium;
              font-style: italic;
              margin-left: 8%;
              margin-right: 8%;
            "
          >
            Be prepared for the beauty of shapes
          </p>
        </div>
      </div>
    </div>
    <hr class="my-8" style="margin-left: 35%; margin-right: 35%" />
    <div class="mb-6" justify="center" align="center">
      <v-btn xlarge @click="routeToMint()"> Mint SolShapes </v-btn>
      <p class="mt-6" style="font-size:14px"> Don't trust other websites. Only minting link is mint.solmeshes.com </p>
    </div>
    <div justify="center" align="center">
      <v-img src="/solmeshes/Meshes.gif" height="250px" width="250px"></v-img>
    </div>

    <hr class="my-8" style="margin-left: 35%; margin-right: 35%" />

    <div style="text-align: center" class="my-5">
      <h2 class="my-5" style="color: #4caf50">Join the Community!</h2>
      <v-card-text class="text-center my-5 pa-0">
        <v-btn plain class="mx-4" icon href="https://twitter.com/solmeshes">
          <v-icon size="48px"> mdi-twitter </v-icon>
        </v-btn>
        <v-btn plain class="mx-4" icon href="https://discord.gg/GKUSwm2xF6">
          <v-icon size="48px"> mdi-discord </v-icon>
        </v-btn>
      </v-card-text>
    </div>

    <v-container fluid class="pa-4 my-12">
      <v-row class="ma-0 pa-0" align="center" justify="center">
        <div>powered by</div>
      </v-row>
      <v-row class="ma-0 pa-0" justify="center">
        <div class="pr-8">
          <v-img contain height="55px" width="200px" src="/solmeshes/solana.svg"> </v-img>
        </div>
        <div style="font-size: 20px" class="mt-3">and</div>
        <div class="pl-8">
          <v-img contain height="50px" width="200px" src="/solmeshes/metaplex.svg">
          </v-img>
        </div>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      shapeStrings: [
        'Circle',
        'Triangle',
        'Square',
        'Pentagon',
        'Hexagon',
        'Heptagon',
        'Octagon',
      ],
      voidStrings: ['Aries', 'Camelopardalis', 'Cassiopeia', 'Fade', 'Minus1'],
      shapeIndex: 0,
      voidIndex: 0,
      isWindowSmallerThan420px: false,
      timerCountDays: 30,
      timerCountHours: 30,
      timerCountMinutes: 30,
    }
  },
  components: {},
  methods: {
    routeToMint() {
      window.open("https://mint.solmeshes.com", "_blank")
    },
    setCountdown() {
      var end = new Date('11/27/2021 8:00 PM')
      var _second = 1000
      var _minute = _second * 60
      var _hour = _minute * 60
      var _day = _hour * 24
      var timer
      var now = new Date()
      var distance = end - now
      this.timerCountDays = Math.floor(distance / _day)
      this.timerCountHours = Math.floor((distance % _day) / _hour)
      this.timerCountMinutes = Math.floor((distance % _hour) / _minute)
    },
    changeShape() {
    },
    onResize() {
      this.isWindowSmallerThan420px = window.innerWidth < 420
      var divWidth = window.innerWidth / 1.8
      var divHeight = divWidth / 4
      var scale = window.innerWidth / 1.5 / 275

      var svgSolMeshesDiv = document.getElementById('svgSolMeshes')
      if (svgSolMeshesDiv) {
        svgSolMeshesDiv.innerHTML = ''
        let draw = SVG().addTo('#svgSolMeshes').size(divWidth, divHeight)
        let svgParameters = {
          draw: draw,
          width: divWidth,
          height: divHeight,
          scale: scale,
          animateColors: false,
          startColor: '#4CAF50',
          outlineWidth: 2,
        }
        this.$store.dispatch('startSolMeshesSvg', svgParameters)
      }
    },
    previewClicked() {
      this.drawWithCurrentParameters()
      this.shapeIndex++
      if (this.shapeIndex == this.shapeStrings.length) {
        this.shapeIndex = 0
      }
    }
  },
  watch: {},
  mounted() {
    this.setCountdown()
  },
}
</script>

<style>
div {
  font-size: 24px;
  font-weight: 300;
  z-index: 1;
}

h2 {
  text-align: center;
  margin-bottom: 16px;
  font-size: 28px;
  color: #4caf50;
}

#svgSolMeshes {
  margin-top: 10px;
}

.bgBlack {
  background-color: black;
}

#meshes {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  background-color: black;
  position: relative;
}

#meshes li {
  margin: 0px;
  padding: 0px;
  list-style: none;
  display: block;
  position: absolute;
}

.v-parallax__image {
  width: 100% !important;
  object-fit: scale-down;
}

#stickyIcons {
  bottom: 50px;
  position: fixed !important;
}
</style>
