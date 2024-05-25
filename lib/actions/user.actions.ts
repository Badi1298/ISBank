'use server';

import { cookies } from 'next/headers';

import { ID } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../appwrite';

import { encryptId, parseStringify } from '../utils';
import {
    CountryCode,
    ProcessorTokenCreateRequest,
    ProcessorTokenCreateRequestProcessorEnum,
    Products,
} from 'plaid';
import { plaidClient } from '../plaid';
import { revalidatePath } from 'next/cache';
import { addFundingSource } from './dwolla.actions';

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export async function signIn({ email, password }: SignInProps) {
    try {
        const { account } = await createAdminClient();

        const session = await account.createEmailPasswordSession(
            email,
            password
        );

        cookies().set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        });

        return parseStringify(session);
    } catch (error) {
        console.log(error);
    }
}

export async function signUp(userData: SignUpParams) {
    const { email, password, firstName, lastName } = userData;

    try {
        const { account } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        );
        const session = await account.createEmailPasswordSession(
            email,
            password
        );

        cookies().set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        });

        return parseStringify(newUserAccount);
    } catch (error) {
        console.log(error);
    }
}

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        return await account.get();
    } catch (error) {
        return null;
    }
}

export async function logout() {
    try {
        const { account } = await createSessionClient();
        cookies().delete('appwrite-session');
        await account.deleteSession('current');
    } catch (error) {
        return null;
    }
}

export async function createLinkToken(user: User) {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id,
            },
            client_name: user.name,
            products: ['auth'] as Products[],
            language: 'en',
            country_codes: ['US'] as CountryCode[],
        };

        const response = await plaidClient.linkTokenCreate(tokenParams);

        return parseStringify({ linkToken: response.data.link_token });
    } catch (error) {
        console.log(error);
    }
}

export async function createBankAccount({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    shareableId,
}: CreateBankAccountProps) {
    try {
        const { database } = await createAdminClient();

        const bankAccount = await database.createDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            ID.unique(),
            {
                userId,
                bankId,
                accountId,
                accessToken,
                fundingSourceUrl,
                shareableId,
            }
        );

        return parseStringify(bankAccount);
    } catch (error) {
        console.log(error);
    }
}

export async function exchangePublicToken({
    publicToken,
    user,
}: ExchangePublicTokenProps) {
    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        // Get account information from Plaid using the access token
        const accountResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accountData = accountResponse.data.accounts[0];

        // Create a processor token for Dwolla using the access token and account ID
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
        };

        const processorTokenRequest = await plaidClient.processorTokenCreate(
            request
        );
        const processorToken = processorTokenRequest.data.processor_token;

        // Create a funding source URL for the account using the Dwolla customer ID, processor token and bank name
        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        });

        if (!fundingSourceUrl) throw new Error();

        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            shareableId: encryptId(accountData.account_id),
        });

        // Revalidate the path to reflect the changes
        revalidatePath('/');

        return parseStringify({
            publicTokenExchange: 'complete',
        });
    } catch (error) {
        console.log(error);
    }
}
