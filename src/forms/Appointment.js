export class Appointment {
  constructor (data) {
    this.originalData = data
    for (const field in data) {
      this[field] = data[field]
    }
  }

  data () {
    const data = {}

    for (const property in this.originalData) {
      data[property] = this[property]
    }
    return data
  }

  reset () {
    for (const field in this.originalData) {
      this[field] = ''
    }
  }
}
