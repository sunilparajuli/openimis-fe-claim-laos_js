import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    Contributions, ProgressOrError, Form,
    withModulesManager, withHistory, journalize, toISODate
} from "@openimis/fe-core";
import { fetchClaim, claimHealthFacilitySet } from "../actions";
import moment from "moment";
import _ from "lodash";

import ClaimMasterPanel from "./ClaimMasterPanel";
import ClaimChildPanel from "./ClaimChildPanel";
import ClaimFeedbackPanel from "./ClaimFeedbackPanel";

const CLAIM_FORM_CONTRIBUTION_KEY = "claim.ClaimForm";

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
        claim: this._newClaim()
    }

    _newClaim() {
        let claim = {};
        claim.healthFacility = this.props.claimHealthFacility;
        claim.admin = this.props.claimAdmin;
        claim.status = this.props.modulesManager.getConf("fe-claim", "newClaim.status", 2);
        claim.dateClaimed = toISODate(moment().toDate());
        claim.dateFrom = toISODate(moment().toDate());
        claim.visitType = this.props.modulesManager.getConf("fe-claim", "newClaim.visitType", 'O');
        return claim;
    }

    componentDidMount() {
        if (this.props.claim_uuid) {
            this.props.fetchClaim(this.props.modulesManager, this.props.claim_uuid, this.props.forFeedback);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.fetchedClaim !== this.props.fetchedClaim && !!this.props.fetchedClaim) {
            this.setState({ claim: this.props.claim })
            this.props.claimHealthFacilitySet(this.props.claim.healthFacility);
        } else if (prevProps.claim_uuid && !this.props.claim_uuid) {
            this.setState({ claim: this._newClaim() });
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState({ reset: this.state.reset + 1 });
        }
    }

    _add = () => {
        this.setState(
            {
                claim: this._newClaim(),
                reset: this.state.reset + 1,
            },
            e => {
                this.props.add();
                this.forceUpdate();
            }
        )
    }

    canSaveDetail = (d, type) => {
        if (!d[type]) return false;
        if (d.qtyProvided === null || d.qtyProvided === undefined || d.qtyProvided === "") return false;
        if (d.priceAsked === null || d.priceAsked === undefined || d.priceAsked === "") return false;
        return true;
    }

    canSave = (claim) => {
        if (!claim) return false;
        if (!claim.code) return false;
        if (!claim.healthFacility) return false;
        if (!claim.insuree) return false;
        if (!claim.admin) return false;
        if (!claim.dateClaimed) return false;
        if (!claim.dateFrom) return false;
        if (!claim.status) return false;
        if (!claim.icd) return false;
        if (!!claim.items) {
            let items = [...claim.items];
            if (!this.props.forReview) items.pop();
            if (items.length && items.filter(i => !this.canSaveDetail(i, 'item')).length) {
                return false;
            }
        }
        if (!!claim.services) {
            let services = [...claim.services];
            if (!this.props.forReview) services.pop();
            if (services.length && services.filter(s => !this.canSaveDetail(s, 'service')).length) {
                return false;
            }
        }
        return true;
    }

    reload = () => {
        this.props.fetchClaim(this.props.modulesManager, this.props.claim_uuid, this.props.forFeedback);
    }

    print = () => {
        this.props.print(this.props.claim_uuid);
    }

    onEditedChanged = claim => {
        this.setState({ claim })
    }

    render() {
        const { claim_uuid, fetchingClaim, fetchedClaim, errorClaim, add, save, back,
            readOnly = false, forReview = false, forFeedback = false } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingClaim} error={errorClaim} />
                {(!!fetchedClaim || !claim_uuid) && (
                    <Fragment>
                        <Form
                            module="claim"
                            edited_id={claim_uuid}
                            edited={this.state.claim}
                            reset={this.state.reset}
                            title="edit.title"
                            titleParams={{ code: this.state.claim.code }}
                            back={back}
                            add={!!add ? this._add : null}
                            save={save}
                            openDirty={forReview}
                            canSave={this.canSave}
                            reload={claim_uuid && this.reload}
                            print={this.print}
                            readOnly={readOnly}
                            forReview={forReview}
                            forFeedback={forFeedback}
                            HeadPanel={ClaimMasterPanel}
                            Panels={!!forFeedback ?
                                [ClaimFeedbackPanel] :
                                [
                                    ClaimServicesPanel,
                                    ClaimItemsPanel
                                ]}
                            onEditedChanged={this.onEditedChanged}
                        />
                        <Contributions contributionKey={CLAIM_FORM_CONTRIBUTION_KEY} />
                    </Fragment>
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = (state, props) => ({
    userHealthFacilityFullPath: !!state.loc ? state.loc.userHealthFacilityFullPath : null,
    claim: state.claim.claim,
    fetchingClaim: state.claim.fetchingClaim,
    fetchedClaim: state.claim.fetchedClaim,
    errorClaim: state.claim.errorClaim,
    submittingMutation: state.claim.submittingMutation,
    mutation: state.claim.mutation,
    claimAdmin: state.claim.claimAdmin,
    claimHealthFacility: state.claim.claimHealthFacility,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchClaim, claimHealthFacilitySet, journalize }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(ClaimForm)
    ))))
);