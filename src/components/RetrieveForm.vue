<template>
  <div class="q-gutter-lg">
    <div class="text-h4">Retrieve Booking</div>
    <q-input filled
             label="Mobile No."
             bg-color="white"
             type="tel"
             ref="contact"
             maxlength="10"
             :rules="[
                           val => !!val || 'Please enter a mobile no.',
                           val => val.length === 10 || 'Please enter a valid mobile no.',
                         ]"
             v-model="retrieve.contact"  prefix="+63">
      <template v-slot:prepend>
        <q-icon name="contact_phone" />
      </template>
    </q-input>
    <q-input bg-color="white"
             v-model="retrieve.code"
             ref="code"
             :rules="[val => !!val || 'Please enter booking no.',]"
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
    <q-btn size="lg" :loading="b_loading" color="primary" label="Retrieve" @click="handleRetrieve"></q-btn>
  </div>
</template>

<script>
import Booking from '../apis/booking'
export default {
  name: 'RetrieveForm',
  data () {
    return {
      retrieve: {
        contact: '',
        code: '',
        g_token: ''
      },
      isPwd: true,
      b_loading: false
    }
  },
  methods: {
    async handleRetrieve () {
      this.$refs.contact.validate()
      this.$refs.code.validate()
      if (this.$refs.contact.hasError || this.$refs.code.hasError) {
        return false
      }
      this.b_loading = true
      await this.$recaptchaLoaded()
      this.retrieve.g_token = await this.$recaptcha('retrieve')
      Booking.retrieve(this.retrieve)
        .then(res => {
          this.b_loading = false
          this.$router.push({
            name: 'booking',
            params: {
              cslug: this.$store.getters['company/getSlug'],
              uuid: res.data.data.uuid
            }
          })
        })
        .catch(() => {
          this.b_loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
