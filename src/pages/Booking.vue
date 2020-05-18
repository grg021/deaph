<template>
  <q-page class="flex" id="top">
    <div id="step_0" class="row justify-center bg-cyan-1" style="min-height: 400px; width: 100%">
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
          <q-card-actions>
            <q-btn color="negative" flat>Cancel</q-btn>
            <q-btn color="primary" flat>Reschedule</q-btn>
            <q-btn flat @click="$router.push({ name: 'index' })">Home</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { UtilityMixin } from '../mixins/UtilityMixin'
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
        pin: '1234'
      }
    }
  }
}
</script>
