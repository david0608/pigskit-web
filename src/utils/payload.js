export default class Payload {
    static updatePayload(data) {
        return new UpdatePayload(data)
    }

    static createPayload(data) {
        return new CreatePayload(data)
    }
}

class UpdatePayload {
    constructor(data) {
        this.primitive = {
            data: data,
            overwrite: {},
        }
        this.structural = {}
    }

    getData(field) {
        const {
            data,
            overwrite,
        } = this.primitive
        return overwrite.hasOwnProperty(field) ? overwrite[field] : data[field]
    }

    updateData(update) {
        const data = this.primitive.data
        const differ = {}
        for (let field of Object.keys(update)) {
            if (data.hasOwnProperty(field) && data[field] !== update[field]) {
                differ[field] = update[field]
            }
        }
        this.primitive.overwrite = differ
    }

    getChild(field, key) {
        const childs = this.structural[field]
        if (childs.update.hasOwnProperty(key)) {
            return childs.update[key]
        } else {
            return childs.create.values[key]
        }
    }

    createChild(field, data) {
        if (!this.structural[field]) {
            this.structural[field] = {
                create: {
                    currKey: -1,
                    values: {}
                },
                delete: new Set(),
                update: {},
            }
        }
        const create = this.structural[field].create
        create.values[create.currKey] = new CreatePayload(data)
        create.currKey += -1
    }

    deleteChild(field, key) {
        const childs = this.structural[field]
        if (childs.update.hasOwnProperty(key)) {
            childs.delete.add(key)
        } else {
            delete childs.create.values[key]
        }
    }

    registerChild(field, key, data) {
        if (!this.structural[field]) {
            this.structural[field] = {
                create: {
                    currKey: -1,
                    values: {},
                },
                delete: new Set(),
                update: {},
            }
        }
        this.structural[field].update[key] = new UpdatePayload(data)
    }

    childKeys(field) {
        const childs = this.structural[field]
        if (!childs) return []

        let keys = Object.keys(childs.update).filter(key => !childs.delete.has(key))
        keys = keys.concat(Object.keys(childs.create.values))
        return keys
    }

    reduce() {
        const reduce = { ...this.primitive.overwrite }
        for (let field of Object.keys(this.structural)) {
            const childs = this.structural[field]
            const update = {}
            for (let key of Object.keys(childs.update)) {
                if (!childs.delete.has(key)) {
                    update[key] = childs.update[key].reduce()
                }
            }
            reduce[field] = {
                create: Object.values(childs.create.values).map(value => value.reduce()),
                delete: Array.from(childs.delete.values()),
                update: update
            }
        }
        return reduce
    }
}

class CreatePayload {
    constructor(data) {
        this.primitive = {
            data: data
        }
        this.structural = {}
    }

    getData(field) {
        return this.primitive.data[field]
    }

    updateData(update) {
        const data = this.primitive.data
        for (let field of Object.keys(update)) {
            if (data.hasOwnProperty(field)) {
                data[field] = update[field]
            }
        }
    }

    getChild(field, key) {
        return this.structural[field].create.values[key]
    }

    createChild(field, data) {
        if (!this.structural[field]) {
            this.structural[field] = {
                create: {
                    currKey: -1,
                    values: {}
                }
            }
        }
        const create = this.structural[field].create
        create.values[create.currKey] = new CreatePayload(data)
        create.currKey += -1
    }

    deleteChild(field, key) {
        delete this.structural[field].create.values[key]
    }

    childKeys(field) {
        const childs = this.structural[field]
        if (!childs) return []

        return Object.keys(childs.create.values)
    }

    reduce() {
        const reduce = { ...this.primitive.data }
        for (let field of Object.keys(this.structural)) {
            const childs = this.structural[field]
            reduce[field] = Object.values(childs.create.values).map(value => value.reduce())
        }
        return reduce
    }
}