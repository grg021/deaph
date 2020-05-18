<template>
  <q-page class="flex">
    <div id="step_0" class="row flex-center bg-blue" style="height: 600px; width: 100%">
      <div class="col-grow text-center">
        <q-btn unelevated
               @click="scrollToElement('step_1')"
               size="lg"
               color="orange" label="New Appointment" />
        <div class="text-h5 text-white q-pa-md">or</div>
        <q-btn outline
               color="white"
               @click="scrollToElement('step_2')"
               label="Retrieve existing Booking" />
      </div>
    </div>
    <div id="step_1" class="fit row flex-center">
      <div class="col-grow" style="max-width: 400px">
        <booking-form :cslug="cslug" />
      </div>
    </div>
    <div id="step_2" class="row flex-center bg-green" style="height: 600px; width: 100%">
      <div class="col-grow text-center q-pa-md" style="max-width: 400px">
        <retrieve-form />
      </div>
    </div>
  </q-page>
</template>

<script>
import { UtilityMixin } from '../mixins/UtilityMixin'
import BookingForm from 'components/BookingForm'
import RetrieveForm from 'components/RetrieveForm'
export default {
  name: 'PageIndex',
  components: { RetrieveForm, BookingForm },
  mixins: [UtilityMixin],
  props: ['cslug']
}
</script>
