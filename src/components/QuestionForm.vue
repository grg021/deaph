<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card>
      <q-toolbar>

        <q-toolbar-title><q-icon name="assignment_turned_in" /><span class="text-weight-bold">Health</span> Checklist</q-toolbar-title>

      </q-toolbar>

        <q-carousel
          v-model="slide"
          transition-prev="scale"
          transition-next="scale"
          swipeable
          animated
          arrows
          vertical
          control-color="white"
          class="bg-primary text-white shadow-1 rounded-borders"
          v-if="questions.length"
        >
          <q-carousel-slide name="style" class="column no-wrap flex-center">
            <q-icon name="style" size="56px" />
            <div class="q-mt-md text-center">
              COVID-19 Health Checklist
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="question.id" class="column no-wrap flex-center"
                            v-for="(question, key) in questions" :key="question.id"
          >
            <div class="q-mt-md text-center">
              <div class="text-h5"><strong>{{ key + 1 }}</strong> / {{ questions.length }}</div>
              <q-separator class="q-my-md" inset dark />
              <p>{{ question.q1 }}<br/>{{ question.q2 }}</p>
              <div class="q-gutter-sm">
                <q-radio dark color="cyan" size="lg" v-model="question.answer" val="yes" label="Yes" />
                <q-radio dark color="orange" size="lg" v-model="question.answer" val="no" label="No" />
                <q-input v-model="question.answer2" v-if="typeof question.answer2 !== 'undefined'"
                         outlined
                         bg-color="white"
                         label="Specify (sabihin kung saan)" />
              </div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="summary" class="column no-wrap flex-center">
            <div class="q-mt-md">
              <p>I hereby authorize DeaPH, to collect and prcess the data indicated herein for the purpose of effecting
              control of the COVID-19 infection. I understand that my personal information is protected by RA 10173,
              Data Privacy Act of 2012, and that I am required by RA 11469 Bayanihan to Heal as One Act, to provide
              truthful information.
              </p>
              <div class="q-gutter-sm">
                <q-btn label="I Agree" outline color="white" @click="handleAgree" />
                <q-btn label="I Do Not Agree" outline color="white" />
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'QuestionForm',
  methods: {
    handleAgree () {
      this.$emit('ok')
      this.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    },
    hide () {
      this.$refs.dialog.hide()
    },
    show () {
      this.$refs.dialog.show()
    },
    generateId () {
      return '_' + Math.random().toString(36).substr(2, 9)
    }
  },
  data () {
    return {
      questions: [
        {
          id: this.generateId(),
          q1: 'Are you experiencing: (nakakaranas ka ba ng:)',
          q2: 'a. Sore Throat (pananakit ng lalamunan / masakit lumnok)',
          answer: ''
        },
        {
          id: this.generateId(),
          q1: 'Are you experiencing: (nakakaranas ka ba ng:)',
          q2: 'b. Body Pains (pananakit ng katawan)',
          answer: ''
        },
        {
          id: this.generateId(),
          q1: 'Are you experiencing: (nakakaranas ka ba ng:)',
          q2: 'c. Headache (pananakit ng ulo)',
          answer: ''
        },
        {
          id: this.generateId(),
          q1: 'Are you experiencing: (nakakaranas ka ba ng:)',
          q2: 'd. Fever for the past few days (Lagnat sa nakalipas na mga araw)',
          answer: ''
        },
        {
          id: this.generateId(),
          q1: 'Have you worked together or stayed in the same close environement of a confirmed COVID-19 case? (May nakasama ka ba' +
            'o nakatrabahon tao na kumpirmadong may COVID-19 / may impeksyon na coronavirus?',
          q2: '',
          answer: ''
        },
        {
          id: this.generateId(),
          q1: 'Have you had any contact with anyone with fever, cough, colds and sore throat in the past 2 weeks? (' +
            'Mayroon ka bang nakasama na may lagnat, ubo, sipon o sakit ng lalamunan sa nakalipas na dalawang (2) linggo?)',
          q2: '',
          answer: ''
        },
        {
          id: this.generateId(),
          q1: 'Have you travelled outside of the Philippines in the last 14 days? (Ikaw ba ay nagbyahe sa labas ng ' +
            'Pilipinas sa nakalipas na 14 na araw?)',
          q2: '',
          answer: ''
        },
        {
          id: this.generateId(),
          q1: 'Have you travelled to any area in the NCR aside from your home? (Ikaw ba ya nagpunta sa iba pang parete ng' +
            'NCR o Metro Manila bukad sa iyong bahay?)',
          q2: '',
          answer: '',
          answer2: ''
        }
      ],
      slide: 'style',
      lorem: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'
    }
  }
}
</script>

<style scoped>

</style>
