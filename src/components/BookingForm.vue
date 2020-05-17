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
                 v-model="appointment.date"
                 label="Pick a Date"
                 mask="date" :rules="['date']">
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
                  label="Branch"
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
          No availability. Please try another date.
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
        <q-input label="Name" bg-color="grey-2" filled v-model="appointment.name">
          <template v-slot:prepend>
            <q-icon name="account_circle" />
          </template>
        </q-input>
        <q-input filled
                 type="tel"
                 bg-color="grey-2"
                 v-model="appointment.contact"
                 prefix="+63" mask="### ### ####"
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
      <div class="q-gutter-lg">
        <q-input filled
                 label="Verification Code"
                 bg-color="grey-2"
                 counter
                 maxlength="6"
                 v-model="appointment.code">
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
      </div>
    </q-step>

    <template v-slot:navigation>
      <q-separator class="q-mb-md" />
      <q-stepper-navigation>
        <q-btn @click="nextStep()" color="primary" :label="step === 3 ? 'Finish' : 'Continue'" />
        <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
      </q-stepper-navigation>
    </template>
    <template v-slot:message>
      <q-banner v-if="step === 1" class="text-dark bg-blue-1 q-px-lg">
        <div class="text-weight-medium text-h5">Choose a Date & Time</div>
      </q-banner>
      <q-banner v-else-if="step === 2" class="text-dark bg-amber-1 q-px-lg">
        <div class="text-weight-medium text-h5">Contact Information</div>
        <div class="text-body1">Wed, May 20, 2020 @ 9:00a</div>
      </q-banner>
      <q-banner v-else-if="step === 3" class="bg-cyan-1 text-dark q-px-lg">
        <div class="text-weight-medium text-h5">Verify Appointment</div>
        <div class="text-body1">Wed, May 20, 2020 @ 9:00a</div>
        <div class="text-body1">Greg Hermo (+639178070836)</div>
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
export default {
  name: 'BookingForm',
  mixins: [UtilityMixin],
  data () {
    return {
      step: 1,
      appointment: {
        date: '2020/05/15',
        name: '',
        contact: '',
        branch: '',
        timeslot: '',
        contact_type: 'sms',
        code: '',
        pin: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      branches: 'company/getBranches',
      timeslots: 'company/getTimeSlots'
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
      const params = {
        params: {
          branch_id: this.appointment.branch.id,
          date: this.appointment.date
        }
      }
      this.$store.dispatch('company/getTimeSlots', params)
    },
    nextStep () {
      this.scrollToElement('step_1')
      if (this.step === 2) {
        this.handleVerify()
      }
      if (this.step === 3) {
        this.$router.push({ name: 'booking', props: { cslug: this.$store.getters.cslug } })
      }
      this.$refs.stepper.next()
    },
    handleVerify () {
      this.$q.notify({
        type: 'info',
        position: 'top',
        progress: true,
        message: 'Verification code sent.'
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
    }
  }
}
</script>

<style scoped>

</style>
