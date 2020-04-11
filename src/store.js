import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
// import mail from 'mail'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    companyInfo: {
      id: 1,
      Bio: 'Welcome',
      Name: 'BrokerUg',
      Mobile: '+256780101601',
      Introduction: 'Welcome'
    },
    properties: [],
    propertyUnits: [],
    UnitsGallery: [],
    homeGalleryList: [],
    Reservasions: [],
    user: null,
    loading: false,
    ServerError: null,
    errorMessage: '',
    progress: 0
  },
  mutations: {
    setHomeGallery (state, payload) {
      state.homeGalleryList = payload
    },
    setReservasions (state, payload) {
      state.Reservasions = payload
    },
    setGallery (state, payload) {
      state.UnitsGallery = payload
    },
    setUnits (state, payload) {
      state.propertyUnits = payload
    },
    selLoading (state, payload) {
      state.loading = payload
    },
    setUploading (state, payload) {
      state.progress = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setCompanyInfo (state, payload) {
      state.companyInfo = payload
    },
    setProperties (state, payload) {
      state.properties = payload
    },
    setUser (state, payload) {
      state.user = payload
    },
    setError (state, payload) {
      state.ServerError = payload
    }
  },
  actions: {
    getReservasions ({ commit }) {
      commit('selLoading', true)
      var Reservations = []
      firebase.firestore().collection('Reservasions')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(Reser => {
            Reservations.push({
              id: Reser.id,
              Name: Reser.data().Name,
              Mobile: Reser.data().Mobile,
              Email: Reser.data().Email,
              Guests: Reser.data().Guests,
              CheckIn: Reser.data().CheckIn,
              CheckOut: Reser.data().CheckOut,
              Message: Reser.data().Message,
              Seen: Reser.data().Seen,
              Set: Reser.data().Sent
            })
          })

          commit('setReservasions', Reservations)
          commit('selLoading', false)
        })
    },
    getCompanyInfo ({ commit }) {
      commit('selLoading', true)
      var info = []
      firebase.firestore().collection('CompanyDetails')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(Company => {
            info.push({
              id: Company.id,
              Bio: Company.data().Bio,
              Name: Company.data().Name,
              Mobile: Company.data().Mobile,
              Introduction: Company.data().Introduction
            })
          })
        })
      commit('setCompanyInfo', info)
      commit('selLoading', false)
    },
    getGallery ({ commit }) {
      commit('selLoading', true)
      var Gallery = []

      firebase.firestore().collection('Gallery')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(Unit => {
            Gallery.push({
              id: Unit.id,
              unitId: Unit.data().unitId,
              Image: Unit.data().Image,
              filename: Unit.data().filename,
              PropertyId: Unit.data().PropertyId
            })
          })
        })

      commit('setGallery', Gallery)
      commit('selLoading', false)
    },
    getHomeGallery ({ commit }) {
      commit('selLoading', true)
      var Gallery = []

      firebase.firestore().collection('Gallery')
        .limit(6)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(Unit => {
            Gallery.push({
              id: Unit.id,
              unitId: Unit.data().unitId,
              Image: Unit.data().Image,
              filename: Unit.data().filename,
              PropertyId: Unit.data().PropertyId
            })
          })
        })

      commit('setHomeGallery', Gallery)
      commit('selLoading', false)
    },
    allProperties ({ commit }) {
      commit('selLoading', true)
      var properties = []

      firebase.firestore().collection('properties')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(Property => {
            properties.push({
              id: Property.id,
              name: Property.data().name,
              location: Property.data().location,
              filename: Property.data().filename,
              PropertyMap: Property.data().PropertyMap,
              Image: Property.data().Image,
              AboutProperty: Property.data().AboutProperty
            })
          })
        })

      commit('setProperties', properties)
      commit('selLoading', false)
    },
    allUnits ({ commit }) {
      commit('selLoading', true)
      var propertiesUnits = []

      firebase.firestore().collection('propertyUnits')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(Property => {
            propertiesUnits.push({
              id: Property.id,
              Unitname: Property.data().Unitname,
              UnitType: Property.data().UnitType,
              price: Property.data().price,
              Description: Property.data().Description,
              filename: Property.data().filename,
              Image: Property.data().Image,
              PropertyId: Property.data().PropertyId,
              Gallery: Property.data().Gallery
            })
          })
        })

      commit('setUnits', propertiesUnits)
      commit('selLoading', false)
    },
    autoSignIn ({ commit }, payload) {
      commit('setUser', { id: payload.uid, email: payload.email })
    },
    signUserIn ({ commit }, payload) {
      commit('setError', null)
      commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            this.$router.push('/Properties')
            commit('setLoading', false)
            commit('setError', null)
          }
        )
        .catch(error => {
          commit('setLoading', false)
          commit('setError', error.message)
        }
        )
    },
    Logout ({ commit }) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    createNewProperty ({ commit, state }, payload) {
      commit('setLoading', true)
      const newService = {
        name: payload.name,
        PropertyMap: payload.PropertyMap,
        location: payload.Location,
        AboutProperty: payload.AboutProperty
      }
      var dropName = ''
      // Check If Service Exists
      firebase.firestore().collection('properties')
        .where('name', '==', payload.name)
        .where('location', '==', payload.Location)
        .get()
        .then(service => {
          if (service.size === 0) {
            let key
            firebase.firestore().collection('properties')
              .add(newService)
              .then((data) => {
                key = data.id
                return key
              }).then(key => {
                const filename = payload.Image.name
                const ext = filename.slice(filename.lastIndexOf('.'))
                dropName = key + '.' + ext

                var uploadTask = firebase.storage().ref('properties/' + key + '.' + ext).put(payload.Image)
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                  function (snapshot) {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    commit('setUploading', progress)
                    switch (snapshot.state) {
                      case firebase.storage.TaskState.PAUSED: // or 'paused'
                        break
                      case firebase.storage.TaskState.RUNNING: // or 'running'
                        break
                    }
                  },
                  function () {
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                      firebase.firestore().collection('properties').doc(key).update({ Image: downloadURL, filename: dropName })
                        .then(() => {
                          state.properties.push({
                            id: key,
                            Image: downloadURL,
                            filename: dropName,
                            ...newService
                          })
                          commit('setLoading', false)
                          this.$router.push('/Properties')
                        })
                    })
                  })
              })
          }
        })
    },
    addToGallery ({ commit, getters, state }, payload) {
      commit('setLoading', true)
      var key
      var mpropertyId = payload.propertyId

      const filename = payload.Image.name
      const ext = filename.slice(filename.lastIndexOf('.'))

      firebase.firestore().collection('Gallery').add({ PropertyId: mpropertyId })
        .then((newGallery) => {
          key = newGallery.id
          var uploadTask = firebase.storage().ref('Gallery/' + key + '.' + ext).put(payload.Image)
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            function (snapshot) {
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              commit('setUploading', progress)
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  break
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  break
              }
            },
            function () {
              uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                firebase.firestore().collection('Gallery').doc(key).update({ Image: downloadURL })
                  .then((company) => {
                    var NewGalery = { Image: downloadURL, PropertyId: mpropertyId }
                    state.UnitsGallery.push({
                      id: key,
                      ...NewGalery
                    })
                    commit('setLoading', false)
                  })
              })
            })
        })
    },
    createNewPropertyUnit ({ commit, getters, state }, payload) {
      commit('setLoading', true)
      const newService = {
        Unitname: payload.Unitname,
        UnitType: payload.UnitType,
        price: payload.price,
        Description: payload.Description,
        ImageSize: payload.ImageSize,
        PropertyId: payload.PropertyId
      }
      var dropName = ''
      // Check If Service Exists
      firebase.firestore().collection('propertyUnits')
        .where('Unitname', '==', payload.Unitname)
        .where('UnitType', '==', payload.UnitType)
        .get()
        .then(service => {
          if (service.size === 0) {
            let key

            firebase.firestore().collection('propertyUnits')
              .add(newService)
              .then((data) => {
                key = data.id
                return key
              }).then(key => {
                const filename = payload.Image.name
                const ext = filename.slice(filename.lastIndexOf('.'))
                dropName = key + '.' + ext

                var uploadTask = firebase.storage().ref('units/' + key + '.' + ext).put(payload.Image)
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                  function (snapshot) {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    commit('setUploading', progress)
                    switch (snapshot.state) {
                      case firebase.storage.TaskState.PAUSED: // or 'paused'
                        break
                      case firebase.storage.TaskState.RUNNING: // or 'running'
                        break
                    }
                  },
                  function () {
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                      firebase.firestore().collection('propertyUnits').doc(key).update({ Image: downloadURL, filename: dropName })
                        .then(() => {
                          state.propertyUnits.push({
                            id: key,
                            Image: downloadURL,
                            filename: dropName,
                            ...newService
                          })
                          commit('setLoading', false)
                          // this.$router.push('/propertyUnits/')
                        })
                    })
                  })
              })
          } else { // If Service Exists

          }
        })
    },
    dropProperty ({ commit }, payload) {
      commit('setLoading', true)
      var PropertyId = payload.documentId
      var ImageUrl = payload.ImageUrl

      // Drop Image
      var imageRef = firebase.storage().ref('properties').child(ImageUrl)
      var dbDocRef = firebase.firestore().collection('properties').doc(PropertyId)

      imageRef.delete().then(function () {
        dbDocRef.delete()
          .then(function () {
            commit('setLoading', false)
            this.$router.push('/Properties')
            this.$store.dispatch('allProperties')
          })
      })
    },
    dropUnit ({ commit, getters, state }, payload) {
      commit('setLoading', true)
      var PropertyId = payload.documentId
      var ImageUrl = payload.ImageUrl

      // Drop Image
      var imageRef = firebase.storage().ref('units').child(ImageUrl)
      var dbDocRef = firebase.firestore().collection('propertyUnits').doc(PropertyId)

      imageRef.delete().then(function () {
        dbDocRef.delete()
          .then(function () {
            commit('setLoading', false)
          })
      })
    },
    MakeReservasion ({ commit, getters, state }, payload) {
      commit('setLoading', true)

      var NewBooking = {
        Name: payload.Name,
        Mobile: payload.Mobile,
        Email: payload.Email,
        Guests: payload.Guests,
        CheckIn: payload.CheckIn,
        CheckOut: payload.CheckOut,
        Message: payload.Message,
        Seen: 0,
        Sent: payload.Sent
      }

      firebase.firestore().collection('Reservasions')
        .add(NewBooking)
        .then((AddedBooking) => {
          state.Reservasions.push({
            id: AddedBooking.id,
            ...NewBooking
          })
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loggedInUser (state) {
      return state.user
    },
    getCompanyDetails (state) {
      return state.companyInfo
    },
    getAllProperties (state) {
      return state.properties
    },
    loading (state) {
      return state.loading
    },
    getLoadState (state) {
      return state.loading
    },
    uploadStatus (state) {
      return state.progress
    },
    getError (state) {
      return state.ServerError
    },
    allPropertyUnits (state) {
      return state.propertyUnits
    },
    propertyDetails (state) {
      return (PropId) => {
        return state.properties.find((Property) => {
          return Property.id === PropId
        })
      }
    },
    propertyRowList (state) {
      var All = state.propertyUnits
      var chunckSize = 3
      var propertiesArray = []
      for (var i = 0; i < All.length; i += chunckSize) {
        propertiesArray.push(All.slice(i, i + chunckSize))
      }
      return propertiesArray
    },
    getGallery (state) {
      return state.UnitsGallery
    },
    getPropertyGallery (state) {
      return (PropertyIdSelect) => {
        var myGallery = []
        var allGallery = state.homeGalleryList

        allGallery.forEach(ImageVie => {
          if (ImageVie.PropertyId === PropertyIdSelect) {
            myGallery.push(ImageVie)
          }
        })
        return myGallery
      }
    },
    firePropertyGallery (state) {
      return (PropertyId) => {
        var PropGallery = []
        firebase.firestore().collection('Gallery')
          .where('PropertyId', '==', PropertyId)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(Img => {
              PropGallery.push({
                Image: Img.data().Image,
                Id: Img.id
              })
            })
          })
        return PropGallery
      }
    },
    getHomeGallery (state) {
      return state.homeGalleryList
    },
    allBookings (state) {
      return state.Reservasions
    }
  }
})
