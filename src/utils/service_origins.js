export function pigskit_restful_origin() {
    try {
        return PIGSKIT_RESTFUL_ORIGIN || location.origin
    } catch {
        return location.origin
    }
}

export function pigskit_graphql_origin() {
    try {
        return PIGSKIT_GRAPHQL_ORIGIN || location.origin
    } catch {
        return location.origin
    }
}