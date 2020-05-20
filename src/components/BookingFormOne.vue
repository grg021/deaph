<template>
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
                    @input="handleInput" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-select filled
              v-if="branches.length"
              v-show="branches.length > 1"
              @input="updateTimeSlots"
              label="Branch"
              ref="branch"
              lazy-rules="ondemand"
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
</template>

<script>
import { Appointment } from 'src/forms/Appointment'
import { mapGetters } from 'vuex'

export default {
  name: 'BookingFormOne',
  props: ['cslug', 'app'],
  data () {
    return {
      appointment: new Appointment()
    }
  },
  computed: {
    ...mapGetters({
      timeslots: 'company/getTimeSlots'
    }),
    branches () {
      return this.$store.state.company.data.branches.data
    },
    appointmentStore () {
      return this.$store.state.booking.appointment
    }
  },
  methods: {
    handleInput (value, reason, details) {
      if (reason === 'day') {
        this.$refs.qDateProxy.hide()
        this.updateTimeSlots()
      }
    },
    validate () {
      this.$refs.date.validate()
      this.$refs.branch.validate()
      if (this.$refs.date.hasError || this.$refs.branch.hasError) {
        return false
      }
      this.$refs.timeslot.validate()
      if (this.$refs.timeslot.hasError) {
        return false
      }
      this.$store.commit('booking/SET_APPOINTMENT', this.appointment)
      return true
    },
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
          this.$store.commit('booking/SET_TIMESLOT', '')
          this.$refs.timeslot.resetValidation()
        })
    }
  },
  mounted () {
    this.appointment = new Appointment(this.app)
    if (this.branches.length === 1) {
      this.appointment.branch = this.branches[0]
      this.updateTimeSlots()
    }
  },
  beforeDestroy () {
    this.$store.dispatch('company/resetTimeslots')
  }
}
</script>

<style scoped>

</style>
