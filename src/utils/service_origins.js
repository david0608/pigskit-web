export function pigskit_restful_origin() {
    return PIGSKIT_RESTFUL_ORIGIN ? PIGSKIT_RESTFUL_ORIGIN : location.origin
}

export function pigskit_graphql_origin() {
    return PIGSKIT_GRAPHQL_ORIGIN ? PIGSKIT_GRAPHQL_ORIGIN : location.origin
}