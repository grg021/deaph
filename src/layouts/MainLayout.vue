<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white text-primary">
      <q-toolbar>

        <q-toolbar-title class="text-center">
          <q-icon name="event" />
          {{ company.name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
      <div class="text-center q-pa-md">
        Powered by <a href="https://dghsolution.com" target="_blank">DGHSolution</a>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'About Us',
          caption: 'dghsolution.com',
          icon: 'public',
          link: 'https://dghsolution.com'
        }
      ]
    }
  },
  props: ['cslug'],
  computed: {
    ...mapGetters(['company'])
  },
  created () {
    this.$q.loading.show()
  },
  mounted () {
    this.$store.dispatch('company/getData', this.cslug)
      .then(() => {
        this.$q.loading.hide()
      })
      .catch(() => {
        this.$q.loading.hide()
        this.$router.push('/')
      })
  }
}
</script>
