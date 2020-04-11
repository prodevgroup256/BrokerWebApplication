<template>

    <v-card>
        <v-img :src="myProperty.Image" aspect-ratio="1" class="grey lighten-2"
        max-width="100%" max-height="450" ></v-img>
        <v-container>
            <v-layout row wrap>
                <v-flex xs12 sm7 md7 class="pr-3">
                <iframe :src="myProperty.PropertyMap" width="100%" height="200" frameborder="0" style="border:0" allowfullscreen></iframe>
                    <div class="heading"><h3>{{myProperty.name}}</h3></div>
                    <div class="pink--text mt-2"><p><v-icon class="pink--text">place</v-icon> {{myProperty.location}} - {{ companyDetails[0].Mobile}}</p></div>

                <v-divider class="pink"></v-divider>
                <div class="mt-2">{{ myProperty.AboutProperty }}</div>

                <!-- Property Images -->
                            <v-divider class="mt-6 mx-4"></v-divider>
                    <!-- Property Images-->
                        <div class="heading pink--text darken-2 pl-2 pt-2"><h2>Reserve</h2></div>
                    <v-divider></v-divider>
                <v-card class="mt-2">
                        <v-form v-model="valid" @submit.prevent="CreateReservasion">
                            <v-container grid-list-xl>

                            <v-layout wrap>
                                <v-flex xs12 md6>
                                <v-text-field v-model="firstname" label="Name" required ></v-text-field>
                                </v-flex>

                                <v-flex xs12 md6>
                                <v-text-field v-model="Mobile" label="Phone" required></v-text-field>
                                </v-flex>

                            </v-layout>

                            <v-layout wrap>
                                <v-flex xs12 md6>
                                    <v-text-field v-model="userEmail" label="Email" required></v-text-field>
                                </v-flex>

                                <v-flex xs12 md6>
                                    <v-text-field type="number" v-model="Guests" label="No. Of Rooms" required></v-text-field>
                                </v-flex>

                            </v-layout>

                            <v-layout wrap>
                                <v-flex xs12 md6 >
                                <v-menu v-model="menu1"
                                    :close-on-content-click="false" full-width max-width="290">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                        :value="computedDateFormattedMomentjs"
                                        clearable label="CheckIn" readonly v-on="on" ></v-text-field>
                                    </template>
                                    <v-date-picker color="pink" v-model="Starts"  @change="menu1 = false"></v-date-picker>
                                </v-menu>
                                </v-flex>

                                <v-flex xs12 md6>
                                    <v-menu v-model="menu2"
                                        :close-on-content-click="false" full-width max-width="290">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                            :value="computedDateFormattedMomentjsEnds"
                                            clearable label="CheckOut" readonly v-on="on" ></v-text-field>
                                        </template>
                                        <v-date-picker color="pink" v-model="Ends"  @change="menu2 = false"></v-date-picker>
                                    </v-menu>
                                </v-flex>

                            </v-layout>

                            <v-layout wrap>
                                <v-flex xs12 md12 class="text-sm-center">
                                    <v-textarea name="input-7-4" outlined v-model="Message" label="Message" required ></v-textarea>
                                </v-flex>
                            </v-layout>

                            <v-layout wrap>
                                <v-flex xs12 md12 class="text-sm-center">
                                    <v-btn type="submit" color="pink" dark large>RESERVE</v-btn><br>
                                <v-progress-linear v-if="loading" indeterminate color="pink darken-4"></v-progress-linear>
                                </v-flex>
                            </v-layout>

                            </v-container>
                        </v-form>

                    </v-card>

                </v-flex>

                <v-flex xs12 sm5 md5>
                        <v-card>
                            <v-subheader>Gallery {{myPropertyGallery.length}} <v-spacer></v-spacer> <span><v-btn @click="SeeGallery" dark right  class="blue"><v-icon>gamepad</v-icon> View Gallery</v-btn></span> </v-subheader>
                            <v-container fluid grid-list-sm>
                            <v-layout wrap>

                                <v-progress-circular v-if="loadingGallery"
                                    :width="5"
                                    color="red"
                                    indeterminate
                                    ></v-progress-circular>

                                <v-flex v-for="i in myPropertyGallery" :key="i.id" xs12 sm6 class="pl-1">
                                <img :src="i" aspect-ratio="1.7" height="150" class="image" alt="lorem">
                                </v-flex>
                            </v-layout>
                            </v-container>
                        </v-card>

                    <v-card>

                    </v-card>
                </v-flex>

            </v-layout>
        </v-container>

    </v-card>
</template>
<script>
import moment from 'moment'
import * as firebase from 'firebase'
moment.defaultFormat = 'DD.MM.YYYY HH:mm'
export default {
  props: ['propertyId'],
  data () {
    return {
      selectedProperty: this.propertyId,
      Starts: new Date().toISOString().substr(0, 10),
      Ends: new Date().toISOString().substr(0, 10),
      Created: new Date().toISOString().substr(0, 10),
      firstname: '',
      loadingGallery: false,
      Mobile: '',
      userEmail: '',
      Guests: '',
      Message: '',
      menu1: false,
      menu2: false,
      myPropertyGallery: [],
      BookOptions: ['1', '2', '3', '4', '5', '6', 'More Than 6']
    }
  },
  computed: {
    myProperty () {
      return this.$store.getters.propertyDetails(this.selectedProperty)
    },
    companyDetails () {
      return this.$store.getters.getCompanyDetails
    },
    computedDateFormattedMomentjs () {
      return this.Starts ? moment(this.Starts).format('dddd, MMMM Do YYYY') : ''
    },
    computedDateFormattedMomentjsEnds () {
      return this.Ends ? moment(this.Ends).format('dddd, MMMM Do YYYY') : ''
    },
    loading () {
      return this.$store.getters.loading
    },
    propertyGallery () {
      return this.$store.getters.getPropertyGallery(this.selectedProperty)
    }
  },
  watch: {

  },
  methods: {
    SeeGallery () {
      this.loadingGallery = true
      var PropGallery = []

      setTimeout(() => {
        firebase.firestore().collection('Gallery')
          .where('PropertyId', '==', this.selectedProperty)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(Img => {
              PropGallery.push(Img.data().Image)
              // console.log({Image: Img.data().Image, Property: Img.data().PropertyId})
            })
          })
        console.log(PropGallery)
        this.myPropertyGallery = PropGallery
        this.loadingGallery = false
      }, 1000)
    },
    CreateReservasion () {
      if (this.firstname.length <= 1) {
        alert('Please Enter Your Name')
      } else {
        var newReservasion = {
          Name: this.firstname,
          Mobile: this.Mobile,
          Email: this.userEmail,
          Guests: this.Guests,
          CheckIn: this.Starts,
          CheckOut: this.Ends,
          Message: this.Message,
          Sent: this.Created
        }
        this.$store.dispatch('MakeReservasion', newReservasion)
        console.log(newReservasion)
        this.firstname = ''
        this.Mobile = ''
        this.userEmail = ''
        this.Guests = ''
        this.Message = ''
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .v-progress-circular
    margin: 1rem
</style>
