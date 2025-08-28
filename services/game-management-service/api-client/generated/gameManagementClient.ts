/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { AggregationService } from './services/AggregationService';
import { ArchiveStatusService } from './services/ArchiveStatusService';
import { CurrenciesService } from './services/CurrenciesService';
import { CurrencyGroupGamesService } from './services/CurrencyGroupGamesService';
import { CurrencyGroupsService } from './services/CurrencyGroupsService';
import { DefaultService } from './services/DefaultService';
import { DomainService } from './services/DomainService';
import { ExchangeRatesService } from './services/ExchangeRatesService';
import { GameConfigsService } from './services/GameConfigsService';
import { IdCountersService } from './services/IdCountersService';
import { JackpotsService } from './services/JackpotsService';
import { NotificationService } from './services/NotificationService';
import { OperatorConfigService } from './services/OperatorConfigService';
import { PromotionService } from './services/PromotionService';
import { UsersService } from './services/UsersService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class gameManagementClient {

    public readonly aggregation: AggregationService;
    public readonly archiveStatus: ArchiveStatusService;
    public readonly currencies: CurrenciesService;
    public readonly currencyGroupGames: CurrencyGroupGamesService;
    public readonly currencyGroups: CurrencyGroupsService;
    public readonly default: DefaultService;
    public readonly domain: DomainService;
    public readonly exchangeRates: ExchangeRatesService;
    public readonly gameConfigs: GameConfigsService;
    public readonly idCounters: IdCountersService;
    public readonly jackpots: JackpotsService;
    public readonly notification: NotificationService;
    public readonly operatorConfig: OperatorConfigService;
    public readonly promotion: PromotionService;
    public readonly users: UsersService;

    public readonly request: BaseHttpRequest;

    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '1.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });

        this.aggregation = new AggregationService(this.request);
        this.archiveStatus = new ArchiveStatusService(this.request);
        this.currencies = new CurrenciesService(this.request);
        this.currencyGroupGames = new CurrencyGroupGamesService(this.request);
        this.currencyGroups = new CurrencyGroupsService(this.request);
        this.default = new DefaultService(this.request);
        this.domain = new DomainService(this.request);
        this.exchangeRates = new ExchangeRatesService(this.request);
        this.gameConfigs = new GameConfigsService(this.request);
        this.idCounters = new IdCountersService(this.request);
        this.jackpots = new JackpotsService(this.request);
        this.notification = new NotificationService(this.request);
        this.operatorConfig = new OperatorConfigService(this.request);
        this.promotion = new PromotionService(this.request);
        this.users = new UsersService(this.request);
    }
}
