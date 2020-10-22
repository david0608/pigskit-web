// Get Pigskit RESTful server origin.
export function pigskit_restful_origin() {
    // Use the specified origin if it has specified in global, or current origin used.
    try {
        return PIGSKIT_RESTFUL_ORIGIN || location.origin
    } catch {
        return location.origin
    }
}

// Get Pigskit GraphQL server origin.
export function pigskit_graphql_origin() {
    // Use the specified origin if it has specified in global, or current origin used.
    try {
        return PIGSKIT_GRAPHQL_ORIGIN || location.origin
    } catch {
        return location.origin
    }
}