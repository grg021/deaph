<template>
  <q-parallax :height="500"
              class="bg-blue-2">
    <div class="q-pa-md a-container">
      <div class="q-gutter-lg">
        <q-input filled
                 label="Mobile No."
                 bg-color="white"
                 v-model="appointment.contact"  prefix="+63" mask="### ### ####"
                 fill-mask>
          <template v-slot:prepend>
            <q-icon name="contact_phone" />
          </template>
        </q-input>
        <q-input bg-color="white" v-model="appointment.pin" filled :type="isPwd ? 'password' : 'text'" label="Pin Code">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <div class="text-center q-gutter-md">
      <q-btn size="lg" color="primary" label="Retrieve" @click="handleRetrieve"></q-btn>
          <br/>
      <q-btn color="grey-8" label="Back to Booking" outline @click="$router.push({ 'name': 'index' })" />
        </div>
      </div>
    </div>
  </q-parallax>
</template>

<script>
export default {
  name: 'Retrieve',
  data () {
    return {
      isPwd: true,
      appointment: {
        contact: '',
        pin: ''
      }
    }
  },
  methods: {
    handleRetrieve: function () {
      this.$q.notify({
        type: 'positive',
        position: 'top',
        progress: true,
        message: 'This is a "positive" type notification.'
      })
    }
  }
}
</script>

<style scoped>

</style>
