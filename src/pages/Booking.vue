<template>
  <q-page class="flex" id="top">
    <div id="step_0" class="row justify-center bg-cyan-1" style="min-height: 400px; width: 100%">
      <div class="col-grow q-mx-sm q-my-md" style="max-width: 400px">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">LTO Calamba</div>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <q-input outline label="BOOKING CODE"
                     hint="IMPORTANT Copy and Save this code."
                     readonly v-model="appointment.pin">
              <template v-slot:append>
                <q-icon name="vpn_key" />
              </template>
            </q-input>
            <div class="text-body1 q-my-sm q-mt-md">Wed, May 20, 2020<br/>9:00 am</div>
            <div class="text-body1 q-my-sm">Greg Hermo<br/>+639178070836</div>
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
  mounted () {
    this.scrollToElement('step_0')
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
