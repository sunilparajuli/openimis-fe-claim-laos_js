import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    ProgressOrError, Form, withModulesManager, withHistory, journalize
} from "@openimis/fe-core";
import { fetchClaim } from "../actions";
import _ from "lodash";

import ClaimMasterPanel from "./ClaimMasterPanel";
import ClaimChildPanel from "./ClaimChildPanel";
import ClaimFeedbackPanel from "./ClaimFeedbackPanel";

const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    item: theme.paper.item,
});


class ClaimServicesPanel extends Component {
    render() {
        return <ClaimChildPanel {...this.props} type="service" picker="medical.ServicePicker" />
    }
}

class ClaimItemsPanel extends Component {
    render() {
        return <ClaimChildPanel {...this.props} type="item" picker="medical.ItemPicker" />
    }
}

class ClaimForm extends Component {

    state = {
        reset: 0,
        claim: {},
    }

    componentDidMount() {
        if (this.props.claim_id) {
            this.props.fetchClaim(this.props.modulesManager, this.props.claim_id, this.props.forFeedback);
        } else {
            this.setState({ dirty: true });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.claim_id && !this.props.claim_id) {
            this.setState({
                claim: {},
            });
        } else if (prevProps.fetchedClaim !== this.props.fetchedClaim && !!this.props.fetchedClaim) {
            this.setState({
                claim: this.props.claim,
            })
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState({ reset: this.state.reset + 1 });
        }
    }

    reload = () => {
        this.props.fetchClaim(this.props.modulesManager, this.props.claim_id, this.props.forFeedback);
    }

    render() {
        const { claim_id, fetchingClaim, fetchedClaim, errorClaim, add, save, forReview = false, forFeedback = false } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingClaim} error={errorClaim} />
                {(!!fetchedClaim || !claim_id) && (
                    <Form
                        module="claim"
                        edited_id={claim_id}
                        edited={this.state.claim}
                        reset={this.state.reset}
                        title="edit.title"
                        titleParams={{ code: this.state.claim.code }}
                        add={add}
                        save={save}
                        reload={claim_id && this.reload}
                        forReview={forReview}
                        forFeedback={forFeedback}
                        HeadPanel={ClaimMasterPanel}
                        Panels={!!forFeedback ?
                            [ClaimFeedbackPanel] :
                            [
                                ClaimServicesPanel,
                                ClaimItemsPanel
                            ]}
                    />
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = (state, props) => ({
    claim: state.claim.claim,
    fetchingClaim: state.claim.fetchingClaim,
    fetchedClaim: state.claim.fetchedClaim,
    errorClaim: state.claim.errorClaim,
    submittingMutation: state.claim.submittingMutation,
    mutation: state.claim.mutation,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchClaim, journalize }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(ClaimForm)
    ))))
);