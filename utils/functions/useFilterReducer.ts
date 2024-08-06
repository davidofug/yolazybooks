interface State {
    minimizedLocation: boolean,
    minimizedService: boolean,
    minimizedCarType: boolean
}

type Action = { type: 'MINILOCATION' } | { type: 'MINISERVICE' } | { type: 'MINICARTYPE' };

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'MINILOCATION':
            return {
                minimizedLocation: !state.minimizedLocation,
                minimizedService: state.minimizedService,
                minimizedCarType: state.minimizedCarType
            };
        case 'MINISERVICE':
            return {
                minimizedLocation: state.minimizedLocation,
                minimizedService: !state.minimizedService,
                minimizedCarType: state.minimizedCarType
            };
        case 'MINICARTYPE':
            return {
                minimizedLocation: state.minimizedLocation,
                minimizedService: state.minimizedService,
                minimizedCarType: !state.minimizedCarType
            };
        default:
            return state;
    }
}

export default reducer;