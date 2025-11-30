class nowInRome {
  readonly zonedDT = Temporal.Now.zonedDateTimeISO('Europe/Rome')

  toString() {
    return this.zonedDT.toString({timeZoneName:"never"})
  }

  get dayOfWeek() {
    return this.zonedDT.dayOfWeek
  }

  get plainDate() {
    return this.zonedDT.toPlainDate().toString()
  }
}

export default nowInRome
