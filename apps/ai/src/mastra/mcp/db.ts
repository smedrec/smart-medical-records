import { AppDb, note } from '@repo/app-db'

let appDbService: AppDb | undefined = undefined
export { appDbService }

if (!appDbService) {
	appDbService = new AppDb(process.env.APP_DB_URL)
}

export const db = appDbService.getDrizzleInstance()
export { note }
