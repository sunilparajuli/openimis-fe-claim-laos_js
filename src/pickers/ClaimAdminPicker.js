import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import _debounce from "lodash/debounce";
import _ from "lodash";
import { fetchClaimAdmins } from "../actions";
import { formatMessage, AutoSuggestion, ProgressOrError, withModulesManager } from "@openimis/fe-core";

const styles = theme => ({
    label: {
        color: theme.palette.primary.main
    }
});

class ClaimAdminPicker extends Component {
    constructor(props) {
        super(props);
        this.selectThreshold = props.modulesManager.getConf("fe-claim", "ClaimAdminPicker.selectThreshold", 10);
    }

    componentDidMount() {
        if (!!this.props.readOnly) return;

        if (!!this.props.userHealthFacilityFullPath) {
            this.props.fetchClaimAdmins(
                this.props.modulesManager,
                this.props.userHealthFacilityFullPath,
                null,
                this.props.fetchedClaimAdmins
            )
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!!this.props.readOnly) return;

        // check we are not currently fetching the new admin list
        if (!_.isEqual(prevProps.fetchedClaimAdmins, this.props.fetchedClaimAdmins)) return;

        if (!_.isEqual(prevProps.userHealthFacilityFullPath, this.props.userHealthFacilityFullPath)) {
            !this.props.fetchingClaimAdmins && this.props.fetchClaimAdmins(
                this.props.modulesManager,
                this.props.userHealthFacilityFullPath,
                null,
                this.props.fetchedClaimAdmins
            )
        } else if (!_.isEqual(prevProps.hfFilter, this.props.hfFilter) &&
            !_.isEqual(this.props.hfFilter, this.props.userHealthFacilityFullPath)) {
            !this.props.fetchingClaimAdmins && this.props.fetchClaimAdmins(
                this.props.modulesManager,
                this.props.hfFilter,
                null,
                this.props.fetchedClaimAdmins
            )
        }
    }

    formatSuggestion = a => !a ? "" : `${a.code} ${a.lastName} ${a.otherNames || ""}`;

    onSuggestionSelected = v => this.props.onChange(v, this.formatSuggestion(v));

    getSuggestions = (str) => !!str &&
        str.length >= this.props.modulesManager.getConf("fe-claim", "claimAdminsMinCharLookup", 2) &&
        this.props.fetchClaimAdmins(
            this.props.modulesManager,
            this.props.userHealthFacilityFullPath,
            str,
            this.props.fetchedClaimAdmins
        )

    debouncedGetSuggestion = _.debounce(
        this.getSuggestions,
        this.props.modulesManager.getConf("fe-claim", "debounceTime", 800)
    )

    render() {
        const {
            intl, value,
            reset, readOnly = false, required = false,
            claimAdmins, fetchingClaimAdmins, errorClaimAdmins,
            withNull = false, nullLabel = null,
            withLabel = true, label,
        } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingClaimAdmins} error={errorClaimAdmins} />
                {!fetchingClaimAdmins && !errorClaimAdmins && (
                    <AutoSuggestion
                        module="claim"
                        items={claimAdmins}
                        label={!!withLabel && (label || formatMessage(intl, "claim", "ClaimAdminPicker.label"))}
                        getSuggestions={this.debouncedGetSuggestion}
                        renderSuggestion={a => <span>{this.formatSuggestion(a)}</span>}
                        getSuggestionValue={this.formatSuggestion}
                        onSuggestionSelected={this.onSuggestionSelected}
                        value={value}
                        reset={reset}
                        readOnly={readOnly}
                        required={required}
                        selectThreshold={this.selectThreshold}
                        withNull={withNull}
                        nullLabel={nullLabel || formatMessage(intl, "claim", "claim.ClaimAdminPicker.null")}
                    />
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    userHealthFacilityFullPath: !!state.loc ? state.loc.userHealthFacilityFullPath : null,
    claimAdmins: state.claim.claimAdmins,
    fetchedClaimAdmins: state.claim.fetchedClaimAdmins,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchClaimAdmins }, dispatch);
};

export default withModulesManager(
    connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(ClaimAdminPicker))))
);
