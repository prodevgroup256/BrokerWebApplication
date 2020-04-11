<template>
      <v-container row wrap fluid>
      <v-carousel v-if="!loading" class="white">
          <v-carousel-item
            v-for="(item,i) in properties"
            :key="i"
            :src="item.Image"
          >
        <!--<div class="PropertyNameField text-sm-left">{{ item.name }}</div>-->
        </v-carousel-item>
            </v-carousel>
      <v-layout row>
        <v-flex xs12 class="text-sm-center" v-if="loading">
          <v-progress-circular :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </v-flex>
      </v-layout>

      <v-container fluid v-if="!loading">
        <v-layout row>
          <v-flex xs12 class="text-sm-center mt-4">
              <h1>{{ companyBio[0].Introduction }}</h1>
              <v-divider></v-divider>
              <div class="mt-2 companyBio">{{ companyBio[0].Bio }}</div>
          </v-flex>
        </v-layout>

        <!-- Find A Property -->
        <v-layout row>
          <v-flex xs12 class=" propertiesPreview mt-3 text-sm-center">
              <h1 class="red--text darken4"> FIND A PROPERTY</h1>
              <v-divider></v-divider>
              <v-layout row >
              <!-- Property View Row -->
                <v-flex xs12 sm8 md8 class="PropertiesListing mr-2 pr-2 mt-1">

                  <v-card v-for="property in properties" :key="property.id" class="mb-2 mt-1 PropertyRow">
                   <router-link :to="'/ViewProperty/'+property.id" style="cursor: pointer;text-decoration:none;">
                    <v-layout row wrap @mouseover="viewMap(property.PropertyMap)">

                            <v-flex xs12 sm5 md5>
                                <v-layout align-center justify-center>
                                  <v-img
                                    :src="property.Image" router
                                    :to="'/ViewProperty/'+property.id"
                                    aspect-ratio="1"
                                    class="grey lighten-2"
                                    max-width="300"
                                    max-height="200"
                                  ></v-img>
                                </v-layout>

                            </v-flex>

                            <v-flex xs12 sm7 md7 class="text-sm-left pl-3 pt-2">
                                <h4 class="propertyCardLocation">{{property.location}}</h4>
                                <div><h1 class="cardPropertyName">{{property.name}}</h1></div>
                                <divider class="pink darken-2"></divider>
                            </v-flex>
                    </v-layout>
                        </router-link>
                  </v-card>
                  </v-flex>
                  <!-- Property View Row -->
                  <v-flex xs4 class="pr-2">
                      <iframe :src="MapHovered" width="500" height="400" frameborder="1"
                       style="border:0" allowfullscreen></iframe>
                  </v-flex>

              </v-layout>

          </v-flex>
        </v-layout>

      </v-container>

        <v-layout row wrap fluid class="white mt-2 text-sm-center">
          <v-flex xs12 class="mt-3">
              <h3>Recommended For You...</h3>
          </v-flex>

          <v-flex sm4 xs12 class="mt-3 zoomEffect" v-for="Image in propertyGallery" :key="Image.id">
            <v-card class="mx-auto" max-width="400" :to="'/ViewProperty/'+Image.PropertyId">
                <v-img class="white--text" height="200px" :src="Image.Image">
                <v-card-title class="align-end fill-height"></v-card-title>
                </v-img>
            </v-card>
          </v-flex>

        </v-layout>

      </v-container>

</template>

<script>
export default {
  data: () => ({
    show: true,
    counting: 3,
    rowsToShow: 2,
    MapHovered: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.048949679966!2d32.58458027670091!3d0.3037923964536396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc6607b2b6f3%3A0xf203150b56b66a80!2sKabalagala%2C+Kampala!5e0!3m2!1sen!2sug!4v1564139214105!5m2!1sen!2sug'
  }),
  computed: {
    properties () {
      return this.$store.getters.getAllProperties
    },
    propertyRowList () {
      return this.$store.getters.propertyRowList
    },
    companyBio () {
      return this.$store.getters.getCompanyDetails
    },
    loading () {
      return this.$store.getters.getLoadState
    },
    propertyGallery () {
      return this.$store.getters.getHomeGallery
    }
  },
  methods: {
    viewMap (SeeMap) {
      this.MapHovered = SeeMap
    },
    reserve () {
      this.loading = true
      setTimeout(() => (this.loading = false), 2000)
    }
  }
}
</script>

<style>
.PropertyRow:hover{
  box-shadow: 1px 3px #f2f2f2;
}
  .propertyCardLocation{
    color: rgb(118, 118, 118);
    overflow-wrap: break-word !important;
    font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif !important;
    font-size: 12px !important;
    line-height: 1.33333em !important;
    white-space: nowrap !important;
    text-transform: uppercase !important;
  }
  .cardPropertyName {
    overflow-wrap: break-word !important;
    font-family: "Montserrat";
    font-size: 18px !important;
    font-weight: 600 !important;
    line-height: 1.44444em !important;
    color: rgb(72, 72, 72) !important;
    border-spacing: 0px !important;
  }
  .PropertiesListing{
    min-height: 400px;
    max-height: 400px;
    overflow-y: scroll;
  }
  .homeSlider{
    min-height: 500px;
  }
  .companyBio{
    /*color: #111136;*/
    font-size: 12pt;
    font-family: "Montserrat";
    line-height: 22px;
    font-weight: 120px;
  }
  .findProperty{
    font-size: 12pt;
    font-family: "Montserrat";
    line-height: 22px;
    font-weight: 120px;
  }
  .PropertyNameField{
    width: 100%;
    height: 50px;
    background: #000;
    opacity: 0.8;
    margin-top: 37%;
    color: white;
    padding-left:10px;
    font-size: 24px;
  }
  .propertiesPreview{
    /*background: #1867c0;*/
    padding-top: 50px;
    padding-bottom: 50px;
  }
.v-progress-circular {
  margin: 1rem;
}
.zoomEffect:hover{
  transform: scale(0.97)
}
.zoomEffect{
  transition: transform 1.s;
}
box {
  height: 104px;
  width: 100px;
}

</style>
