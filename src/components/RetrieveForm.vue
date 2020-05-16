<template>
  <div class="q-gutter-lg">
    <div class="text-h4">Retrieve Booking</div>
    <q-input filled
             label="Mobile No."
             bg-color="white"
             type="tel"
             v-model="retrieve.contact"  prefix="+63" mask="### ### ####"
             fill-mask>
      <template v-slot:prepend>
        <q-icon name="contact_phone" />
      </template>
    </q-input>
    <q-input bg-color="white"
             v-model="retrieve.code"
             filled :type="isPwd ? 'password' : 'text'"
             label="Booking Code">
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-btn size="lg" color="primary" label="Retrieve" @click="handleRetrieve"></q-btn>
  </div>
</template>

<script>
export default {
  name: 'RetrieveForm',
  data () {
    return {
      retrieve: {
        contact: '',
        code: ''
      },
      isPwd: true
    }
  },
  methods: {
    handleRetrieve: function () {
      this.$router.push({ name: 'booking' })
    }
  }
}
</script>

<style scoped>

</style>
