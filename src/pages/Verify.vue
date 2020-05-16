<template>
  <q-parallax :height="500"
              class="bg-green-2">
    <div class="q-pa-md a-container">
      <div class="q-gutter-lg">
        <q-card class="my-card" flat>
          <q-card-section>
            <div class="text-body1 text-weight-bold">{{ appointment.branch }}</div>
          </q-card-section>
          <q-separator inset />
          <q-card-section>
            <div class="text-body1 text-weight-medium">{{ appointment.name }}</div>
            <div class="text-body1">{{ appointment.date }}</div>
            <div class="text-body1">{{ appointment.timeslot }}</div>
            <div class="text-body1">{{ appointment.contact }}</div>
          </q-card-section>
        </q-card>
        <q-input filled
                 label="Verification Code"
                 bg-color="white"
                 counter
                 maxlength="6"
                 v-model="verification.code">
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
        <div class="text-center q-gutter-md">
          <q-btn size="lg" color="primary" label="Submit"></q-btn>
          <br/>
          <q-btn color="grey-8" label="Back to Booking" outline @click="$router.push({ 'name': 'index' })" />
        </div>
      </div>
    </div>
  </q-parallax>
</template>

<script>
export default {
  name: 'Verify',
  data () {
    return {
      appointment: {
        date: 'Wed, May 5, 2020',
        name: 'Greg Hermo',
        contact: '+639178070836',
        branch: 'LTO Calamba',
        timeslot: '09:00a',
        contact_type: 'sms'
      },
      verification: {
        code: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
