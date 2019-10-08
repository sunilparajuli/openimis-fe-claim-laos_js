import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush,
} from "@openimis/fe-core";
import ClaimForm from "../components/ClaimForm";
import { createClaim, updateClaim } from "../actions";

class EditPage extends Component {

    add = () => {
        historyPush(this.props.modulesManager, this.props.history, "claim.route.claimEdit")
    }

    save = (claim) => {
        if (!this.props.claim_uuid) {
            this.props.createClaim(
                this.props.modulesManager,
                claim,
                formatMessageWithValues(
                    this.props.intl,
                    "claim",
                    "CreateClaim.mutationLabel",
                    { insuree: claim.insuree_str }
                )
            );
        } else {
            this.props.updateClaim(
                this.props.modulesManager,
                claim,
                formatMessageWithValues(
                    this.props.intl,
                    "claim",
                    "UpdateClaim.mutationLabel",
                    { code: claim.code }
                )
            );

        }
    }

    render() {
        const { modulesManager, history, claim_uuid } = this.props;
        return (
            <ClaimForm
                claim_uuid={claim_uuid}
                back={e => historyPush(modulesManager, history, "claim.route.healthFacilities")}
                add={this.add}
                save={this.save}
            />
        )
    }
}

const mapStateToProps = (state, props) => ({
    claim_uuid: props.match.params.claim_uuid,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createClaim, updateClaim }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(EditPage)
)));