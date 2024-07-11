import gocardless from 'gocardless-nodejs';
import { Environments } from 'gocardless-nodejs/constants';
import { SECRET_GOCARDLESS_ACCESS_TOKEN } from '$env/static/private';

if (!SECRET_GOCARDLESS_ACCESS_TOKEN) {
    throw new Error('SECRET_GOCARDLESS_ACCESS_TOKEN is not set');
}

export const gocardlessClient = gocardless(
    SECRET_GOCARDLESS_ACCESS_TOKEN,
    Environments.Sandbox
);