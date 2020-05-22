<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <div class="q-pa-md">
        <q-input filled bg-color="grey-2"
                 ref="date"
                 v-model="appointment.date"
                 label="Pick a Date"
                 mask="date"
                 readonly
                 @click="() => $refs.qDateProxy.show()"
                 :rules="['date', val => !!val || 'Please pick a date']">
          <template v-slot:append>
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
        <q-banner v-else inline-actions class="bg-orange text-white">
          <q-icon name="info" />
          No availability. Check other date.
        </q-banner>
      </div>
      <q-card-actions align="center">
        <q-btn flat label="Cancel" @click="onCancelClick" />
        <q-btn flat color="primary" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RescheduleForm',
  props: ['booking'],
  computed: {
    ...mapGetters({
      timeslots: 'company/getTimeSlots'
    }),
    sel_date () {
      return this.appointment.date
    }
  },
  watch: {
    sel_date: {
      handler (val) {
        this.updateTimeSlots()
      }
    }
  },
  mounted () {
    const d = new Date()
    this.getOpenDates(d.getFullYear(), d.getMonth() + 1, d.getDay(), this.booking.branch_id)
  },
  data () {
    return {
      appointment: {
        id: this.booking.id,
        date: '',
        timeslot: '',
        g_token: ''
      },
      cal_date: '',
      opt_dates: []
    }
  },
  methods: {
    handleInput (value, reason, details) {
      if (reason === 'day') {
        this.$refs.qDateProxy.hide()
        this.appointment.date = value
        this.updateTimeSlots()
      } else {
        this.cal_date = ''
        this.getOpenDates(details.year, details.month, details.day, this.booking.branch_id)
      }
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
          this.opt_dates = res.open_days
        })
    },
    show () {
      this.$refs.dialog.show()
      this.updateTimeSlots()
    },

    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      this.$emit('hide')
    },

    async onOKClick () {
      if (!this.timeslots.length) {
        return false
      }

      this.$refs.timeslot.validate()
      if (this.$refs.timeslot.hasError) {
        return false
      }

      this.$q.loading.show()
      try {
        await this.$recaptchaLoaded()
        this.appointment.g_token = await this.$recaptcha('reschedule')
      } catch (e) {
        this.$q.loading.hide()
        return false
      }
      this.$store.dispatch('booking/rescheduleBooking', this.appointment)
        .then(res => {
          this.$q.notify({
            type: 'positive',
            icon: 'info',
            position: 'top',
            progress: true,
            message: 'Booking Rescheduled'
          })
          this.$q.loading.hide()
          this.$emit('ok')
          this.hide()
        })
    },

    onCancelClick () {
      this.hide()
    },
    updateTimeSlots () {
      if (this.booking.branch_id === '' || this.appointment.date === '') {
        return false
      }
      const params = {
        params: {
          branch_id: this.booking.branch_id,
          date: this.appointment.date
        }
      }
      this.$store.dispatch('company/getTimeSlots', params)
        .then(data => {
          this.appointment.timeslot = ''
          if (data.time_slots.length) {
            this.$refs.timeslot.resetValidation()
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
