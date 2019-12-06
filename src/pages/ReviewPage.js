import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    withModulesManager, withHistory, formatMessageWithValues, historyPush, journalize
} from "@openimis/fe-core";
import ClaimForm from "../components/ClaimForm";
import { deliverReview } from "../actions";
import _ from "lodash";

const styles = theme => ({
    page: theme.page,
});

class ReviewPage extends Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            historyPush(this.props.modulesManager, this.props.history, "claim.route.reviews")
        }
    }

    save = (claim) => {
        if (!!claim && (!!claim.items || !!claim.services)) {
            this.props.deliverReview(
                claim,
                formatMessageWithValues(
                    this.props.intl,
                    "claim",
                    "DeliverClaimReview.mutationLabel",
                    { code: claim.code }
                )
            )
        }
    }

    render() {
        const { classes, history, modulesManager, claim_uuid } = this.props;
        return (
            <div className={classes.page}>
                <ClaimForm
                    claim_uuid={claim_uuid}
                    back={e => historyPush(modulesManager, history, "claim.route.reviews")}
                    save={this.save}
                    forReview={true}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    claim_uuid: props.match.params.claim_uuid,
    submittingMutation: state.claim.submittingMutation,
    mutation: state.claim.mutation,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ deliverReview, journalize }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(withStyles(styles)(ReviewPage)))
)));