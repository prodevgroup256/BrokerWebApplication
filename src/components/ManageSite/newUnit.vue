<template>

        <v-container>

            <v-layout row>
                <v-flex xs12 class="mt-5">
                <v-layout row>
                    <v-flex xs7>
                        <h1>Property Units</h1>
                    </v-flex>
                    <v-flex xs5 class="text-sm-right pr-4">
                        <v-btn fab dark small color="blue"> <v-icon dark @click.stop="dialog = true">add</v-icon> </v-btn>
                    </v-flex>
                </v-layout>

                <!-- Tarbular View -->
                <v-flex xs12 class="mt-4">
                    <v-data-table expand :headers="headers" :items="PropertyUnits" class="elevation-1">
                    <template  v-slot:items="props" class="mb-2">
                        <td v-if="props.item.PropertyId == propertySelected" @click="viewGallery(props.item.id)">
                        <v-card-media :src="props.item.Image" width="300px" height="130px"></v-card-media>
                        </td>
                        <td class="text-xs-left" v-if="props.item.PropertyId == propertySelected">
                        <div><h5 class="headline">{{ props.item.Unitname }}</h5></div>
                        </td>
                        <td v-if="props.item.PropertyId == propertySelected"> {{ props.item.price }} </td>
                        <td v-if="props.item.PropertyId == propertySelected"> {{ props.item.Description }} - {{ props.item.Gallery }} </td>
                        <td class="text-xs-left" v-if="props.item.PropertyId == propertySelected">
                        <v-btn fab class="green" @click.stop="Addimages = true" @click="setUnitId(props.item.id)" dark ><v-icon>add_photo_alternate</v-icon></v-btn>
                        </td>
                        <td class="text-xs-left" v-if="props.item.PropertyId == propertySelected">
                        <v-btn fab class="red" dark @click="dropPropertyUnit(props.item)"><v-icon>delete</v-icon></v-btn>
                        </td>
                    </template>
                    </v-data-table>
                </v-flex>

                <!-- Close Table -->

                    <!-- Create Product Model -->
                    <v-dialog v-model="dialog" max-width="800">
                            <v-card>
                            <v-card-title class="heading blue white--text"><h1>New Property Unit</h1></v-card-title>
                            <v-img :src="serviceImage" aspect-ratio="1.9"></v-img>
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
                                        <v-form @submit.prevent="createNewService">
                                            <v-layout row>
                                                <v-flex xs12>
                                                    <input type="file" ref="fileInput" @change="onFilePiked" accept="image/*" style="display:none;">
                                                </v-flex>
                                            </v-layout>

                                            <v-layout row>
                                                <v-flex xs12>
                                                    <v-text-field outline label="Unit Name" v-model="unitName" id="unitName" name="unitName"  auto-grow required></v-text-field>
                                                </v-flex>
                                            </v-layout>

                                            <v-layout row>
                                                <v-flex xs6 class="mr-1">
                                                    <v-select :items="items" v-model="unitType" id="unitType" name="unitType" label="Outline style" outlined></v-select>
                                                </v-flex>

                                                <v-flex xs6 class="ml-2">
                                                    <v-text-field outline label="Unit Cost Per Month" v-model="rentPerMonth" id="rentPerMonth" name="rentPerMonth"  auto-grow required></v-text-field>
                                                </v-flex>
                                            </v-layout>

                                            <v-layout row>
                                                <v-flex xs12>
                                                    <v-textarea outline label="Description" v-model="Description" id="Description" name="Description"  auto-grow required></v-textarea>
                                                </v-flex>
                                            </v-layout>

                                            <v-flex xs12 class="text-sm-right">
                                                <v-btn color="red" dark type="submit">Create Unit</v-btn>
                                                <br>{{UploadState}}
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

                        </v-card>
                    </v-dialog>
                <!-- Create -->

                <!-- Add Images -->
                    <v-dialog v-model="Addimages" max-width="800">
                            <v-card>
                            <v-img :src="serviceImage" aspect-ratio="1.7"></v-img>
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
                                        <v-alert v-model="show" :type="type"  class="mb-4">
                                            Success Property Was Created
                                            </v-alert>
                                    </v-flex>
                                </v-layout>

                            </v-card-text>

                        </v-card>
                    </v-dialog>

                <!-- Close Images -->

                <!-- Gallery Carusel -->
                    <v-dialog v-model="GalleryModal" max-width="700">

                    </v-dialog>

                <!-- Gallery -->

                </v-flex>
            </v-layout>
        </v-container>
</template>
<script>
export default {
  props: ['propertyId'],
  data () {
    return { headers: [
      { text: '', align: 'left', value: 'image' },
      { text: 'Unit Name', align: 'left', value: 'Description' },
      { text: 'Price', align: 'left', value: 'Created' },
      { text: 'Description', align: 'left', value: 'Created' },
      { text: 'Add Images', align: 'left', value: 'Created' },
      { text: 'Delete Unit', align: 'left', value: 'Created' }
    ],
    width: 300,
    dialog: false,
    Addimages: false,
    unitName: 'UNIT 1',
    unitToUpdate: '',
    Description: 'Description',
    rentPerMonth: '',
    unitType: '',
    items: ['Furnished', 'UnFurnished', 'Semi Furnished'],
    serviceImage: '',
    serviceUpload: '',
    UploadState: 0,
    show: false,
    GalleryModal: false,
    propertySelected: this.propertyId
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    PropertyUnits () {
      return this.$store.getters.allPropertyUnits
    },
    Gallery () {
      return this.$store.getters.getGallery
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
        alert('Sorry, All Services must have Images')
        this.$refs.fileInput.click()
      } else if (this.unitName === 'New Menu Item' || this.unitName === '') {
        alert('Sorry, Please Enter Service Name')
      } else if (this.Description === 'Describe Item' || this.Description === '') {
        alert('Please Describe your Item')
      } else {
        const newPropertyUnit = {
          Unitname: this.unitName,
          UnitType: this.unitType,
          price: this.rentPerMonth,
          Description: this.Description,
          Image: this.serviceUpload,
          ImageSize: this.serviceUpload.size / 1000000,
          PropertyId: this.propertySelected
        }

        console.log(newPropertyUnit)
        this.$store.dispatch('createNewPropertyUnit', newPropertyUnit)
      }
    },
    addToGallery () {
      const newPicture = {
        documentId: this.unitToUpdate,
        Image: this.serviceUpload,
        ImageSize: this.serviceUpload.size / 1000000,
        propertyId: this.propertySelected
      }
      console.log(newPicture)
      // this.$store.dispatch('addToGallery', newPicture)
    },
    dropPropertyUnit (Unit) {
      var askUser = confirm('Are You Sure You Want To Delete Property ' + Unit.UnitName)
      if (askUser === true) {
        this.$store.dispatch('dropUnit', { documentId: Unit.id, ImageUrl: Unit.filename })
      }
    },
    setUnitId (UnitId) {
      this.unitToUpdate = UnitId
    },
    viewGallery (UnitId) {
      this.unitToUpdate = UnitId
      this.GalleryModal = true
    }
  }
}
</script>
