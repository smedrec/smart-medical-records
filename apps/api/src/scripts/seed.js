'use strict'
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value)
					})
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value))
				} catch (e) {
					reject(e)
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value))
				} catch (e) {
					reject(e)
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next())
		})
	}
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1]
					return t[1]
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === 'function' &&
				(g[Symbol.iterator] = function () {
					return this
				}),
			g
		)
		function verb(n) {
			return function (v) {
				return step([n, v])
			}
		}
		function step(op) {
			if (f) throw new TypeError('Generator is already executing.')
			while ((g && ((g = 0), op[0] && (_ = 0)), _))
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y['return']
									: op[0]
										? y['throw'] || ((t = y['return']) && t.call(y), 0)
										: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t
					if (((y = 0), t)) op = [op[0] & 2, t.value]
					switch (op[0]) {
						case 0:
						case 1:
							t = op
							break
						case 4:
							_.label++
							return { value: op[1], done: false }
						case 5:
							_.label++
							y = op[1]
							op = [0]
							continue
						case 7:
							op = _.ops.pop()
							_.trys.pop()
							continue
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0
								continue
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1]
								break
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1]
								t = op
								break
							}
							if (t && _.label < t[2]) {
								_.label = t[2]
								_.ops.push(op)
								break
							}
							if (t[2]) _.ops.pop()
							_.trys.pop()
							continue
					}
					op = body.call(thisArg, _)
				} catch (e) {
					op = [6, e]
					y = 0
				} finally {
					f = t = 0
				}
			if (op[0] & 5) throw op[1]
			return { value: op[0] ? op[1] : void 0, done: true }
		}
	}
Object.defineProperty(exports, '__esModule', { value: true })
// seed.ts
var fs_1 = require('fs')
var path_1 = require('path')
var db_1 = require('@repo/db')
var dataDir = path_1.default.join(
	__dirname,
	'/home/jose/Documents/workspace/smedrec/fhir/hl7.terminology.r4/package'
)
var jsonPaths = fs_1.default
	.readdirSync(dataDir)
	.filter(function (file) {
		return file.endsWith('.json')
	})
	.map(function (file) {
		return path_1.default.join(dataDir, file)
	})
var seedDatabase = function () {
	return __awaiter(void 0, void 0, void 0, function () {
		var _i,
			jsonPaths_1,
			jsonPath,
			data,
			_a,
			result,
			result,
			result,
			result,
			result,
			result,
			codeSystem,
			valueSet,
			e_1
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					;(_i = 0), (jsonPaths_1 = jsonPaths)
					_b.label = 1
				case 1:
					if (!(_i < jsonPaths_1.length)) return [3 /*break*/, 24]
					jsonPath = jsonPaths_1[_i]
					_b.label = 2
				case 2:
					_b.trys.push([2, 22, , 23])
					return [
						4 /*yield*/,
						Promise.resolve(''.concat(jsonPath)).then(function (s) {
							return require(s)
						}),
					]
				case 3:
					data = _b.sent().default
					console.log('Reading data from '.concat(jsonPath, ':'))
					_a = data.resourceType
					switch (_a) {
						case 'CodeSystem':
							return [3 /*break*/, 4]
						case 'ValueSet':
							return [3 /*break*/, 6]
						case 'ImplementationGuide':
							return [3 /*break*/, 8]
						case 'List':
							return [3 /*break*/, 10]
						case 'NamingSystem':
							return [3 /*break*/, 12]
						case 'StructureDefinition':
							return [3 /*break*/, 14]
					}
					return [3 /*break*/, 16]
				case 4:
					console.log('Processing CodeSystem resource type for '.concat(jsonPath))
					return [
						4 /*yield*/,
						db_1.db
							.insert(db_1.codesystem)
							.values({
								createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								resource: data,
							})
							.returning(),
					]
				case 5:
					result = _b.sent()
					console.log('Created '.concat(result[0].id))
					return [3 /*break*/, 17]
				case 6:
					console.log('Processing ValueSet resource type for '.concat(jsonPath))
					return [
						4 /*yield*/,
						db_1.db
							.insert(db_1.valueset)
							.values({
								createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								resource: data,
							})
							.returning(),
					]
				case 7:
					result = _b.sent()
					console.log('Created '.concat(result[0].id))
					return [3 /*break*/, 17]
				case 8:
					console.log('Processing ImplementationGuide resource type for '.concat(jsonPath))
					return [
						4 /*yield*/,
						db_1.db
							.insert(db_1.implementationguide)
							.values({
								organization: 'vcoCNrwmPJYmhtG7E9emxeFZ3voKIDNl',
								createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								resource: data,
							})
							.returning(),
					]
				case 9:
					result = _b.sent()
					console.log('Created '.concat(result[0].id))
					return [3 /*break*/, 17]
				case 10:
					console.log('Processing List resource type for '.concat(jsonPath))
					return [
						4 /*yield*/,
						db_1.db
							.insert(db_1.list)
							.values({
								createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								resource: data,
							})
							.returning(),
					]
				case 11:
					result = _b.sent()
					console.log('Created '.concat(result[0].id))
					return [3 /*break*/, 17]
				case 12:
					console.log('Processing List resource type for '.concat(jsonPath))
					return [
						4 /*yield*/,
						db_1.db
							.insert(db_1.namingsystem)
							.values({
								createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								resource: data,
							})
							.returning(),
					]
				case 13:
					result = _b.sent()
					console.log('Created '.concat(result[0].id))
					return [3 /*break*/, 17]
				case 14:
					console.log('Processing List resource type for '.concat(jsonPath))
					return [
						4 /*yield*/,
						db_1.db
							.insert(db_1.structuredefinition)
							.values({
								createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								resource: data,
							})
							.returning(),
					]
				case 15:
					result = _b.sent()
					console.log('Created '.concat(result[0].id))
					return [3 /*break*/, 17]
				case 16:
					console.log('Unknown resource type '.concat(data.resourceType, ' for ').concat(jsonPath))
					return [3 /*break*/, 23]
				case 17:
					if (!(data.resourceType === 'CodeSystem')) return [3 /*break*/, 19]
					console.log('CodeSystem resource type for '.concat(jsonPath))
					return [
						4 /*yield*/,
						db_1.db
							.insert(db_1.codesystem)
							.values({
								createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								resource: data,
							})
							.returning(),
					]
				case 18:
					codeSystem = _b.sent()
					console.log('Created '.concat(codeSystem[0].id))
					return [3 /*break*/, 21]
				case 19:
					if (!(data.resourceType !== 'ValueSet')) return [3 /*break*/, 21]
					console.log('ValueSet resource type for '.concat(jsonPath))
					return [
						4 /*yield*/,
						db_1.db
							.insert(db_1.valueset)
							.values({
								createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
								resource: data,
							})
							.returning(),
					]
				case 20:
					valueSet = _b.sent()
					console.log('Created '.concat(valueSet[0].id))
					_b.label = 21
				case 21:
					return [3 /*break*/, 23]
				case 22:
					e_1 = _b.sent()
					console.error('Error seeding database from '.concat(jsonPath, ':'), e_1)
					return [3 /*break*/, 23]
				case 23:
					_i++
					return [3 /*break*/, 1]
				case 24:
					return [2 /*return*/]
			}
		})
	})
}
seedDatabase()
	.catch(function (e) {
		return console.error(e)
	})
	.finally(function () {
		return __awaiter(void 0, void 0, void 0, function () {
			return __generator(this, function (_a) {
				console.log('Database seeding completed.')
				process.exit(0)
				return [2 /*return*/]
			})
		})
	})
