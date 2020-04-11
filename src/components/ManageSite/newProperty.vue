<template>

    <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3 class='mt-5'>
                <v-card>

                        <v-img :src='serviceImage' aspect-ratio='1.7'></v-img>
                        <v-card-text>
                            <v-layout row wrap>
                            <v-flex xs12 class='ml-2'>
                                   <v-layout row>
                                        <v-flex xs12 class='text-sm-center'>
                                             <v-btn raised dark color='blue' @click='onPickFile'> Select Image</v-btn>
                                        </v-flex>
                                   </v-layout>
                                </v-flex>

                                <v-flex xs12>
                                    <v-form @submit.prevent='createNewService'>
                                        <v-layout row>
                                            <v-flex xs12>
                                                <input type='file' ref='fileInput' @change='onFilePiked' accept='image/*' style='display:none;'>
                                            </v-flex>
                                        </v-layout>

                                        <v-layout row>
                                            <v-flex xs12>
                                                <v-text-field outline label='Property Name' v-model='propertyName' id='propertyName' name='propertyName'  auto-grow required></v-text-field>
                                            </v-flex>
                                        </v-layout>

                                        <v-layout row>
                                            <v-flex xs12>
                                                <v-text-field outline label='Map Url' v-model='PropertyMap' id='PropertyMap' name='PropertyMap'  auto-grow required></v-text-field>
                                            </v-flex>
                                        </v-layout>

                                        <v-layout row>
                                            <v-flex xs12>
                                                <v-text-field outline label='Location' v-model='Location' id='Location' name='Location'  auto-grow required></v-text-field>
                                            </v-flex>
                                        </v-layout>

                                        <v-layout row>
                                            <v-flex xs12>
                                                <v-textarea outline label='About Property' v-model='AboutProperty' id='AboutProperty' name='AboutProperty'  auto-grow required></v-textarea>
                                            </v-flex>
                                        </v-layout>

                                        <v-flex xs12 class='text-sm-right'>
                                            <v-btn color='default' dark type='submit'>Create Property</v-btn>
                                            <br>{{UploadState}}
                                            <v-progress-linear UploadState v-if='UploadState !=0'></v-progress-linear>
                                        </v-flex>

                                    </v-form>
                                </v-flex>

                            </v-layout>

                            <v-layout row>
                                <v-flex xs12>
                                    <v-progress-linear v-if='loading' color='purple' :indeterminate='true'></v-progress-linear>
                                    <v-alert v-model='show' class='mb-4'>
                                        Success Property Was Created
                                        </v-alert>
                                </v-flex>
                            </v-layout>

                        </v-card-text>

                    </v-card>
            </v-flex>
        </v-layout>
    </v-container>

</template>
<script>
export default {
  data () {
    return {
      width: 300,
      dialog: false,
      propertyName: 'New Property',
      Location: 'Location',
      PropertyMap: '',
      serviceImage: '',
      serviceUpload: '',
      AboutProperty: '',
      UploadState: 0,
      show: false
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  watch: {
    uploading () {
      this.UploadState = this.$store.getters.uploadStatus
    }
  },
  methods: {
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onFilePiked (event) {
      const files = event.target.files
      let filename = files[0].name
      // Check If a valid file was selected by looking at the file extension
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please Select a valid Image')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.serviceImage = fileReader.result // This we can use in our image preview
      })
      fileReader.readAsDataURL(files[0])
      this.serviceUpload = files[0] // actual File
    },
    createNewService () {
      if (!this.serviceUpload) {
        alert('Sorry, All Services must have Images')
        this.$refs.fileInput.click()
      } else if (this.propertyName === 'New Menu Item' || this.propertyName === '') { alert('Sorry, Please Enter Service Name') } else if (this.Location === 'Describe Item' || this.Location === '') {
        alert('Please Describe your Item')
      } else {
        const newProperty = {
          name: this.propertyName,
          Location: this.Location,
          PropertyMap: this.PropertyMap,
          Image: this.serviceUpload,
          AboutProperty: this.AboutProperty
        }
        this.$store.dispatch('createNewProperty', newProperty)
      }
    }
  }
}
</script>
