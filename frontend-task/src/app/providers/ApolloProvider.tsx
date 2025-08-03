import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../../shared/config/apolloClient';

export const WithApollo = ({ children }: { children: React.ReactNode }) => (
    <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
);
