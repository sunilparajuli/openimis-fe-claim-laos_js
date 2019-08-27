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

class EditPage extends Component {

    add = () => {
        historyPush(this.props.history, "claim.route.editClaim");
        this.setState({ claim: {} })
    }

    save = (claim) => {
        claim.code = uuid().substring(0, 8);  //code should be defined by backend!!
        if (!this.props.claim_id) {
            this.props.createClaim(
                this.props.modulesManager,
                claim,
                formatMessage(
                    this.props.intl,
                    "claim",
                    "CreateClaim.mutationLabel"
                ),
                claim.code
            );
        }
    }

    render() {
        const { claim_id } = this.props;
        return (
            <ClaimForm claim_id={claim_id} add={this.add} save={this.save} />
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
    injectIntl(EditPage)
)));