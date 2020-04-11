<template>

    <v-container>
        <v-layout row>

            <v-flex xs12 sm12 class="mt-5">
                <h1>{{ propertyDetails.name }} Gallery

                    <v-spacer></v-spacer>
               <v-btn @click="loadGallery" dark class="blue">VIEW ALL</v-btn>

               <v-btn color="red lighten-2" dark v-on="on" @click="dialog=true"> ADD</v-btn>
               </h1>

                    <v-flex xs12 class="mt-4">
                    <v-data-table expand :headers="headers" :items="myPropertyGallery" class="elevation-1">
                    <template  v-slot:items="props" class="mb-2">
                        <td>
                        <v-card-media :src="props.item.Image" contain width="190px" height="130px"></v-card-media>
                        </td>
                        <td class="text-xs-left">
                        <v-btn fab small class="red" dark @click="DropImage(props.item.Id)" ><v-icon>delete</v-icon></v-btn>
                        </td>
                    </template>
                    </v-data-table>
                </v-flex>
            </v-flex>

            <!-- Dialog -->
            <v-dialog v-model="dialog" width="500" v-if="dialog">
                <v-card>

                    <v-card-text>
                        <v-img :src="serviceImage" aspect-ratio="1.7"></v-img>
                                    <v-card-title class=" text-sm-center">
                                        <div class="title font-weight-regular grey--text">{{ propertyDetails.name }}
                                        <v-divider></v-divider>
                                        </div>

                                    </v-card-title>
                                    <v-card-text>
                                        <v-layout row wrap>
                                        <v-flex xs12 class="ml-2">
                                            <v-layout row>
                                                    <v-flex xs12 class="text-sm-center">

                                                        <v-btn small dark bottom left color="pink" top right fab @click="onPickFile"><v-icon>add</v-icon></v-btn>

                                                    </v-flex>
                                            </v-layout>
                                            </v-flex>

                                            <v-flex xs12>
                                                <v-form @submit.prevent="createNewService">
                                                    <v-layout row>
                                                        <v-flex xs12>
                                                            <input type="file" ref="fileInput" @change="onFilePiked" accept="image/*" style="display:none;">
                                                        </v-flex>
                                                    </v-layout>

                                                    <v-flex xs12 class="text-sm-right">
                                                        <v-btn color="pink" dark type="submit">Upload</v-btn>
                                                        <br>
                                                        <v-progress-linear UploadState v-if="UploadState !=0"></v-progress-linear>
                                                    </v-flex>

                                                </v-form>
                                            </v-flex>

                                        </v-layout>

                                        <v-layout row>
                                            <v-flex xs12>
                                                <v-progress-linear v-if="loading" color="purple" :indeterminate="true"></v-progress-linear>
                                                <v-alert v-model="show" :type="type"  class="mb-4">
                                                    Success Property Was Created
                                                    </v-alert>
                                            </v-flex>
                                        </v-layout>

                                    </v-card-text>

                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        flat
                        @click="dialog = false"
                    >
                        CLOSE
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- Close Dialog -->

        </v-layout>
    </v-container>

</template>
<script>
import * as firebase from 'firebase'

export default {
  props: ['propertyId'],
  data () {
    return {
      PropertyId: this.propertyId,
      width: 300,
      dialog: false,
      serviceImage: '',
      serviceUpload: '',
      UploadState: 0,
      show: false,
      myPropertyGallery: [],
      headers: [
        { text: '', align: 'left', value: 'Image' },
        { text: 'DELETE', align: 'left', value: 'Description' }
      ]
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    propertyDetails () {
      return this.$store.getters.propertyDetails(this.propertyId)
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
      this.serviceUpload = files[0]// actual File
    },
    createNewService () {
      if (!this.serviceUpload) {
        alert('Sorry, Please Add An Image')
        this.$refs.fileInput.click()
      } else if (this.propertyName === 'New Menu Item' || this.propertyName === '') {
        alert('Sorry, Please Enter Service Name')
      } else if (this.Location === 'Describe Item' || this.Location === '') {
        alert('Please Describe your Item')
      } else {
        const newGalleryImage = {
          Image: this.serviceUpload,
          propertyId: this.PropertyId,
          documentId: 'none'
        }

        console.log(newGalleryImage)
        this.$store.dispatch('addToGallery', newGalleryImage)
        this.serviceUpload = ''
      }
    },
    loadGallery () {
      var PropGallery = []
      firebase.firestore().collection('Gallery')
        .where('PropertyId', '==', this.propertyId)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(Img => {
            PropGallery.push({
              Image: Img.data().Image,
              Id: Img.id
            })
            // console.log({Image: Img.data().Image, Property: Img.data().PropertyId})
          })
        })
      console.log(PropGallery)

      this.myPropertyGallery = PropGallery
    },
    DropImage (ImgRef) {
      var ImageRef = firebase.firestore().collection('Gallery').doc(ImgRef)

      var AskUser = confirm('Are You Sure You Want To Delete Image?')

      if (AskUser === true) {
        ImageRef.delete()
      }
    }
  }
}
</script>
