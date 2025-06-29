import { z } from '@hono/zod-openapi';
import type { App } from '@/lib/hono/index.js';
declare const route: {
    tags: string[];
    operationId: string;
    method: "post";
    path: "/user/upload-avatar";
    security: {
        cookieAuth: never[];
    }[];
    request: {
        body: {
            required: true;
            description: string;
            content: {
                'multipart/form-data': {
                    schema: z.ZodObject<{
                        file: z.ZodEffects<z.ZodAny, any, any>;
                    }, "strip", z.ZodTypeAny, {
                        file?: any;
                    }, {
                        file?: any;
                    }>;
                };
            };
        };
    };
    responses: {
        400: {
            description: string;
            content: {
                'application/json': {
                    schema: z.ZodObject<{
                        error: z.ZodObject<{
                            code: z.ZodEnum<any>;
                            docs: z.ZodString;
                            message: z.ZodString;
                            requestId: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }>;
                    }, "strip", z.ZodTypeAny, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }>;
                };
            };
        };
        401: {
            description: string;
            content: {
                'application/json': {
                    schema: z.ZodObject<{
                        error: z.ZodObject<{
                            code: z.ZodEnum<any>;
                            docs: z.ZodString;
                            message: z.ZodString;
                            requestId: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }>;
                    }, "strip", z.ZodTypeAny, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }>;
                };
            };
        };
        403: {
            description: string;
            content: {
                'application/json': {
                    schema: z.ZodObject<{
                        error: z.ZodObject<{
                            code: z.ZodEnum<any>;
                            docs: z.ZodString;
                            message: z.ZodString;
                            requestId: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }>;
                    }, "strip", z.ZodTypeAny, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }>;
                };
            };
        };
        404: {
            description: string;
            content: {
                'application/json': {
                    schema: z.ZodObject<{
                        error: z.ZodObject<{
                            code: z.ZodEnum<any>;
                            docs: z.ZodString;
                            message: z.ZodString;
                            requestId: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }>;
                    }, "strip", z.ZodTypeAny, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }>;
                };
            };
        };
        409: {
            description: string;
            content: {
                'application/json': {
                    schema: z.ZodObject<{
                        error: z.ZodObject<{
                            code: z.ZodEnum<any>;
                            docs: z.ZodString;
                            message: z.ZodString;
                            requestId: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }>;
                    }, "strip", z.ZodTypeAny, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }>;
                };
            };
        };
        429: {
            description: string;
            content: {
                'application/json': {
                    schema: z.ZodObject<{
                        error: z.ZodObject<{
                            code: z.ZodEnum<any>;
                            docs: z.ZodString;
                            message: z.ZodString;
                            requestId: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }>;
                    }, "strip", z.ZodTypeAny, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }>;
                };
            };
        };
        500: {
            description: string;
            content: {
                'application/json': {
                    schema: z.ZodObject<{
                        error: z.ZodObject<{
                            code: z.ZodEnum<any>;
                            docs: z.ZodString;
                            message: z.ZodString;
                            requestId: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }, {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        }>;
                    }, "strip", z.ZodTypeAny, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }, {
                        error: {
                            message: string;
                            requestId: string;
                            docs: string;
                            code?: any;
                        };
                    }>;
                };
            };
        };
        201: {
            description: string;
            content: {
                'application/json': {
                    schema: z.ZodObject<{
                        key: z.ZodString;
                    }, "strip", z.ZodTypeAny, {
                        key: string;
                    }, {
                        key: string;
                    }>;
                };
            };
        };
    };
} & {
    getRoutingPath(): "/user/upload-avatar";
};
export type Route = typeof route;
export type UploadAvatarRequest = z.infer<(typeof route.request.body.content)['multipart/form-data']['schema']>;
export type UploadAvatarResponse = z.infer<(typeof route.responses)[201]['content']['application/json']['schema']>;
export declare const registerUploadAvatar: (app: App) => import("@hono/zod-openapi").OpenAPIHono<import("../../lib/hono/context").HonoEnv, {
    "/user/upload-avatar": {
        $post: {
            input: {
                form: {
                    file?: any;
                };
            };
            output: {
                error: {
                    message: string;
                    requestId: string;
                    docs: string;
                    code?: any;
                };
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                form: {
                    file?: any;
                };
            };
            output: {
                error: {
                    message: string;
                    requestId: string;
                    docs: string;
                    code?: any;
                };
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                form: {
                    file?: any;
                };
            };
            output: {
                error: {
                    message: string;
                    requestId: string;
                    docs: string;
                    code?: any;
                };
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                form: {
                    file?: any;
                };
            };
            output: {
                error: {
                    message: string;
                    requestId: string;
                    docs: string;
                    code?: any;
                };
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                form: {
                    file?: any;
                };
            };
            output: {
                error: {
                    message: string;
                    requestId: string;
                    docs: string;
                    code?: any;
                };
            };
            outputFormat: "json";
            status: 409;
        } | {
            input: {
                form: {
                    file?: any;
                };
            };
            output: {
                error: {
                    message: string;
                    requestId: string;
                    docs: string;
                    code?: any;
                };
            };
            outputFormat: "json";
            status: 429;
        } | {
            input: {
                form: {
                    file?: any;
                };
            };
            output: {
                error: {
                    message: string;
                    requestId: string;
                    docs: string;
                    code?: any;
                };
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                form: {
                    file?: any;
                };
            };
            output: {
                key: string;
            };
            outputFormat: "json";
            status: 201;
        };
    };
}, "/">;
export {};
//# sourceMappingURL=uploadAvatar.d.ts.map