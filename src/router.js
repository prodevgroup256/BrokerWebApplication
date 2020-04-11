import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Sigin from './components/ManageSite/SignIn.vue'
import Properties from './components/ManageSite/Properties.vue'
import newProperty from './components/ManageSite/newProperty.vue'
import newUnit from './components/ManageSite/newUnit.vue'
import seeProperty from './components/client/seeProperty.vue'
import PropertyGallery from './components/ManageSite/PropertyGallery.vue'
import Bookings from './components/ManageSite/Bookings.vue'
import UpdateProperty from './components/ManageSite/UpdatePropertyInfo.vue'
import CompanyPage from './components/ManageSite/Company.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/SignIn',
      name: 'Login',
      component: Sigin
    },
    {
      path: '/Properties',
      name: 'Properties',
      component: Properties
    },
    {
      path: '/CreateProperty',
      name: 'CreateNewProperty',
      component: newProperty
    },
    {
      path: '/NewUnit/:propertyId',
      props: true,
      name: 'NewUnit',
      component: newUnit
    },
    {
      path: '/ViewProperty/:propertyId',
      props: true,
      name: 'ViewProperty',
      component: seeProperty
    },
    {
      path: '/AddGallery/:propertyId',
      props: true,
      name: 'AddGallery',
      component: PropertyGallery
    },
    {
      path: '/UpdateProperty/:propertyId',
      props: true,
      name: 'UpdateProperty',
      component: UpdateProperty
    },
    {
      path: '/Booking',
      name: 'AddGallery',
      component: Bookings
    },
    {
      path: '/CompanyProfile',
      name: 'CompanyProfile',
      component: CompanyPage
    }
  ]
})
