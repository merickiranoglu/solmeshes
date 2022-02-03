<template>
  <v-layout v-resize="onResize" column justify-center align-center>

     <v-timeline :dense="isWindowSmall" class="text-center">
        <v-timeline-item
          
          v-for="(item, i) in RoadMapItems"
          :key="i"
          small
          class="pa-4"
        >
        <template v-slot:opposite>
        
        <span
          :class="`font-weight-bold ${item.color}--text`"
          style="font-size: 14px;">
            <v-icon v-if="!(item.date === '')" color="green darken-2">
              mdi-calendar
            </v-icon>
            {{item.date}}
        </span>
        </template>
        <template v-slot:icon>
          <v-avatar size="35" color="#1E1E1E">
            <img :src=item.src />
            </v-avatar>
          </template>
            <span
              :class="`headline font-weight-bold ${item.color}--text`"
              style="font-family: Chakra Petch !important"
              v-text="item.caption"
            ></span>
              <p v-for="(paragraph, i) in item.paragraphs" 
              class="ma-0 pt-2 pb-3" 
              style="font-size: 13px; font-family: Oxanium !important">
                {{ paragraph}}
              </p>
              <p style="color: #4CAF50; font-size: 12px; font-family: Oxanium !important" v-if="isWindowSmall"> {{item.date}} </p>
           <hr style="margin-right:10% !important"></hr>
        </v-timeline-item>
        </v-timeline>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      isWindowSmall : false,
      RoadMapItems: [
        {
          caption: 'SolShapes Giveaway',
          description: '',
          paragraphs: [
            '50 SolShapes will be distributed through giveaways',
          ],
          date: 'Follow announcements',
          color: 'green',
          src: '/solmeshes/TimelineIcon2.png',
        },
        {
          caption: 'SolShapes Public Sale',
          description: '',
          paragraphs: [
            '950 SolShapes will be minted for 0.25 SOL each',
          ],
          date: '27 November 2021',
          color: 'green',
          src: '/solmeshes/TimelineIcon2.png',
        },
        {
          caption: 'First Shape Evolution',
          description: '',
          paragraphs: [
            '1,000 SolMeshClassics will be airdropped to SolShapes holders.',
          ],
          date: 'on 100% Sale of SolShapes',
          color: 'green',
          insertSvg: true,
          src: '/solmeshes/TimelineIcon2.png',
        },
        {
          caption: ' SolMeshClassics Public Sale',
          description: '',
          paragraphs: ['3,000 SolMeshClassics will be minted for 0.75 SOL each.'],
          date: 'on 100% Sale of SolShapes',
          color: 'green',
          src: '/solmeshes/TimelineIcon2.png',
        },
        {
          caption: 'Second Shape Evolution',
          description: '',
          paragraphs: [
            '4,000 SolMeshConstellation will be airdropped to SolMeshClassics holders.',
          ],
          date: 'on 100% Sale of SolMeshClassics',
          color: 'green',
          insertSvg: true,
          src: '/solmeshes/TimelineIcon2.png',
        },
        {
          caption: ' SolMeshConstellation Public Sale',
          description: '',
          paragraphs: ['6,000 SolMeshConstellation will be minted for 1.5 SOL each.'],
          date: 'on 100% Sale of SolMeshClassics',
          color: 'green',
          src: '/solmeshes/TimelineIcon2.png',
        },
        {
          caption: 'Secondary Market Listings',
          description: '',
          paragraphs: [
            'Secondary markets will be announced soon. You can sell your NFTs through those secondary markets.',
          ],
          date: '',
          color: 'green',
          src: '/solmeshes/TimelineIcon2.png',
        },
        {
          caption: 'Future Projects',
          description: '',
          paragraphs: [
            'New Projects/Collections...',
          ],
          date: '',
          color: 'green',
          src: '/solmeshes/TimelineIcon2.png',
        },
      ],
    }
  },
  components: {},
  methods: {
    onResize() {
      this.isWindowSmall = window.innerWidth < 1060
    },
  },
  mounted() {},
}
</script>

<style></style>
