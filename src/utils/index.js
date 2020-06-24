import _ from 'lodash';

export function arePropsEqual (prevProps, nextProps) {
    return _.isEqual(prevProps, nextProps);
}