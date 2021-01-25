import ApolloClient from 'apollo-boost'
import { pigskit_graphql_origin } from './service_origins'

export class Client extends ApolloClient {
    constructor() {
        super({
            uri: `${pigskit_graphql_origin()}/graphql`,
            credentials: 'include',
        })
    }
}