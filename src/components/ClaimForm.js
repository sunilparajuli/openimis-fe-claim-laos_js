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

import { RIGHT_PRINT, RIGHT_LOAD } from "../constants";

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
        locakNew: false,
        reset: 0,
        update: 0,
        claim: this._newClaim()
    }

    _newClaim() {
        let claim = {};
        claim.healthFacility = this.state && this.state.claim ? this.state.claim.healthFacility : this.props.claimHealthFacility;
        claim.admin = this.state && this.state.claim ? this.state.claim.admin : this.props.claimAdmin;
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

    canSave = () => {
        if (!this.state.claim.code) return false;
        if (!this.state.claim.healthFacility) return false;
        if (!this.state.claim.insuree) return false;
        if (!this.state.claim.admin) return false;
        if (!this.state.claim.dateClaimed) return false;
        if (!this.state.claim.dateFrom) return false;
        if (!this.state.claim.status) return false;
        if (!this.state.claim.icd) return false;
        if (!!this.state.claim.items) {
            let items = [...this.state.claim.items];
            if (!this.props.forReview) items.pop();
            if (items.length && items.filter(i => !this.canSaveDetail(i, 'item')).length) {
                return false;
            }
        }
        if (!!this.state.claim.services) {
            let services = [...this.state.claim.services];
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

    save = (claim) => {
        this.setState(
            { lockNew: !claim.uuid }, // avoid duplicates
            e => this.props.save(claim))
    }

    render() {
        const { rights, claim_uuid, fetchingClaim, fetchedClaim, errorClaim, add, back,
            forReview = false, forFeedback = false } = this.props;
        let readOnly = this.state.lockNew || (!forReview && this.state.claim.status !== 2) || (forReview && this.state.claim.status !== 4) || !rights.filter(r => r === RIGHT_LOAD).length
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
                            update={this.state.update}
                            title="edit.title"
                            titleParams={{ code: this.state.claim.code }}
                            back={back}
                            add={!!add ? this._add : null}
                            save={!!this.props.save ? this.save : null}
                            openDirty={forReview && !readOnly}
                            canSave={this.canSave}
                            reload={claim_uuid && this.reload}
                            print={rights.filter(r => r === RIGHT_PRINT).length ? this.print : null}
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
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
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