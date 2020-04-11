import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import * as firebase from 'firebase'
import router from './router'
import store from './store'
// import './registerServiceWorker'
import wb from './registerServiceWorker'
// import mail from 'mail'

Vue.prototype.$workbox = wb

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyDi8EMttZ3gGNxdmb1F6MWTLcvdddB-hzY',
      authDomain: 'broker-property-management.firebaseapp.com',
      databaseURL: 'https://broker-property-management.firebaseio.com',
      projectId: 'broker-property-management',
      storageBucket: 'broker-property-management.appspot.com',
      messagingSenderId: '530468518650',
      appId: '1:530468518650:web:f46eb1fcef6ea9ce6ba743',
      measurementId: 'G-60T2E4Y9RL'
    })
    // Enable Offline Data access
    firebase.firestore().settings({
      cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    })
    firebase.firestore().enablePersistence()

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$router.push('/Properties')
      } else {
        this.$router.push('/')
      }
    })
    this.$store.dispatch('allUnits')
    this.$store.dispatch('getCompanyInfo')
    this.$store.dispatch('allProperties')
    this.$store.dispatch('getGallery')
    this.$store.dispatch('getHomeGallery')
    this.$store.dispatch('getReservasions')
  },
  render: h => h(App)
}).$mount('#app')
