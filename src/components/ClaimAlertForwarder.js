import React, { Component } from "react";
import { connect } from "react-redux";
import { AlertForwarder } from "@openimis/fe-core";

class ClaimAlertForwarder extends Component {

    render() {
        return <AlertForwarder alert={this.props.alert} />
    }
}

const mapStateToProps = (state, props) => ({
    alert: !!state.claim && state.claim.alert
});

export default connect(mapStateToProps)(ClaimAlertForwarder);