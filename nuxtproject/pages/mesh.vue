<template>
  <v-layout column justify-start align-start class="px-5">
    <div class="text-center">
      <h1>{{ this.$store.state.selectedMesh.name }}</h1>
      <v-container class="ma-0 pa-0" fluid v-resize="onResize">
        <v-row class="pa-0 ma-0">
          <v-col class="pa-0 ma-2">
            <v-card
              elevation="5"
              class="ma-0 pa-0"
              style="background-color: black"
            >
              <v-img
                :src="this.$store.state.selectedMesh.image"
                class="white--text align-end pa-2 ma-2"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="385px"
                width="385px"
              >
              </v-img
            ></v-card>
          </v-col>
          <v-col class="pa-4 ma-0">
            <v-simple-table height="390px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Attributes</th>
                    <th class="text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{{ $store.state.selectedMesh.name }}</td>
                  </tr>
                  <tr>
                    <td>Shape</td>
                    <td>{{ $store.state.selectedMesh.attributes[0].value }}</td>
                  </tr>
                  <tr>
                    <td>Void Layout</td>
                    <td>{{ $store.state.selectedMesh.attributes[1].value }}</td>
                  </tr>
                  <tr>
                    <td>Color Combination</td>
                    <td>
                      {{ $store.state.selectedMesh.attributes[2].value }}
                    </td>
                  </tr>
                  <tr>
                    <td>Dot Style</td>
                    <td>{{ $store.state.selectedMesh.attributes[3].value }}</td>
                  </tr>
                  <tr>
                    <td>Mesh Style</td>
                    <td>{{ $store.state.selectedMesh.attributes[4].value }}</td>
                  </tr>
                  <tr>
                    <td>Mesh Density</td>
                    <td>{{ $store.state.selectedMesh.attributes[5].value }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      isWindowSmall: 'false',
    }
  },
  components: {},
  methods: {
    onResize() {
      this.isWindowSmall = window.innerWidth < 980
    },
  },
  mounted() {
    if (this.$store.state.selectedMesh === '') {
    }
  },
}
</script>

<style>
td {
  text-align: left;
}
</style>
