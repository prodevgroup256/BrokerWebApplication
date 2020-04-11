<template>
    <v-container>

        <v-layout row>
            <v-flex xs12 sm6 offset-sm3 class="mt-5">
                <v-card>
                    <v-container>
                        <form @submit.prevent="onSignin">
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field name="email" label="Email" id="email"
                                    v-model="email" type="email" required></v-text-field>
                                </v-flex>
                            </v-layout>

                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field name="password" label="Password" id="password"
                                    v-model="password" type="password" required></v-text-field>
                                </v-flex>
                            </v-layout>

                            <v-layout row>
                                <v-flex xs12>{{ SignInError }}
                                    <v-btn color="green" dark type="submit">Sign in<v-icon>arrow_right</v-icon></v-btn>

                                </v-flex>
                            </v-layout>

                        </form>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      show: true,
      border: 'left',
      coloredBorder: false,
      dismissible: false
    }
  },
  computed: {
    SignInError () {
      return this.$store.getError
    }
  },
  watch: {

  },
  methods: {
    onSignin () {
      if (this.email === '' || this.email == null) {
        alert('Please Enter an Email Address')
      } else if (this.password === '' || this.password === null) {
        alert('Please Enter an Email Address')
      }

      this.$store.dispatch('signUserIn', { email: this.email, password: this.password })
    }
  }
}
</script>
