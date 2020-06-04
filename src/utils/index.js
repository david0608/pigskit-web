import _ from 'lodash';

function arePropsEqual (prevProps, nextProps) {
    return _.isEqual(prevProps, nextProps);
}

export {
    arePropsEqual
}