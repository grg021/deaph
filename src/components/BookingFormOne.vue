<template>
  <div class="q-gutter-md">
    <q-select filled
              v-show="branches.length > 1"
              @input="handleBranchUpdate"
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
    <q-input filled bg-color="grey-2"
             ref="date"
             v-model="appointment.date"
             label="Pick a Date"
             mask="date"
             readonly
             :disable="appointment.branch === ''"
             lazy-rules="ondemand"
             @click="() => $refs.qDateProxy.show()"
             :rules="['date', val => !!val || 'Please pick a date']">
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="cal_date"
                    today-btn
                    emit-immediately
                    :options="opt_dates"
                    @input="handleInput" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
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
    <q-banner v-if="timeslots.length === 0 && opt_dates.length > 0 && appointment.date !== ''"
              inline-actions
              class="bg-orange
              text-white">
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
  props: ['cslug', 'app', 'sel_branch', 'opt_dates'],
  data () {
    return {
      appointment: new Appointment(),
      cal_date: ''
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
        this.appointment.date = value
        this.updateTimeSlots()
      } else {
        this.appointment.cal_date = ''
        details.branch_id = this.appointment.branch.id
        this.$emit('cdate', details)
      }
    },
    handleBranchUpdate (e) {
      this.$emit('cbranch', e)
      this.appointment.date = ''
      this.appointment.cal_date = ''
      this.$store.dispatch('company/resetTimeslots')
    },
    validate () {
      this.$refs.branch.validate()
      if (this.$refs.branch.hasError) {
        return false
      }
      this.$refs.date.validate()
      if (this.$refs.date.hasError) {
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
          this.appointment.timeslot = ''
          this.$refs.timeslot.resetValidation()
        })
    }
  },
  mounted () {
    this.appointment = new Appointment(this.app)
    this.cal_date = this.appointment.date
    this.appointment.branch = this.sel_branch
  }
}
</script>

<style scoped>

</style>
