import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { fetchClaimAdmins } from "../actions";
import { formatMessage, AutoSuggestion, ProgressOrError, withModulesManager } from "@openimis/fe-core";
import { FormControl } from "@material-ui/core";

const styles = theme => ({
    label: {
        color: theme.palette.primary.main
    }
});

class ClaimAdminPicker extends Component {

    componentDidMount() {
        if (!this.props.fetchedClaimAdmins) {
            // prevent loading multiple times the cache when component is
            // several times on tha page
            setTimeout(
                () => {
                    !this.props.fetchingClaimAdmins && this.props.fetchClaimAdmins(this.props.modulesManager)
                },
                Math.floor(Math.random() * 300)
            );
        }
    }

    formatSuggestion = a => !a ? "" : `${a.code} ${a.lastName} ${a.otherName || ""}`;

    onSuggestionSelected = v => this.props.onChange(v, this.formatSuggestion(v));

    render() {
        const {
            intl, value, reset, claimAdmins,
            fetchingClaimAdmins, fetchedClaimAdmins, errorClaimAdmins,
            withLabel = true, label, readOnly = false, required = false,
            hfFilter = null
        } = this.props;
        let admins = !!hfFilter ? (claimAdmins || []).filter(a => a.healthFacility.uuid === hfFilter.uuid) : claimAdmins;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingClaimAdmins} error={errorClaimAdmins} />
                {fetchedClaimAdmins && (
                    <FormControl fullWidth>
                        <AutoSuggestion
                            items={admins}
                            label={!!withLabel && (label || formatMessage(intl, "claim", "ClaimAdminPicker.label"))}
                            getSuggestions={this.claimAdmins}
                            getSuggestionValue={this.formatSuggestion}
                            onSuggestionSelected={this.onSuggestionSelected}
                            value={value}
                            reset={reset}
                            readOnly={readOnly}
                            required={required}
                        />
                    </FormControl>
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    claimAdmins: state.claim.claimAdmins,
    fetchingClaimAdmins: state.claim.fetchingClaimAdmins,
    fetchedClaimAdmins: state.claim.fetchedClaimAdmins,
    errorClaimAdmins: state.claim.errorClaimAdmins,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchClaimAdmins }, dispatch);
};

export default withModulesManager(
    connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(ClaimAdminPicker))))
);
