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
      <booking-form-one
        :app="appointment"
        :cslug="cslug"
        :sel_branch="sel_branch"
        :opt_dates="open_dates"
        @cdate="handleChangeDate"
        @cbranch="handleChangeBranch"
        ref="form_one"
        v-if="branches.length" />
    </q-step>

    <q-step
      :name="2"
      title="User Information"
      icon="account_circle"
      :done="step > 2"
    >
      <booking-form-two :app="appointment" :branch="sel_branch" ref="form_two" />
    </q-step>

    <q-step
      :name="3"
      title="Verify"
      icon="verified_user"
    >
      <booking-form-three :app="appointment" ref="form_three" />
    </q-step>

    <template v-slot:navigation>
      <q-separator class="q-mb-md" />
      <q-stepper-navigation>
        <q-btn @click="nextStep()"
               color="primary"
               :label="step === 3 ? 'Finish' : 'Continue'" />
        <q-btn v-if="step > 1"
               flat
               color="primary"
               @click="$refs.stepper.previous()"
               label="Back"
               class="q-ml-sm" />
      </q-stepper-navigation>
    </template>
    <template v-slot:message>
      <q-banner v-if="step === 1" class="text-dark bg-blue-1 q-px-lg">
        <div class="text-weight-medium text-h5">Choose a Date & Time</div>
      </q-banner>
      <q-banner v-else-if="step === 2" class="text-dark bg-amber-1 q-px-lg">
        <div class="text-weight-medium text-h5">Contact Information</div>
        <div class="text-body1"><span>{{ dateFormat(appointmentStore.date) }}</span> @ <span>{{ appointmentStore.timeslot.time }}</span></div>
      </q-banner>
      <q-banner v-else-if="step === 3" class="bg-cyan-1 text-dark q-px-lg">
        <div class="text-weight-medium text-h5">Verify Appointment</div>
        <div class="text-body1"><span>{{ dateFormat(appointmentStore.date) }}</span> @ <span>{{ appointmentStore.timeslot.time }}</span></div>
        <div class="text-body1"><span>{{ appointmentStore.name }}</span>&nbsp;<span>(+63 {{ appointmentStore.sms }})</span></div>
      </q-banner>
      <q-banner v-else class="bg-blue-8 text-white q-px-lg">
        Contact Support
      </q-banner>
    </template>
  </q-stepper>
</template>

<script>
import { UtilityMixin } from '../mixins/UtilityMixin'
import BookingFormOne from 'components/BookingFormOne'
import BookingFormTwo from 'components/BookingFormTwo'
import BookingFormThree from 'components/BookingFormThree'
import QuestionForm from 'components/QuestionForm'
const getDefaultAppointment = (slug) => {
  return {
    id: 0,
    cslug: slug,
    date: '',
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
export default {
  name: 'BookingForm',
  components: { BookingFormThree, BookingFormTwo, BookingFormOne },
  mixins: [UtilityMixin],
  props: ['cslug'],
  data () {
    return {
      step: 1,
      appointment: getDefaultAppointment(this.cslug),
      sel_branch: '',
      open_dates: []
    }
  },
  computed: {
    appointmentStore () {
      return this.$store.state.booking.appointment
    },
    branches () {
      return this.$store.state.company.data.branches.data
    }
  },
  watch: {
    appointmentStore: {
      handler (val) {
        this.appointment = val
      },
      deep: true
    },
    branches (val) {
      if (val.length === 1) {
        this.sel_branch = val[0]
        const d = new Date()
        this.getOpenDates(d.getFullYear(), d.getMonth() + 1, d.getDay(), val[0].id)
      }
    }
  },
  methods: {
    handleChangeBranch (e) {
      const d = new Date()
      this.getOpenDates(d.getFullYear(), d.getMonth() + 1, d.getDay(), e.id)
      this.sel_branch = e
    },
    handleChangeDate (e) {
      this.getOpenDates(e.year, e.month, e.day, e.branch_id)
    },
    getOpenDates (year, month, day, id) {
      const params = {
        params: {
          branch_id: id,
          year: year,
          month: month,
          day: day
        }
      }
      this.$store.dispatch('company/getOpenDates', params)
        .then(res => {
          this.open_dates = res.open_days
        })
    },
    nextStep () {
      this.scrollToElement('step_1')
      if (this.step === 1) {
        if (!this.$refs.form_one.validate()) {
          return false
        }
        this.$refs.stepper.next()
        return false
      }
      if (this.step === 2) {
        if (!this.$refs.form_two.validate()) {
          return false
        }
        if (this.sel_branch.forms.data.length && this.sel_branch.forms.data.findIndex(d => d.id === '1')) {
          this.$q.dialog({
            component: QuestionForm,
            parent: this
          }).onOk(() => {
            this.$refs.form_two.submit()
              .then(() => {
                this.$refs.stepper.next()
              })
          })
          return false
        }
        this.$refs.form_two.submit()
          .then(() => {
            this.$refs.stepper.next()
          })
        return false
      }
      if (this.step === 3) {
        if (!this.$refs.form_three.validate()) {
          return false
        }
        this.$refs.form_three.submit()
      }
    }
  },
  beforeDestroy () {
    this.$store.dispatch('company/resetTimeslots')
  }
}
</script>

<style scoped>

</style>
