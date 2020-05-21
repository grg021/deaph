<template>
  <div class="q-gutter-lg" v-if="!appointment.is_trusted">
    <q-input filled
             label="Verification Code"
             ref="code"
             :rules="[
                   val => !!val || 'Please enter verification code',
                   val => val.length === 6 || 'Please enter a valid code',
                   ]"
             bg-color="grey-2"
             counter
             maxlength="6"
             lazy-rules="ondemand"
             v-model="appointment.code">
      <template v-slot:prepend>
        <q-icon name="lock" />
      </template>
    </q-input>
    <div class="text-right text-caption">
      Didn't receive the verification code?<br/>
      <q-btn outline size="sm"
             label="Re-send SMS"
             @click="handleResend()"
             :disable="!resend_enabled"/>
    </div>
  </div>
</template>

<script>
import Booking from 'src/apis/booking'
import { Appointment } from 'src/forms/Appointment'

export default {
  name: 'BookingFormThree',
  props: ['app'],
  data () {
    return {
      resend_enabled: false,
      timeout: null,
      appointment: new Appointment()
    }
  },
  mounted () {
    this.appointment = new Appointment(this.app)
    const self = this
    if (!this.appointment.is_trusted) {
      this.timeout = setTimeout(function () {
        self.resend_enabled = true
      }, 30000)
    }
  },
  methods: {
    async submit () {
      this.$q.loading.show()
      await this.$recaptchaLoaded()
      this.appointment.g_token = await this.$recaptcha('book')
      return new Promise((resolve, reject) => {
        Booking
          .submit(this.appointment)
          .then(res => {
            this.$q.notify({
              type: 'positive',
              icon: 'info',
              position: 'top',
              progress: true,
              message: 'Booking Submitted'
            })
            this.$router.push({
              name: 'booking',
              params: {
                cslug: this.$store.getters['company/getSlug'],
                uuid: res.data.data.uuid
              }
            })
            this.$store.commit('booking/RESET_APPOINTMENT')
            this.$q.loading.hide()
            resolve()
          })
          .catch(() => {
            this.$q.loading.hide()
            reject()
          })
      })
    },
    validate () {
      if (!this.appointment.is_trusted) {
        this.$refs.code.validate()
        if (this.$refs.code.hasError) {
          return false
        }
      } else {
        this.appointment.code = 'TOKEN'
      }
      return true
    },
    async handleResend () {
      await this.$recaptchaLoaded()
      this.appointment.g_token = await this.$recaptcha('resend')
      this.$q.loading.show()
      Booking
        .resend(this.appointment)
        .then(() => {
          this.$q.loading.hide()
          this.$q.notify({
            type: 'info',
            position: 'top',
            progress: true,
            message: 'Verification code sent.'
          })
          this.resend_enabled = false
          const self = this
          this.timeout = setTimeout(function () {
            self.resend_enabled = true
          }, 30000)
        })
    }
  },
  beforeDestroy () {
    this.timeout = null
  }
}
</script>

<style scoped>

</style>
