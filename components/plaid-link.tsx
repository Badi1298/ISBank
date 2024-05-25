import {
    PlaidLinkOnSuccess,
    PlaidLinkOptions,
    usePlaidLink,
} from 'react-plaid-link';
import { Button } from './ui/button';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLinkToken } from '@/lib/actions/user.actions';

export default function PlaidLink({ user, variant }: PlaidLinkProps) {
    const router = useRouter();

    const [token, setToken] = useState('');

    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken(user);

            setToken(data?.linkToken);
        };

        getLinkToken();
    }, [user]);

    const onSuccess = useCallback<PlaidLinkOnSuccess>(
        async (public_token: string) => {
            // await exchangePublicToken({
            //     publickToken: public_token,
            //     user,
            // })

            router.push('/');
        },
        [user]
    );

    const config: PlaidLinkOptions = {
        token,
        onSuccess,
    };

    const { open, ready } = usePlaidLink(config);

    return (
        <>
            {variant === 'primary' ? (
                <Button
                    disabled={!ready}
                    className="plaidlink-primary"
                    onClick={() => open()}
                >
                    Connect Bank
                </Button>
            ) : variant === 'ghost' ? (
                <Button>Connect Bank</Button>
            ) : (
                <Button>Connect Bank</Button>
            )}
        </>
    );
}
