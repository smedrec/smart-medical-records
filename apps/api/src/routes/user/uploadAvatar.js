var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { ApiError, openApiErrorResponses } from '@/lib/errors/index.js';
import { createId } from '@/lib/utils/id.js';
import { createRoute, z } from '@hono/zod-openapi';
var route = createRoute({
    tags: ['User'],
    operationId: 'user-upload-avatar',
    method: 'post',
    path: '/user/upload-avatar',
    security: [{ cookieAuth: [] }],
    request: {
        body: {
            required: true,
            description: 'The avatar to upload',
            content: {
                'multipart/form-data': {
                    schema: z.object({
                        file: z
                            .any()
                            .refine(function (file) {
                            if (file.type !== 'image/png') {
                                throw new ApiError({
                                    code: 'BAD_REQUEST',
                                    message: 'Only PNG files are allowed for avatar uploads',
                                });
                            }
                            return true;
                        })
                            .openapi({ description: 'file' }),
                    }),
                },
            },
        },
    },
    responses: __assign({ 201: {
            description: 'Avatar upload successful',
            content: {
                'application/json': {
                    schema: z.object({
                        key: z.string().openapi({ description: 'Avatar image key' }),
                    }),
                },
            },
        } }, openApiErrorResponses),
});
export var registerUploadAvatar = function (app) {
    return app.openapi(route, function (c) { return __awaiter(void 0, void 0, void 0, function () {
        var cerbos, session, role, file, key, fileBuffer, fullName, ext, path, image, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cerbos = c.get('services').cerbos;
                    session = c.get('session');
                    if (!session)
                        throw new ApiError({
                            code: 'UNAUTHORIZED',
                            message: 'You Need to login first to continue.',
                        });
                    role = session.session.activeOrganizationRole;
                    return [4 /*yield*/, c.req.parseBody()];
                case 1:
                    file = (_a.sent()).file;
                    if (!(file instanceof File)) return [3 /*break*/, 7];
                    key = createId('avatar');
                    return [4 /*yield*/, file.arrayBuffer()];
                case 2:
                    fileBuffer = _a.sent();
                    fullName = file.name;
                    ext = fullName.split('.').pop();
                    path = "images/".concat(key, ".").concat(ext);
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    if (!c.env.IMAGES_DEV) {
                        throw new ApiError({
                            code: 'INTERNAL_SERVER_ERROR',
                            message: 'IMAGES_DEV R2 binding is not configured. Please check the environment configuration.',
                        });
                    }
                    return [4 /*yield*/, c.env.IMAGES_DEV.put(path, fileBuffer)];
                case 4:
                    image = _a.sent();
                    return [2 /*return*/, c.json({
                            key: "".concat(image === null || image === void 0 ? void 0 : image.key),
                        }, 201)];
                case 5:
                    error_1 = _a.sent();
                    // Handle the ApiError thrown above or other errors
                    if (error_1 instanceof ApiError) {
                        throw error_1;
                    }
                    throw new ApiError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: "An error occurred while uploading the avatar. ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error'),
                    });
                case 6: return [3 /*break*/, 8];
                case 7: throw new ApiError({
                    code: 'BAD_REQUEST',
                    message: "Invalid file type. Only PNG files are allowed for avatar uploads.",
                });
                case 8: return [2 /*return*/];
            }
        });
    }); });
};
