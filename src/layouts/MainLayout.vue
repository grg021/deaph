<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white text-primary">
      <q-toolbar>

        <q-toolbar-title class="text-center">
          <q-icon name="event" />
          DEA
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
  }
}
</script>
