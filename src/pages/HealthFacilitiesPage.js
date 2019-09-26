import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Fab } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import AddIcon from "@material-ui/icons/Add";
import {
    withHistory, historyPush, withModulesManager,
    formatMessageWithValues,
    journalize
} from "@openimis/fe-core";
import ClaimSearcher from "../components/ClaimSearcher";

import { selectForFeedback, selectForReview, submit } from "../actions";

const styles = theme => ({
    fab: theme.fab,
});

class HealthFacilitiesPage extends Component {

    constructor(props) {
        super(props);
        let defaultFilters = props.modulesManager.getConf(
            "fe-claim",
            "healthFacilities.defaultFilters",
            {
                "claimStatus": {
                    "value": 2,
                    "filter": "status: 2"
                }
            }
        )

        this.state = { defaultFilters }
    }

    _filterOnUserHealthFacilityFullPath() {
        let defaultFilters = { ...this.state.defaultFilters }
        defaultFilters.healthFacility = {
            "value": this.props.userHealthFacilityFullPath,
            "filter": `healthFacility_Id: "${this.props.userHealthFacilityFullPath.id}"`
        }
        let district = this.props.userHealthFacilityFullPath.location;
        defaultFilters.district = {
            "value": district,
            "filter": `healthFacility_Location_Id: "${district.id}"`
        }
        let region = district.parent;
        defaultFilters.region = {
            "value": region,
            "filter": `healthFacility_Location_Parent_Id: "${region.id}"`
        }
        this.setState({ defaultFilters })
    }

    componentDidMount() {
        if (!!this.props.userHealthFacilityFullPath) {
            this._filterOnUserHealthFacilityFullPath();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
        }
        if (!_.isEqual(prevProps.userHealthFacilityFullPath, this.props.userHealthFacilityFullPath)) {
            this._filterOnUserHealthFacilityFullPath();
        }
    }

    canSubmitSelected = (selection) => !!selection && selection.length && selection.filter(s => s.status === 2).length === selection.length

    submitSelected = (selection) => {
        if (selection.length === 1) {
            this.props.submit(
                selection,
                formatMessageWithValues(
                    this.props.intl,
                    "claim",
                    "SubmitClaim.mutationLabel",
                    { code: selection[0].code }
                )
            );
        } else {
            this.props.submit(
                selection,
                formatMessageWithValues(
                    this.props.intl,
                    "claim",
                    "SubmitClaims.mutationLabel",
                    { count: selection.length }
                )
            );
        }
    }


    onDoubleClick = (c) => historyPush(this.props.modulesManager, this.props.history, "claim.route.claimEdit", [c.id])

    onAdd = () => {
        historyPush(this.props.modulesManager, this.props.history, "claim.route.claimEdit");
    }

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <ClaimSearcher
                    defaultFilters={this.state.defaultFilters}
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
    userHealthFacilityFullPath: !!state.loc ? state.loc.userHealthFacilityFullPath : null,
    userHealthFacilityStr: state.loc ? state.loc.userHealthFacilityStr : null,
    userRegionStr: !!state.loc ? state.loc.userRegionStr : null,
    userDistrictStr: !!state.loc ? state.loc.userDistrictStr : null,
    submittingMutation: state.claim.submittingMutation,
    mutation: state.claim.mutation,
});


const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            selectForFeedback,
            selectForReview,
            submit,
            journalize,
        },
        dispatch);
};

export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(HealthFacilitiesPage))
))));