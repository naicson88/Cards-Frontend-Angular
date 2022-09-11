import { environment } from "src/environments/environment";

 interface Config {
    [key: string]: string;
    auth: 'session' | 'token';
}

export const configg: Config = {
    apiUrl: '/api',
    adminUrl: '/api/admin',
    authUrl: environment.devCardsMain,
    auth: 'token'
}