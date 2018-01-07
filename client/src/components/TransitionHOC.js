import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const TransitionHOC = Page => {
    return props => (
        <ReactCSSTransitionGroup
            transitionAppear={true}
            transitionAppearTimeout={600}
            transitionEnterTimeout={600}
            transitionLeaveTimeout={200}
            transitionName={props.match.path === '/' ? 'SlideOut' : 'SlideIn'}
        >
            <Page {...props} />
        </ReactCSSTransitionGroup>
    );
};

export default TransitionHOC;
