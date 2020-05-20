<template>
  <div class="q-gutter-md">
    <q-input label="Name"
             ref="cname"
             :rules="[val => !!val || 'Please enter name']"
             bg-color="grey-2"
             filled
             lazy-rules="ondemand"
             v-model="appointment.name">
      <template v-slot:prepend>
        <q-icon name="account_circle" />
      </template>
    </q-input>
    <q-input filled
             type="tel"
             ref="sms"
             :rules="[
                           val => !!val || 'Please enter a mobile no.',
                           val => val.length === 10 || 'Please enter a valid mobile no.',
                         ]"
             lazy-rules="ondemand"
             counter
             maxlength="10"
             bg-color="grey-2"
             v-model="appointment.sms"
             prefix="+63"
             hint="The verification code will be sent to this number."
             fill-mask>
    </q-input>
  </div>
</template>

<script>
import { Appointment } from 'src/forms/Appointment'
import Booking from 'src/apis/booking'

export default {
  name: 'BookingFormTwo',
  props: ['app'],
  data () {
    return {
      appointment: new Appointment()
    }
  },
  mounted () {
    this.appointment = new Appointment(this.app)
  },
  methods: {
    validate () {
      this.$refs.cname.validate()
      this.$refs.sms.validate()
      if (this.$refs.cname.hasError || this.$refs.sms.hasError) {
        return false
      }
      return true
    },
    async submit () {
      this.$q.loading.show()
      try {
        await this.$recaptchaLoaded()
        this.appointment.g_token = await this.$recaptcha('verify')
      } catch (e) {
        this.$q.loading.hide()
        return false
      }

      return new Promise((resolve, reject) => {
        Booking
          .verify(this.appointment)
          .then(res => {
            this.$q.loading.hide()
            const { data } = res.data
            this.$store.commit('booking/SET_APPOINTMENT', this.appointment)
            this.$store.commit('booking/SET_FORM_TWO', data)
            if (!data.is_trusted) {
              this.$q.notify({
                type: 'info',
                position: 'top',
                progress: true,
                message: 'Verification code sent.'
              })
            }
            resolve(res)
          })
          .catch(err => {
            this.$q.loading.hide()
            reject(err)
          })
      })
    }
  }
}
</script>

<style scoped>

</style>
