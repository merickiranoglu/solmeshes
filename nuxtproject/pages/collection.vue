<template>
  <v-layout class="ma-0 pa-0">
    <v-container fluid>
      <v-expansion-panels
        v-model="panel"
        multiple
        style="font-size: 15px !important"
        :key="componentKey"
      >
        <v-expansion-panel class="ma-2 px-2">
          <v-expansion-panel-header> Filter </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-switch
              class="ma-0 pa-0"
              v-model="filterOwned"
              label="Show only owned SolMeshes"
              dense
            >
            </v-switch>

            <v-expansion-panel>
              <v-expansion-panel-header class="mx-2 pl-1">
                <small>Shape</small>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-btn
                        v-for="(option, i) in allShapes"
                        :key="i"
                        @click="changeShapeFilterStatus(i)"
                        x-small
                        v-model="selectedShapeIndexes[i]"
                        :color="selectedShapeIndexes[i] ? '#4caf50' : 'red'"
                      >
                        <span style="font-size: 10px">{{ option }}</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel v-if="this.showVoidLayoutFilter">
              <v-expansion-panel-header class="mx-2 pl-1">
                <small>Void Layout</small>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-btn
                        v-for="(option, i) in allLayouts"
                        :key="i"
                        @click="changeLayoutFilterStatus(i)"
                        x-small
                        v-model="selectedLayoutIndexes[i]"
                        :color="selectedLayoutIndexes[i] ? '#4caf50' : 'red'"
                      >
                        <span style="font-size: 10px">{{ option }}</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header class="mx-2 pl-1">
                <small>Mesh Type</small>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-btn
                        v-for="(option, i) in allMeshTypes"
                        :key="i"
                        @click="changeMeshTypeFilterStatus(i)"
                        x-small
                        v-model="selectedMeshTypeIndexes[i]"
                        :color="selectedMeshTypeIndexes[i] ? '#4caf50' : 'red'"
                      >
                        <span style="font-size: 10px">{{ option }}</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header class="mx-2 pl-1">
                <small>Color Combination</small>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-btn
                        v-for="(option, i) in allColorCombinations"
                        :key="i"
                        @click="changeColorCombinationFilterStatus(i)"
                        x-small
                        v-model="selectedColorCombinationIndexes[i]"
                        :color="
                          selectedColorCombinationIndexes[i] ? '#4caf50' : 'red'
                        "
                      >
                        <span style="font-size: 10px">{{ option }}</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header class="mx-2 pl-1">
                <small>Mesh Density</small>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-btn
                        v-for="(option, i) in allMeshDensities"
                        :key="i"
                        @click="changeMeshDensityFilterStatus(i)"
                        x-small
                        v-model="selectedMeshDensityIndexes[i]"
                        :color="
                          selectedMeshDensityIndexes[i] ? '#4caf50' : 'red'
                        "
                      >
                        <span style="font-size: 10px">{{ option }}</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header class="mx-2 pl-1">
                <small>Dot Existence</small>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="ma-0 pa-0">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-btn
                        v-for="(option, i) in allDotBooleans"
                        :key="i"
                        @click="changeDotTypeFilterStatus(i)"
                        x-small
                        v-model="selectedDotBooleanIndexes[i]"
                        :color="
                          selectedDotBooleanIndexes[i] ? '#4caf50' : 'red'
                        "
                      >
                        <span style="font-size: 10px">{{ option }}</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-btn elevation="0" small @click="panel = []"
              ><span style="font-size: 14px">Close</span></v-btn
            >
            <v-btn elevation="0" small @click="clearFilters()"
              ><span style="font-size: 14px">Clear</span></v-btn
            >
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-responsive class="ma-0 pa-0 overflow-y-auto" max-height="80vh">
        <p class="ml-4" v-if="!this.$store.state.allMeshesFetched">
          Loading NFTs...
        </p>
        <v-container
          v-if="this.$store.state.allMeshesFetched"
          class="ma-0 pa-0"
          fluid
        >
          <v-row
            class="pa-0 ma-0"
            style="display: flex; background-color: #212121"
          >
            <v-col
              v-for="(mesh, i) in getFilteredMeshes()"
              :key="i"
              class="pa-0 ma-2 child-flex"
              style="max-width: fit-content"
            >
              <v-hover v-slot:default="{ hover }">
                <a>
                  <v-card
                    elevation="5"
                    class="ma-0 pa-0"
                    style="background-color: black"
                  >
                    <v-img
                      @click="meshClicked(mesh)"
                      :src="mesh.image"
                      class="white--text align-end pa-2 ma-2"
                      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                      height="280px"
                      width="280px"
                    >
                      <v-flex class="pa-0 ma-0" style="text-align: start">
                        <a style="color: white; font-size: 16px">{{
                          mesh.name
                        }}</a>
                      </v-flex>

                      <v-expand-transition>
                        <div
                          v-if="hover"
                          class="
                            d-flex
                            transition-fast-in-fast-out
                            transparent
                            darken-2
                            display-1
                            white--text
                          "
                          style="height: 100%"
                        >
                          <div
                            style="
                              font-family: 'Oxanium';
                              font-size: 14px;
                              text-align: center;
                            "
                          >
                            <v-spacer></v-spacer>
                            <a style="color: white">See Details</a>
                          </div>
                        </div>
                      </v-expand-transition>
                    </v-img>
                  </v-card>
                </a>
              </v-hover>
            </v-col>
            <v-card v-intersect="infiniteScrolling"></v-card>
          </v-row>
        </v-container>
      </v-responsive>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      rowCount: 4,
      componentKey: 0,
      isFilterOn: false,
      filterOwned: false,
      showVoidLayoutFilter: false,
      panel: [],
      selectedShapeIndexes: [],
      allShapes: [],
      selectedMeshTypeIndexes: [],
      allMeshTypes: [],
      selectedLayoutIndexes: [],
      allLayouts: [],
      selectedColorCombinationIndexes: [],
      allColorCombinations: [],
      selectedMeshDensityIndexes: [],
      allMeshDensities: [],
      selectedDotBooleanIndexes: [],
      allDotBooleans: [],
    }
  },
  methods: {
    clearFilters() {
      this.selectedShapeIndexes = [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ]
      ;(this.selectedMeshTypeIndexes = [true, true]),
        (this.selectedLayoutIndexes = [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
        ])
      this.selectedColorCombinationIndexes = [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ]
      this.selectedMeshDensityIndexes = [true, true, true]
      this.selectedDotBooleanIndexes = [true, true]
    },
    changeShapeFilterStatus(index) {
      this.selectedShapeIndexes[index] = !this.selectedShapeIndexes[index]
      this.componentKey++
      //this.fetchMeshes()
    },
    changeLayoutFilterStatus(index) {
      this.selectedLayoutIndexes[index] = !this.selectedLayoutIndexes[index]
      this.componentKey++
      //this.fetchMeshes()
    },
    changeColorCombinationFilterStatus(index) {
      this.selectedColorCombinationIndexes[index] =
        !this.selectedColorCombinationIndexes[index]
      this.componentKey++
      //this.fetchMeshes()
    },
    changeMeshTypeFilterStatus(index) {
      this.selectedMeshTypeIndexes[index] = !this.selectedMeshTypeIndexes[index]
      this.componentKey++
      //this.fetchMeshes()
    },
    changeMeshDensityFilterStatus(index) {
      this.selectedMeshDensityIndexes[index] =
        !this.selectedMeshDensityIndexes[index]
      this.componentKey++
      //this.fetchMeshes()
    },
    changeDotTypeFilterStatus(index) {
      this.selectedDotBooleanIndexes[index] =
        !this.selectedDotBooleanIndexes[index]
      this.componentKey++
      //this.fetchMeshes()
    },
    fetchMeshes() {
      this.$store.dispatch('getMeshes')
    },
    getSelectedFilterOptions(allOptions, selectedIndexes) {
      let selectedOptions = []
      for (let i = 0; i < allOptions.length; i++) {
        let option = allOptions[i]
        if (selectedIndexes[i]) {
          selectedOptions.push(option)
        }
      }
      return selectedOptions
    },
    infiniteScrolling(entries, observer, isIntersecting) {
      // if (!isIntersecting) {
      //   return
      // }
      // this.rowCount++
      //this.fetchMeshes()
    },
    shapeOptionClicked() {
      setTimeout(() => {}, 500)
    },
    fillFilterData() {
      let meshes = this.$store.state.meshes
      for (let i = 0; i < meshes.length; i++) {
        let mesh = meshes[i]
        let shape = mesh.attributes[0].value
        if (!this.allShapes.includes(shape)) {
          this.allShapes.push(shape)
        }
        let voidLayout = mesh.attributes[1].value
        if (!this.allLayouts.includes(voidLayout)) {
          this.allLayouts.push(voidLayout)
        }
        let colorCombination = mesh.attributes[2].value
        if (!this.allColorCombinations.includes(colorCombination)) {
          this.allColorCombinations.push(colorCombination)
        }
        let dotStyle = mesh.attributes[3].value
        if (!this.allDotBooleans.includes(dotStyle)) {
          this.allDotBooleans.push(dotStyle)
        }
        let meshStyle = mesh.attributes[4].value
        if (!this.allMeshTypes.includes(meshStyle)) {
          this.allMeshTypes.push(meshStyle)
        }
        let meshDensity = mesh.attributes[5].value
        if (!this.allMeshDensities.includes(meshDensity)) {
          this.allMeshDensities.push(meshDensity)
        }
      }
      for (let i = 0; i < this.allShapes.length; i++) {
        this.selectedShapeIndexes.push(true)
      }
      for (let i = 0; i < this.allLayouts.length; i++) {
        this.selectedLayoutIndexes.push(true)
      }
      for (let i = 0; i < this.allColorCombinations.length; i++) {
        this.selectedColorCombinationIndexes.push(true)
      }
      for (let i = 0; i < this.allDotBooleans.length; i++) {
        this.selectedDotBooleanIndexes.push(true)
      }
      for (let i = 0; i < this.allMeshTypes.length; i++) {
        this.selectedMeshTypeIndexes.push(true)
      }
      for (let i = 0; i < this.allMeshDensities.length; i++) {
        this.selectedMeshDensityIndexes.push(true)
      }
    },
    meshClicked(mesh) {
      this.$store.commit('updateSelectedMesh', mesh)
      this.$router.push('/mesh?' + mesh.name)
    },
    calculateMeshesPerRow() {
      let meshesPerRow = 1
      switch (this.$vuetify.breakpoint) {
        case 'xs':
          meshesPerRow = 1
          break
        case 'sm':
          meshesPerRow = 1
          break
        case 'md':
          meshesPerRow = 3
          break
        case 'xl':
          meshesPerRow = 4
          break
        default:
          meshesPerRow = 4
      }
      return meshesPerRow
    },
    getFilteredMeshes() {
      let meshes = this.$store.state.meshes
      let filteredMeshes = []
      for (let i = 0; i < meshes.length; i++) {
        let mesh = meshes[i]
        let shapeFilterStatus =
          this.selectedShapeIndexes[
            this.allShapes.indexOf(mesh.attributes[0].value)
          ]
        let voidLayoutFilterStatus =
          this.selectedLayoutIndexes[
            this.allLayouts.indexOf(mesh.attributes[1].value)
          ]
        let colorCombinationFilterStatus =
          this.selectedColorCombinationIndexes[
            this.allColorCombinations.indexOf(mesh.attributes[2].value)
          ]
        let dotBooleansFilterStatus =
          this.selectedDotBooleanIndexes[
            this.allDotBooleans.indexOf(mesh.attributes[3].value)
          ]
        let meshTypeFilterStatus =
          this.selectedMeshTypeIndexes[
            this.allMeshTypes.indexOf(mesh.attributes[4].value)
          ]
        let meshDensityFilterStatus =
          this.selectedMeshDensityIndexes[
            this.allMeshDensities.indexOf(mesh.attributes[5].value)
          ]

        if (
          shapeFilterStatus &&
          voidLayoutFilterStatus &&
          colorCombinationFilterStatus &&
          dotBooleansFilterStatus &&
          meshTypeFilterStatus &&
          meshDensityFilterStatus
        ) {
          filteredMeshes.push(mesh)
        }
      }
      return filteredMeshes
    },
  },
  async mounted() {
    await this.$store.dispatch('getMeshes').then((res) => {
      this.fillFilterData()
      this.$store.commit('updateAllMeshesFetched', true)
      this.componentKey++
    })
  },
}
</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: black;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(255, 219, 219);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* .v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 16px;
  margin: 2px;
  padding: 8px;
}

.v-expansion-panel-content__wrap {
  margin: 0px;
  padding: 8px;
}
*/

.col {
  margin: 0px;
  padding: 0px;
}
</style>
