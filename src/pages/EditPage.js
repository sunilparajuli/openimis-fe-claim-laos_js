import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush,
} from "@openimis/fe-core";
import ClaimForm from "../components/ClaimForm";
import { createClaim, updateClaim, print, generate } from "../actions";
import { RIGHT_ADD, RIGHT_LOAD, RIGHT_PRINT } from "../constants";

class EditPage extends Component {

    state = {
        printParam: null
    }

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

    print = (claimUuid) => {
        this.setState(
            { printParam: claimUuid },
            e => this.props.print()
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.generating && !!this.props.generating) {
            this.props.generate(this.state.printParam)
        }
    }

    render() {
        const { modulesManager, history, rights, claim_uuid } = this.props;
        if (!rights.includes(RIGHT_LOAD)) return null;
        return (
            <ClaimForm
                claim_uuid={claim_uuid}
                back={e => historyPush(modulesManager, history, "claim.route.healthFacilities")}
                add={rights.includes(RIGHT_ADD) ? this.add : null}
                save={rights.includes(RIGHT_LOAD) ? this.save : null}
                print={rights.includes(RIGHT_PRINT) ? this.print : null}
                readOnly={!rights.filter(r => r === RIGHT_ADD || r === RIGHT_LOAD).length}
            />
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    claim_uuid: props.match.params.claim_uuid,
    generating: state.claim.generating,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createClaim, updateClaim, print, generate }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(EditPage)
)));