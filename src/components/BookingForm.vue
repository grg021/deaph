<template>
  <q-stepper
    v-model="step"
    ref="stepper"
    contracted
    color="primary"
    animated
    flat
  >
    <q-step
      :name="1"
      title="Date and Time"
      icon="event"
      :done="step > 1"
    >
      <div class="q-gutter-md">
        <q-input filled bg-color="grey-2"
                 ref="date"
                 v-model="appointment.date"
                 label="Pick a Date"
                 mask="date"
                 :rules="['date', val => !!val || 'Please pick a date']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="appointment.date"
                        @input="() => $refs.qDateProxy.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select filled
                  v-show="branches.length > 1"
                  label="Branch"
                  ref="branch"
                  :rules="[val => !!val || 'Please select a branch']"
                  v-model="appointment.branch"
                  :options="branches"
                  :option-value="(item) => item === null ? null : item.id"
                  :option-label="(item) => item === null ? null : item.name"
        >
          <template v-slot:prepend>
            <q-icon name="store" />
          </template>
        </q-select>
        <q-select
          filled
          label="Time"
          ref="timeslot"
          :rules="[val => !!val || 'Please pick a time']"
          lazy-rules="ondemand"
          v-model="appointment.timeslot"
          :options="timeslots"
          :option-value="opt => Object(opt) === opt && 'time' in opt ? opt.time : null"
          :option-label="opt => Object(opt) === opt && 'time' in opt ? opt.time : ''"
          :option-disable="opt => Object(opt) === opt ? opt.available !== true : true"
          v-if="timeslots.length"
        >
          <template v-slot:prepend>
            <q-icon name="schedule" />
          </template>
        </q-select>
        <q-banner v-else inline-actions class="bg-orange text-white">
          <q-icon name="info" />
          No availability. Check other date.
        </q-banner>
      </div>
    </q-step>

    <q-step
      :name="2"
      title="User Information"
      icon="account_circle"
      :done="step > 2"
    >
      <div class="q-gutter-md">
        <q-input label="Name"
                 ref="cname"
                 :rules="[val => !!val || 'Please enter name']"
                 bg-color="grey-2"
                 filled
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
    </q-step>

    <q-step
      :name="3"
      title="Verify"
      icon="verified_user"
    >
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
                 v-model="appointment.code">
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
        <div>
          Didn't receive the verification code?<br/>
          <q-btn outline size="sm"
                 label="Re-send SMS"
                 @click="handleResend"
                 :disable="!resend_enabled"
                 :loading="b_loading"/>
        </div>
      </div>
    </q-step>

    <template v-slot:navigation>
      <q-separator class="q-mb-md" />
      <q-stepper-navigation>
        <q-btn @click="nextStep()"
               color="primary"
               :loading="b_loading"
               :label="step === 3 ? 'Finish' : 'Continue'" />
        <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
      </q-stepper-navigation>
    </template>
    <template v-slot:message>
      <q-banner v-if="step === 1" class="text-dark bg-blue-1 q-px-lg">
        <div class="text-weight-medium text-h5">Choose a Date & Time</div>
      </q-banner>
      <q-banner v-else-if="step === 2" class="text-dark bg-amber-1 q-px-lg">
        <div class="text-weight-medium text-h5">Contact Information</div>
        <div class="text-body1"><span>{{ dateFormat(appointment.date) }}</span> @ <span>{{ appointment.timeslot.time }}</span></div>
      </q-banner>
      <q-banner v-else-if="step === 3" class="bg-cyan-1 text-dark q-px-lg">
        <div class="text-weight-medium text-h5">Verify Appointment</div>
        <div class="text-body1"><span>{{ dateFormat(appointment.date) }}</span> @ <span>{{ appointment.timeslot.time }}</span></div>
        <div class="text-body1"><span>{{ appointment.name }}</span>&nbsp;<span>(+63 {{ appointment.sms }})</span></div>
      </q-banner>
      <q-banner v-else class="bg-blue-8 text-white q-px-lg">
        Contact Support
      </q-banner>
    </template>
  </q-stepper>
</template>

<script>
import { UtilityMixin } from '../mixins/UtilityMixin'
import { mapGetters } from 'vuex'
import Booking from '../apis/booking'
import moment from 'moment'
export default {
  name: 'BookingForm',
  mixins: [UtilityMixin],
  props: ['cslug'],
  data () {
    return {
      b_loading: false,
      step: 1,
      resend_enabled: false,
      timeout: null,
      appointment: {
        id: 0,
        cslug: this.cslug,
        date: moment().add(1, 'day').format('YYYY/MM/DD'),
        name: '',
        sms: '',
        branch: '',
        timeslot: '',
        verify: 'sms',
        code: '',
        pin: '',
        g_token: '',
        contact: '',
        is_trusted: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      branches: 'company/getBranches',
      timeslots: 'company/getTimeSlots',
      initBranch: 'company/getInitBranch'
    }),
    sel_date () {
      return this.appointment.date
    },
    sel_branch () {
      return this.appointment.branch
    }
  },
  methods: {
    updateTimeSlots () {
      if (this.appointment.branch === '' || this.appointment.date === '') {
        return false
      }
      const params = {
        params: {
          branch_id: this.appointment.branch.id,
          date: this.appointment.date
        }
      }
      this.$store.dispatch('company/getTimeSlots', params)
        .then(() => {
          this.appointment.timeslot = ''
          this.$refs.timeslot.resetValidation()
        })
    },
    async nextStep () {
      this.scrollToElement('step_1')
      if (this.step === 1) {
        this.$refs.date.validate()
        this.$refs.branch.validate()
        if (this.$refs.date.hasError || this.$refs.branch.hasError) {
          return false
        }
        this.$refs.timeslot.validate()
        if (this.$refs.timeslot.hasError) {
          return false
        }
        this.$refs.stepper.next()
        return false
      }
      if (this.step === 2) {
        this.$refs.cname.validate()
        this.$refs.sms.validate()
        if (this.$refs.cname.hasError || this.$refs.sms.hasError) {
          return false
        }
        this.b_loading = true
        await this.$recaptchaLoaded()
        this.appointment.g_token = await this.$recaptcha('verify')
        Booking
          .verify(this.appointment)
          .then(res => {
            const { data } = res.data
            this.b_loading = false
            this.appointment.contact = data.contact
            this.appointment.id = data.id
            this.appointment.is_trusted = data.is_trusted
            this.$refs.stepper.next()
            if (!data.is_trusted) {
              this.$q.notify({
                type: 'info',
                position: 'top',
                progress: true,
                message: 'Verification code sent.'
              })
              const self = this
              this.timeout = setTimeout(function () {
                self.resend_enabled = true
              }, 30000)
            }
            return false
          })
          .catch(err => {
            this.b_loading = false
            if (err.response.status === 405 || err.response.status === 422) {
              this.$q.notify({
                type: 'negative',
                icon: 'info',
                position: 'top',
                progress: true,
                message: err.response.data.message
              })
            } else {
              this.$q.notify({
                type: 'negative',
                icon: 'info',
                position: 'top',
                progress: true,
                message: 'Something went wrong. Please contact support.'
              })
            }
            return false
          })
      }
      if (this.step === 3) {
        if (!this.appointment.is_trusted) {
          this.$refs.code.validate()
          if (this.$refs.code.hasError) {
            return false
          }
        } else {
          this.appointment.code = 'TOKEN'
        }
        this.b_loading = true
        await this.$recaptchaLoaded()
        this.appointment.g_token = await this.$recaptcha('book')
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
          })
          .catch(err => {
            this.b_loading = false
            if (err.response.status === 405 || err.response.status === 422) {
              this.$q.notify({
                type: 'negative',
                icon: 'info',
                position: 'top',
                progress: true,
                message: err.response.data.message
              })
            } else {
              this.$q.notify({
                type: 'negative',
                icon: 'info',
                position: 'top',
                progress: true,
                message: 'Something went wrong. Please contact support.'
              })
            }
          })
      }
    },
    async handleResend () {
      await this.$recaptchaLoaded()
      this.appointment.g_token = await this.$recaptcha('resend')
      this.b_loading = true
      Booking
        .resend(this.appointment)
        .then(() => {
          this.b_loading = false
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
  watch: {
    sel_date: {
      handler (val) {
        this.updateTimeSlots()
      }
    },
    sel_branch: {
      handler (val) {
        this.updateTimeSlots()
      }
    },
    branches () {
      if (this.branches.length === 1) {
        this.appointment.branch = this.branches[0]
      }
    }
  },
  beforeDestroy () {
    this.timeout = null
  }
}
</script>

<style scoped>

</style>
