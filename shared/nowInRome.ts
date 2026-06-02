class nowInRome {
  readonly zonedDT = Temporal.Now.zonedDateTimeISO('Europe/Rome')

  toString() {
    return this.zonedDT.toString({timeZoneName:"never"})
  }

  plainString(zdt: Temporal.ZonedDateTime) {
    return zdt.toPlainDate().toString()
  }

  subtract(durationLike: Temporal.DurationLike) {
    return this.plainString(this.zonedDT.subtract(durationLike))
  }

  get dayOfWeek() {
    return this.zonedDT.dayOfWeek
  }

  get plainDate() {
    return this.plainString(this.zonedDT)
  }
}

export default nowInRome
