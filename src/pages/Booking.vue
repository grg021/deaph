<template>

    <div id="step_0" class="row justify-center bg-cyan-1" style="width: 100%">
      <div class="col-grow q-mx-sm q-my-md" style="max-width: 400px">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">{{ booking.branch_name }}</div>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <q-input outline label="BOOKING CODE"
                     hint="IMPORTANT Copy and Save this code."
                     readonly v-model="booking.ref_num">
              <template v-slot:append>
                <q-icon name="vpn_key" />
              </template>
            </q-input>
            <div class="text-body1 q-my-sm q-mt-md">
              <span>{{ booking.date }}</span>
              <br/>
              <span>{{ booking.time_slot_formatted }}</span>
            </div>
            <div class="text-body1 q-my-sm">
              <span>{{ booking.name }}</span>
              <br/>
              <span>{{ booking.contact }}</span>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="center">
            <q-btn color="negative" flat @click="handleCancel">Cancel</q-btn>
            <q-btn color="primary" flat>Reschedule</q-btn>
            <q-btn flat @click="$router.push({ name: 'index' })">Home</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

</template>

<script>
import { UtilityMixin } from '../mixins/UtilityMixin'
import Booking from '../apis/booking'
export default {
  name: 'Booking',
  mixins: [UtilityMixin],
  props: ['uuid'],
  mounted () {
    this.$q.loading.show()
    this.$store.dispatch('booking/getBooking', this.uuid)
      .then(() => {
        this.$q.loading.hide()
        this.scrollToElement('step_0')
      })
  },
  computed: {
    booking () {
      return this.$store.state.booking.data
    }
  },
  data () {
    return {
      appointment: {
        uuid: this.uuid,
        g_token: ''
      }
    }
  },
  methods: {
    handleCancel () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Would you like to cancel this booking?',
        cancel: true,
        persistent: true
      }).onOk(this.cancel)
    },
    async cancel () {
      await this.$recaptchaLoaded()
      this.appointment.g_token = await this.$recaptcha('cancel')
      Booking
        .cancel(this.appointment)
        .then(res => {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            progress: true,
            message: res.data.message
          })
        })
    }
  }
}
</script>
