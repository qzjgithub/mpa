import * as Action from '../action/testAction';

const initialState = {
    data : 0
};

export default function testReducer (state = initialState, action) {
    switch (action.type) {
        case Action.TEST_SET:
            return Object.assign({}, state, {
                data: action.data
            });
        default:
            return state;
    }
};
