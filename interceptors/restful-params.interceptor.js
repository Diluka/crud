"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const constants_1 = require("../constants");
let counter = 0;
function RestfulParamsInterceptorFactory(crudOptions) {
    let RestfulParamsInterceptor = class RestfulParamsInterceptor {
        intercept(context, call$) {
            return __awaiter(this, void 0, void 0, function* () {
                const req = context.switchToHttp().getRequest();
                const { parsedParams, options } = yield this.transform(req.params);
                req[constants_1.PARSED_PARAMS_REQUEST_KEY] = parsedParams;
                req[constants_1.PARSED_OPTIONS_METADATA] = options;
                return call$;
            });
        }
        transform(params) {
            return __awaiter(this, void 0, void 0, function* () {
                const transformed = {};
                const keys = shared_utils_1.isObject(params) ? Object.keys(params) : [];
                if (keys.length) {
                    transformed.parsedParams = keys.map((key) => ({
                        field: key,
                        operator: 'eq',
                        value: this.validate(key, crudOptions.params[key], params[key]),
                    }));
                }
                else {
                    transformed.parsedParams = [];
                }
                transformed.options = this.parseOptions(transformed.parsedParams);
                return transformed;
            });
        }
        validate(key, type, value) {
            switch (type) {
                case 'number':
                    const isNumeric = 'string' === typeof value && !isNaN(parseFloat(value)) && isFinite(value);
                    if (!isNumeric) {
                        throw new common_1.BadRequestException(`Validation failed. Param '${key}': numeric string is expected`);
                    }
                    return parseInt(value, 10);
                case 'uuid':
                    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                    if (!uuid.test(value)) {
                        throw new common_1.BadRequestException(`Validation failed. Param '${key}': UUID string is expected`);
                    }
                    return value;
                default:
                    return value;
            }
        }
        parseOptions(parsedParams) {
            const options = Object.assign({}, crudOptions.options || {});
            const optionsFilter = options.filter || [];
            const filter = [...optionsFilter, ...parsedParams];
            if (filter.length) {
                options.filter = filter;
            }
            return Object.assign({}, crudOptions, { options });
        }
    };
    RestfulParamsInterceptor = __decorate([
        common_1.Injectable()
    ], RestfulParamsInterceptor);
    Object.defineProperty(RestfulParamsInterceptor, 'name', {
        value: `RestfulParamsInterceptor${counter++}`,
        writable: false,
    });
    return RestfulParamsInterceptor;
}
exports.RestfulParamsInterceptorFactory = RestfulParamsInterceptorFactory;
//# sourceMappingURL=restful-params.interceptor.js.map