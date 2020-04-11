<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
          <v-img
          :src="propertyDetails.Image"
          aspect-ratio="1.7" height="250"
        >
        <v-btn fab small color="cyan accent-2 mb-5" bottom right absolute>
            <v-icon>edit</v-icon>
          </v-btn>
        </v-img>
        <v-card-title class="light-blue"  primary-title>
          <div>
            <h3 class="white--text headline mb-0">{{propertyDetails.name}}</h3>
          <div>

          </div>

          </div>
        </v-card-title>

        <v-layout row>
            <v-flex xs12>
                <v-text-field v-model="PropertyName" label="Property Name" required></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row>
            <v-flex xs12>
                <v-text-field v-model="PropertyLocation" label="Location" required></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row>
            <v-flex xs12>
                <v-textarea outline v-model="PropertyBio" label="About" required></v-textarea>
            </v-flex>
        </v-layout>

        <v-layout row>
            <v-flex xs12>
                <v-textarea outline v-model="propertyMapUrl" label="Map src Url" required></v-textarea>

                <iframe :src="propertyMapUrl" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen=""></iframe>
            </v-flex>
        </v-layout>

        <v-layout row>
            <v-flex xs12>
                <v-btn color="success" @click="UpdatePropertyInfo"> Update </v-btn>
            </v-flex>
        </v-layout>

      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import * as firebase from 'firebase'

export default {
  props: ['propertyId'],
  data () {
    return {
      mPropertyId: this.propertyId,
      PropertyName: '',
      PropertyLocation: '',
      PropertyBio: '',
      propertyMapUrl: ''
    }
  },
  computed: {
    propertyDetails () {
      return this.$store.getters.propertyDetails(this.propertyId)
    }
  },
  methods: {
    UpdatePropertyInfo () {
      var newDetails = {
        name: this.PropertyName,
        location: this.PropertyLocation,
        AboutProperty: this.PropertyBio,
        PropertyMap: this.propertyMapUrl
      }

      firebase.firestore().collection('properties').doc(this.propertyId)
        .update(newDetails)
        .then(function (Updated) {
          alert('Success')
        })
      this.$store.dispatch('allProperties')
    }
  }
}
</script>
