import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Fab } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { withHistory, historyPush, withModulesManager, formatMessage, chip } from "@openimis/fe-core";
import ClaimsSearcher from "./ClaimsSearcher";

import { selectForFeedback, selectForReview, submit } from "../actions";

const styles = theme => ({
    fab: theme.fab,
});

class HealthFacilitiesPage extends Component {

    constructor(props) {
        super(props);
        this.defaultFilters = props.modulesManager.getConf(
            "fe-claim",
            "healthFacilities.defaultFilters",
            {
                "claimStatus": {
                    "value": 2,
                    "chip": chip(
                        this.props.intl, "claim", "claimStatus",
                        formatMessage(this.props.intl, "claim", "claimStatus.2")
                    ),
                    "filter": "status: 2"
                }
            }
        );
    }

    canSubmitSelected = (selection) => !!selection && selection.length && selection.filter(s => s.status === 2).length === selection.length

    submitSelected = (selection) => {
        alert('SUBMIT #' + selection.length);
        //this.props.submit(this.state.selection);
    }


    onDoubleClick = (c) => historyPush(this.props.modulesManager, this.props.history, "claim.route.claimEdit", [c.id])

    onAdd = () => {
        historyPush(this.props.modulesManager, this.props.history, "claim.route.claimEdit");
    }

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <ClaimsSearcher
                    defaultFilters={this.defaultFilters}
                    onDoubleClick={this.onDoubleClick}
                    actions={[
                        { label: "claimSummaries.submitSelected", enabled: this.canSubmitSelected, action: this.submitSelected },
                    ]} />
                <Fab color="primary" className={classes.fab} onClick={this.onAdd}>
                    <AddIcon />
                </Fab>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
});


const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            selectForFeedback,
            selectForReview,
            submit,
        },
        dispatch);
};

export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(HealthFacilitiesPage))
))));