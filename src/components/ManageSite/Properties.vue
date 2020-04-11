<template>
<v-container>

    <v-layout row wrap>
    <v-progress-linear v-if="loading" color="purple" :indeterminate="true"></v-progress-linear>
        <v-flex xs12 sm12> <h1>Properties </h1> </v-flex>
        <v-flex xs12 sm12 class="text-xs-center purpple--text text-sm-left">
              <v-breadcrumbs :items="links" divider="/"></v-breadcrumbs>
        </v-flex>

    </v-layout>
    <v-layout row wrap>
      <!-- Tarbular View -->
      <v-flex xs12 class="mt-4">
          <v-data-table expand :headers="headers" :items="AllProperties" class="elevation-1">
          <template  v-slot:items="props" class="mb-2">
              <td>
               <v-card-media :src="props.item.Image" contain width="190px" height="130px"></v-card-media>
            </td>
            <td class="text-xs-left">
              <div  :to="'/ViewProperty/'+props.item.id">{{ props.item.name }}
              </div>
            </td>
            <td> {{ props.item.location }} </td>
            <td class="text-xs-left">
                <v-btn fab small class="green" :to="'/AddGallery/'+props.item.id"  dark ><v-icon>add_photo_alternate</v-icon></v-btn>
            </td>
            <td class="text-xs-left">
              <v-btn color="pink" fab dark small :to="'/UpdateProperty/'+props.item.id"><v-icon>edit</v-icon>
              </v-btn>
              <!--<v-btn fab small class="blue" dark :to="'/NewUnit/'+props.item.id"><v-icon>arrow_forward</v-icon></v-btn>-->
            </td>
            <td class="text-xs-left">
              <v-btn fab small class="red" dark @click="dropProperty(props.item)"><v-icon>delete</v-icon></v-btn>
            </td>
          </template>
        </v-data-table>
      </v-flex>

<!-- Add Images -->
                    <v-dialog v-model="Addimages" max-width="800">
                            <v-card>
                            <v-img :src="serviceImage" aspect-ratio="2.1"></v-img>
                            <v-card-text>
                                <v-layout row wrap>
                                <v-flex xs12 class="ml-2">
                                    <v-layout row>
                                            <v-flex xs12 class="text-sm-center">
                                                <v-btn raised dark color="blue" @click="onPickFile"> Select Image</v-btn>
                                            </v-flex>
                                    </v-layout>
                                    </v-flex>

                                    <v-flex xs12>
                                        <v-form @submit.prevent="addToGallery">
                                            <v-layout row>
                                                <v-flex xs12>
                                                    <input type="file" ref="fileInput" @change="onFilePiked" accept="image/*" style="display:none;">
                                                </v-flex>
                                            </v-layout>

                                            <v-flex xs12 class="text-sm-right">
                                                <v-btn color="red" dark type="submit">Upload Image</v-btn>
                                                <br>
                                                <v-progress-linear UploadState v-if="UploadState !=0"></v-progress-linear>
                                            </v-flex>

                                        </v-form>
                                    </v-flex>

                                </v-layout>

                                <v-layout row>
                                    <v-flex xs12>
                                        <v-progress-linear v-if="loading" color="purple" :indeterminate="true"></v-progress-linear>

                                    </v-flex>
                                </v-layout>

                            </v-card-text>

                        </v-card>
                    </v-dialog>

                <!-- Close Images -->

    <!-- Edit Company Details model -->

        <v-dialog v-model="dialog" width="500">

          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>
              About Company
            </v-card-title>

            <v-card-text>

              <v-layout>

                <v-flex xs12 sm10>
                  <v-text-field
                  v-model="companyName"
                  auto-grow
                    label="Company Name"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm2>
                  <v-btn fab dark small class="grey"><v-icon>edit</v-icon></v-btn>
                </v-flex>

              </v-layout>

            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                flat
                @click="dialog = false"
              >
                I accept
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

  <!-- Close Company Details model -->
    </v-layout>

</v-container>
</template>

<script>
export default {
  props: ['id'],
  data () {
    return {
      dialog: false,
      headers: [
        { text: '', align: 'left', value: 'name' },
        { text: 'Property Name', align: 'left', value: 'Description' },
        { text: 'Location', align: 'left', value: 'Created' },
        { text: '+Image', align: 'left', value: 'Created' },
        { text: 'Add Unit', align: 'left', value: 'Created' },
        { text: 'Delete', align: 'left', value: 'Created' }
      ],
      Addimages: false,
      UploadState: 0,
      serviceUpload: '',
      links: [
        {
          text: 'Home',
          disabled: false,
          to: '/'
        },
        {
          text: 'Create Property',
          disabled: false,
          to: '/CreateProperty'
        }
      ],
      companyBio: '',
      companyTel: '',
      EditcompanyName: ''
    }
  },
  computed: {
    AllProperties () {
      return this.$store.getters.getAllProperties
    },
    loading () {
      return this.$store.getters.loading
    },
    aboutCompany () {
      return this.$store.getters.getCompanyDetails
    }
  },
  watch: {
    uploading () {
      this.UploadState = this.$store.getters.uploadStatus
    }
  },

  methods: {
    dropProperty (Property) {
      var askUser = confirm('Are You Sure You Want To Delete Property ' + Property.name)
      if (askUser === true) {
        this.$store.dispatch('dropProperty', { documentId: Property.id, ImageUrl: Property.filename })
      }
    },
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
      this.serviceUpload = files[0]// actual File
    }
  }
}
</script>
<style scoped>
</style>
