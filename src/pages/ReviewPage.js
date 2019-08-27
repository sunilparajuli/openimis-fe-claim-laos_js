import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    formatMessage, withModulesManager, withHistory, historyPush,
} from "@openimis/fe-core";
import ClaimForm from "../components/ClaimForm";
import { createClaim } from "../actions";
import _ from "lodash";
import { uuid } from "lodash-uuid";

class ReviewPage extends Component {
    save = (review) => {
        console.log("SAVE REVIEW..." + JSON.stringify(review))
    }

    render() {
        const { claim_id } = this.props;
        return (
            <ClaimForm claim_id={claim_id} save={this.save} forReview={true} />
        )
    }
}

const mapStateToProps = (state, props) => ({
    claim_id: props.match.params.claim_id
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createClaim }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(ReviewPage)
)));