<template>
  <v-layout>
    <div class="text-center ma-0 pa-0">
      <div
        v-for="(attributeClass, i) in allAttributes"
        v-bind:key="attributeClass.name"
        class="ma-0 py-2"
        style="color: #4caf50"
      >
        <h2 class="px-2">{{ attributeClass.name }}</h2>
        <v-container class="ma-0 pa-0" fluid>
          <v-row class="ma-0 pa-0 justify-center">
            <v-col
              v-for="(attr2, j) in attributeClass.attributes"
              class="ma-0 pa-0"
              style="flex-grow: 0"
            >
              <v-card class="ma-2" height="175px" width="150px">
                <v-img :src="attr2.src" height="150px" width="150px"></v-img>
                <v-card-subtitle class="ma-0 pa-0">
                  <div style="font-size: 12px; color: white">
                    {{ attr2.name }}
                  </div>
                  <!-- <div style="font-size: 12px; color: white">
                    {{ attr2.rarity }}
                  </div> -->
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <hr style="margin-top: 25px; margin-bottom: 25px; margin-left: 35%; margin-right: 35%"></hr>
      </div>

    </div>
  </v-layout>
</template>

<script>

export default {
  data() {
    return {
      allAttributes: [
        {
          name: 'Shape Type',
          attributes: [
            {
              name: 'Circular',
              src: '/solmeshes/Shapes700/Circular.png',
              rarity: '15%',
            },
            {
              name: 'Triangle',
              src: '/solmeshes/Shapes700/Triangle.png',
              rarity: '15%',
            },
            {
              name: 'Square',
              src: '/solmeshes/Shapes700/Square.png',
              rarity: '15%',
            },
            {
              name: 'Trapezoidal',
              src: '/solmeshes/Shapes700/Trapezoidal.png',
              rarity: '15%',
            },
            {
              name: 'Pentagon',
              src: '/solmeshes/Shapes700/Pentagon.png',
              rarity: '15%',
            },
            {
              name: 'Heptagon',
              src: '/solmeshes/Shapes700/Heptagon.png',
              rarity: '15%',
            },
            {
              name: 'Hexagon',
              src: '/solmeshes/Shapes700/Hexagon.png',
              rarity: '15%',
            },
            {
              name: 'Octagon',
              src: '/solmeshes/Shapes700/Octagon.png',
              rarity: '15%',
            },
          ],
        },
        {
          name: 'Mesh Style',
          attributes: [
            {
              name: 'Triangular',
              src: '/solmeshes/MeshStyle700/Triangular.png',
              rarity: '15%',
            },
            {
              name: 'Quadrilateral',
              src: '/solmeshes/MeshStyle700/Quadrilateral.png',
              rarity: '15%',
            },
          ],
        },
        {
          name: 'Void Layout - Classics',
          attributes: [
            {
              name: 'Circulus Parvum',
              src: '/solmeshes/VoidLayouts700/1_CirculusParvum.png',
              rarity: '5%',
            },
            {
              name: 'Circulus Magnum',
              src: '/solmeshes/VoidLayouts700/2_CirculusMagnum.png',
              rarity: '5%',
            },
            {
              name: 'Triplum Parvum',
              src: '/solmeshes/VoidLayouts700/3_TriplumParvum.png',
              rarity: '5%',
            },
            {
              name: 'Triplum Magnum',
              src: '/solmeshes/VoidLayouts700/4_TriplumMagnum.png',
              rarity: '5%',
            },
            {
              name: 'Plus Parvum',
              src: '/solmeshes/VoidLayouts700/5_PlusParvum.png',
              rarity: '5%',
            },
            {
              name: 'Plus Magnum',
              src: '/solmeshes/VoidLayouts700/6_PlusMagnum.png',
              rarity: '5%',
            },
            {
              name: 'Minus Parvum',
              src: '/solmeshes/VoidLayouts700/7_MinusParvum.png',
              rarity: '5%',
            },
            {
              name: 'Minus Magnum',
              src: '/solmeshes/VoidLayouts700/8_MinusMagnum.png',
              rarity: '5%',
            },
            {
              name: 'Cross Parvum',
              src: '/solmeshes/VoidLayouts700/9_CrossParvum.png',
              rarity: '5%',
            },
            {
              name: 'Cross Magnum',
              src: '/solmeshes/VoidLayouts700/10_CrossMagnum.png',
              rarity: '5%',
            },
            {
              name: 'Circularis Parvum',
              src: '/solmeshes/VoidLayouts700/11_CircularisParvum.png',
              rarity: '5%',
            },
            {
              name: 'Circularis Magnum',
              src: '/solmeshes/VoidLayouts700/12_CircularisMagnum.png',
              rarity: '5%',
            },
            {
              name: 'Diamond',
              src: '/solmeshes/VoidLayouts700/13_Diamond.png',
              rarity: '5%',
            },
            {
              name: 'Fade',
              src: '/solmeshes/VoidLayouts700/14_Fade.png',
              rarity: '5%',
            },
            {
              name: 'Triangulus',
              src: '/solmeshes/VoidLayouts700/15_Triangulus.png',
              rarity: '5%',
            },
            {
              name: 'Quaternarius',
              src: '/solmeshes/VoidLayouts700/16_Quaternarius.png',
              rarity: '5%',
            }
          ],
        },
          {
          name: 'Void Layout - Constellations',
          attributes: [
            {
              name: 'Ursa Minor',
              src: '/solmeshes/VoidLayouts700/17_UrsaMinor.png',
              rarity: '5%',
            },
            {
              name: 'Ursa Major',
              src: '/solmeshes/VoidLayouts700/18_UrsaMajor.png',
              rarity: '5%',
            },
            {
              name: 'Corvus',
              src: '/solmeshes/VoidLayouts700/19_Corvus.png',
              rarity: '5%',
            },
            {
              name: 'Cassiopeia',
              src: '/solmeshes/VoidLayouts700/20_Cassiopeia.png',
              rarity: '5%',
            },
            {
              name: 'Norma',
              src: '/solmeshes/VoidLayouts700/21_Norma.png',
              rarity: '5%',
            },
            {
              name: 'Corona Borealis',
              src: '/solmeshes/VoidLayouts700/22_CoronaBorealis.png',
              rarity: '5%',
            },
            {
              name: 'Fornax',
              src: '/solmeshes/VoidLayouts700/23_Fornax.png',
              rarity: '5%',
            },
            {
              name: 'Camelopardalis',
              src: '/solmeshes/VoidLayouts700/24_Camelopardalis.png',
              rarity: '5%',
            },
            {
              name: 'Hydrus',
              src: '/solmeshes/VoidLayouts700/25_Hydrus.png',
              rarity: '5%',
            },
            {
              name: 'Mensa',
              src: '/solmeshes/VoidLayouts700/26_Mensa.png',
              rarity: '5%',
            },
            {
              name: 'Reticulum',
              src: '/solmeshes/VoidLayouts700/27_Reticulum.png',
              rarity: '5%',
            },
            {
              name: 'Dorado',
              src: '/solmeshes/VoidLayouts700/28_Dorado.png',
              rarity: '5%',
            },
            {
              name: 'Volan',
              src: '/solmeshes/VoidLayouts700/29_Volans.png',
              rarity: '5%',
            },
            {
              name: 'Musca',
              src: '/solmeshes/VoidLayouts700/30_Musca.png',
              rarity: '5%',
            },
            {
              name: 'Aries',
              src: '/solmeshes/VoidLayouts700/31_Aries.png',
              rarity: '5%',
            },
            {
              name: 'Taurus',
              src: '/solmeshes/VoidLayouts700/32_Taurus.png',
              rarity: '5%',
            },
            {
              name: 'Gemini',
              src: '/solmeshes/VoidLayouts700/33_Gemini.png',
              rarity: '5%',
            },
            {
              name: 'Cancer',
              src: '/solmeshes/VoidLayouts700/34_Cancer.png',
              rarity: '5%',
            },
            {
              name: 'Leo',
              src: '/solmeshes/VoidLayouts700/35_Leo.png',
              rarity: '5%',
            },
            {
              name: 'Virgo',
              src: '/solmeshes/VoidLayouts700/36_Virgo.png',
              rarity: '5%',
            },
            {
              name: 'Libra',
              src: '/solmeshes/VoidLayouts700/37_Libra.png',
              rarity: '5%',
            },
            {
              name: 'Scorpio',
              src: '/solmeshes/VoidLayouts700/38_Scorpio.png',
              rarity: '5%',
            },
            {
              name: 'Sagittarius',
              src: '/solmeshes/VoidLayouts700/39_Sagittarius.png',
              rarity: '5%',
            },
            {
              name: 'Capricornus',
              src: '/solmeshes/VoidLayouts700/40_Capricornus.png',
              rarity: '5%',
            },
            {
              name: 'Aquarius',
              src: '/solmeshes/VoidLayouts700/41_Aquarius.png',
              rarity: '5%',
            },
            {
              name: 'Pisces',
              src: '/solmeshes/VoidLayouts700/42_Pisces.png',
              rarity: '5%',
            },
          ],
        },
        {
          name: 'Color Combination',
          attributes: [
            {
              name: 'White',
              src: '/solmeshes/ColorCombinations700/1_White.png',
              rarity: '5%',
            },
            {
              name: 'Red',
              src: '/solmeshes/ColorCombinations700/2_Red.png',
              rarity: '5%',
            },
            {
              name: 'Cyan',
              src: '/solmeshes/ColorCombinations700/3_Cyan.png',
              rarity: '5%',
            },
            {
              name: 'Electric Violet',
              src: '/solmeshes/ColorCombinations700/4_Electric Violet.png',
              rarity: '5%',
            },
            {
              name: 'Spring Green',
              src: '/solmeshes/ColorCombinations700/5_Spring Green.png',
              rarity: '5%',
            },
            {
              name: 'Malibu',
              src: '/solmeshes/ColorCombinations700/6_Malibu.png',
              rarity: '5%',
            },
            {
              name: 'Maya Blue',
              src: '/solmeshes/ColorCombinations700/7_Maya Blue.png',
              rarity: '5%',
            },
            {
              name: 'Gorse',
              src: '/solmeshes/ColorCombinations700/8_Gorse.png',
              rarity: '5%',
            },
            {
              name: 'Purple',
              src: '/solmeshes/ColorCombinations700/9_Purple.png',
              rarity: '5%',
            },
            {
              name: 'Koromiko',
              src: '/solmeshes/ColorCombinations700/10_Koromiko.png',
              rarity: '5%',
            },
            {
              name: 'Money Green',
              src: '/solmeshes/ColorCombinations700/11_Money Green.png',
              rarity: '5%',
            },
            {
              name: 'Lavander',
              src: '/solmeshes/ColorCombinations700/12_Lavander.png',
              rarity: '5%',
            },
            {
              name: 'Electric Violet-Malachite',
              src: '/solmeshes/ColorCombinations700/13_Electric Violet-Malachite.png',
              rarity: '5%',
            },
            {
              name: 'Electric Violet-White',
              src: '/solmeshes/ColorCombinations700/14_Electric Violet-White.png',
              rarity: '5%',
            },
            {
              name: 'Cyan-White',
              src: '/solmeshes/ColorCombinations700/15_Cyan-White.png',
              rarity: '5%',
            },
            {
              name: 'Cyan-Yellow',
              src: '/solmeshes/ColorCombinations700/16_Cyan-Yellow.png',
              rarity: '5%',
            },
            {
              name: 'Medium Purple-Lime',
              src: '/solmeshes/ColorCombinations700/17_Medium Purple-Lime.png',
              rarity: '5%',
            },
            {
              name: 'Maya Blue-Koromiko',
              src: '/solmeshes/ColorCombinations700/18_Maya Blue-Koromiko.png',
              rarity: '5%',
            },
            {
              name: 'Screamin Green-Pale Prim',
              src: '/solmeshes/ColorCombinations700/19_Screamin Green-Pale Prim.png',
              rarity: '5%',
            },
            {
              name: 'Tapestry-Calamansi',
              src: '/solmeshes/ColorCombinations700/20_Tapestry-Calamansi.png',
              rarity: '5%',
            },
            {
              name: 'Celeste-Turmeric',
              src: '/solmeshes/ColorCombinations700/21_Celeste-Turmeric.png',
              rarity: '5%',
            },
            {
              name: 'Red-White',
              src: '/solmeshes/ColorCombinations700/22_Red-White.png',
              rarity: '5%',
            },
            {
              name: 'Red-Gold',
              src: '/solmeshes/ColorCombinations700/23_Red-Gold.png',
              rarity: '5%',
            },
            {
              name: 'Di Serria-Blue Green',
              src: '/solmeshes/ColorCombinations700/24_Di Serria-Blue Green.png',
              rarity: '5%',
            },
            {
              name: 'Di Serria-White',
              src: '/solmeshes/ColorCombinations700/25_Di Serria-White.png',
              rarity: '5%',
            },
            {
              name: 'Coral Red-Forest Green',
              src: '/solmeshes/ColorCombinations700/26_Coral Red-Forest Green.png',
              rarity: '5%',
            },
            {
              name: 'White-Gorse',
              src: '/solmeshes/ColorCombinations700/27_White-Gorse.png',
              rarity: '5%',
            },
            {
              name: 'White-Orange',
              src: '/solmeshes/ColorCombinations700/28_White-Orange.png',
              rarity: '5%',
            },
            {
              name: 'White-Navy Blue',
              src: '/solmeshes/ColorCombinations700/29_White-Navy Blue.png',
              rarity: '5%',
            },
            {
              name: 'White-Green',
              src: '/solmeshes/ColorCombinations700/30_White-Green.png',
              rarity: '5%',
            },
            {
              name: 'Blueberry-White',
              src: '/solmeshes/ColorCombinations700/31_Blueberry-White.png',
              rarity: '5%',
            },
            {
              name: 'Blueberry-Yellow',
              src: '/solmeshes/ColorCombinations700/32_Blueberry-Yellow.png',
              rarity: '5%',
            },
            {
              name: 'Blueberry-Orange',
              src: '/solmeshes/ColorCombinations700/33_Blueberry-Orange.png',
              rarity: '5%',
            },
            {
              name: 'Money Green-White',
              src: '/solmeshes/ColorCombinations700/34_Money Green-White.png',
              rarity: '5%',
            },
            {
              name: 'Money Green-Yellow',
              src: '/solmeshes/ColorCombinations700/35_Money Green-Yellow.png',
              rarity: '5%',
            },
            {
              name: 'Lavander-Bright Turquoise',
              src: '/solmeshes/ColorCombinations700/36_Lavander-Bright Turquoise.png',
              rarity: '5%',
            },
            {
              name: 'Lavander-Gorse',
              src: '/solmeshes/ColorCombinations700/37_Lavander-Gorse.png',
              rarity: '5%',
            },
            {
              name: 'Blaze Orange-Yellow',
              src: '/solmeshes/ColorCombinations700/38_Blaze Orange-Yellow.png',
              rarity: '5%',
            },
            {
              name: 'Blaze Orange-White',
              src: '/solmeshes/ColorCombinations700/39_Blaze Orange-White.png',
              rarity: '5%',
            },
            {
              name: 'Rose-Green',
              src: '/solmeshes/ColorCombinations700/40_Rose-Green.png',
              rarity: '5%',
            },
            {
              name: 'Rose-White',
              src: '/solmeshes/ColorCombinations700/41_Rose-White.png',
              rarity: '5%',
            },
            {
              name: 'Olive-White',
              src: '/solmeshes/ColorCombinations700/42_Olive-White.png',
              rarity: '5%',
            },
          ],
        },
        {
          name: 'Mesh Density',
          attributes: [
            {
              name: 'Low',
              src: '/solmeshes/MeshDensity700/Low.png',
              rarity: '45%',
            },
            {
              name: 'Medium',
              src: '/solmeshes/MeshDensity700/Medium.png',
              rarity: '35%',
            },
            {
              name: 'High',
              src: '/solmeshes/MeshDensity700/High.png',
              rarity: '20%',
            },
          ],
        },
        {
          name: 'Dot Style',
          attributes: [
            {
              name: 'None',
              src: '/solmeshes/DotStyle700/None.png',
              rarity: '50%',
            },
            {
              name: 'Dotted',
              src: '/solmeshes/DotStyle700/Dotted.png',
              rarity: '50%',
            },
          ],
        },
      ],
    }
  },
  components: {},
  methods: {},
  mounted() {},
}
</script>

<style></style>
