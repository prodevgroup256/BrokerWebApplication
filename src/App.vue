<template>
  <v-app>
  <v-navigation-drawer class="red darken-3" dark temporary app v-model="sideNav">
    <v-list>
      <v-list-tile
        v-for="item in routes" :key="item.title" router :to="item.link">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title light>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="userIsAuthenticated" @click="onLogOut">
        <v-list-tile-action>
          <v-icon>exit_to_app</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>LOGOUT</v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>

    <v-toolbar  fixed dense clipped-left app dark class="red darken-3">
    <v-toolbar-side-icon class="show-sm-and-down hidden-md-and-up" @click.native.stop="sideNav = !sideNav"></v-toolbar-side-icon>
    <v-toolbar-title>
    <router-link to="/" tag="span" style="cursor: pointer">
        {{ companyBio.Name }}
    </router-link>
    <span></span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn v-for="item in routes" :key="item.title" router :to="item.link" flat><v-icon left>{{ item.icon }}</v-icon> {{ item.title }}</v-btn>
      <v-btn v-if="UserInfo" @click="onLogOut" flat><v-icon left>exit_to_app</v-icon>LOGOUT</v-btn>

    </v-toolbar-items>
  </v-toolbar>

    <v-content>
      <v-container fluid>
        <router-view class="mainPadding"></router-view>
      </v-container>

      <v-footer class="mt-3" v-bind="localAttrs" :padless="padless">
          <v-card flat tile width="100%" class="red darken-3 text-center">
            <v-card-text class="white--text text-center">
              {{ new Date().getFullYear() }} — <strong>{{companyBio.Name}}</strong>
            </v-card-text>
          </v-card>
        </v-footer>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      userIsAuthenticated: true,
      dialog: false,
      Clientname: '',
      ClientEmail: '',
      sideNav: false,
      icons: [
        'mdi-home',
        'mdi-email',
        'mdi-calendar',
        'mdi-delete'
      ]
    }
  },
  computed: {
    companyBio () {
      return this.$store.getters.getCompanyDetails[0]
    },
    routes () {
      let items = [
        { link: '/SignIn', title: 'SignIn', icon: 'supervisor_account' }
      ]

      if (this.UserInfo) {
        items = [
          { link: '/Properties', title: 'PROPERTIES', icon: 'filter_list' }
        ]
      }
      return items
    },
    UserInfo () {
      return this.$store.getters.loggedInUser !== null && this.$store.getters.loggedInUser !== undefined
    }
  },
  created () {
    if (this.$workbox) {
      this.$workbox.addEventListener('waiting', () => {
        this.showUpgradeUI = true
      })
    }
  },
  methods: {
    async accept () {
      this.showUpgradeUI = false
      await this.$workbox.messageSW({ type: 'SKIP_WAITING' })
    },
    onLogOut () {
      console.log('Logging User Out')
      this.$store.dispatch('Logout')
      this.routes = [ { link: '/SignIn', title: 'SignIn', icon: 'supervisor_account' } ]
    }
  },
  watch: {
    UserInfo (User) {
      if (this.UserInfo == null || undefined) {
        this.routes = [ { link: '/SignIn', title: 'SignIn', icon: 'supervisor_account' } ]
        this.$router.push('/')
      }
    }
  }
}
</script>
<style>
.text-center{
  text-align: center;
  font-weight: 100;
}
  .mainPadding{
    padding: 0px !important;
    margin-top: 0px !important;
  }
</style>
