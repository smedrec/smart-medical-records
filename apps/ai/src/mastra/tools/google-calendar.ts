// tool function
async function getMyCalendarDataByDate(date) {
	const calendar = google.calendar({
		version: 'v3',
		auth: process.env.GOOGLE_PUBLIC_API_KEY,
	})

	// Calculate the start and end of the given date (UTC)
	const start = new Date(date)
	start.setUTCHours(0, 0, 0, 0)
	const end = new Date(start)
	end.setUTCDate(end.getUTCDate() + 1)

	try {
		const res = await calendar.events.list({
			calendarId: process.env.CALENDAR_ID,
			timeMin: start.toISOString(),
			timeMax: end.toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: 'startTime',
		})

		const events = res.data.items || []
		const meetings = events.map((event) => {
			const start = event.start.dateTime || event.start.date
			return `${event.summary} at ${start}`
		})

		if (meetings.length > 0) {
			return {
				meetings,
			}
		} else {
			return {
				meetings: [],
			}
		}
	} catch (err) {
		return {
			error: err.message,
		}
	}
}
