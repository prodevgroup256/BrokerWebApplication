<template>
    <v-layout row>
    <v-flex xs12 sm12s>

      <v-card>
        <v-toolbar color="teal" dark>
          <v-toolbar-side-icon></v-toolbar-side-icon>

          <v-toolbar-title>Settings{{Reservasions}}</v-toolbar-title>
        </v-toolbar>

        <v-list
          subheader
          two-line
        >
          <v-subheader>Client Bookings</v-subheader>

          <v-list-tile>
            <v-list-tile-action>
              <v-checkbox></v-checkbox>
            </v-list-tile-action>

            <v-list-tile-content v-for="Reserve in Reservasions" :key="Reserve.id">
              <v-list-tile-title>{{ Reserve.Name }}</v-list-tile-title>
              <v-list-tile-sub-title>Allow notifications</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data: () => ({
  }),
  computed: {
    Reservasions () {
      return this.$store.allBookings
    }
  }
}
</script>
