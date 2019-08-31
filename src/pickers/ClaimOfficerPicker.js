import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { fetchClaimOfficers } from "../actions";
import { formatMessage, AutoSuggestion, ProgressOrError, withModulesManager, decodeId } from "@openimis/fe-core";
import { FormControl } from "@material-ui/core";

const styles = theme => ({
    label: {
        color: theme.palette.primary.main
    }
});

class ClaimOfficerPicker extends Component {

    componentDidMount() {
        if (!this.props.fetchedClaimOfficers) {
            // prevent loading multiple times the cache when component is
            // several times on tha page
            setTimeout(
                () => {
                    !this.props.fetchingClaimOfficers && this.props.fetchClaimOfficers(this.props.modulesManager)
                },
                Math.floor(Math.random() * 300)
            );              
        }
    }

    formatSuggestion = a => !a ? "" : `${a.code} ${a.lastName} ${a.otherName || ""}`;

    onSuggestionSelected = v => this.props.onChange(v, this.formatSuggestion(v));

    render() {
        const {
            intl, value, claimOfficers,
            fetchingClaimOfficers, fetchedClaimOfficers, errorClaimOfficers,
            withLabel = true, label
        } = this.props;
        let v = claimOfficers ? claimOfficers.filter(o => decodeId(o.id) === ""+value) : [];
        v = v.length ? v[0] : null;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingClaimOfficers} error={errorClaimOfficers} />
                {fetchedClaimOfficers && (
                    <FormControl fullWidth>
                        <AutoSuggestion
                            items={claimOfficers}
                            label={!!withLabel && (label || formatMessage(intl, "claim", "ClaimOfficerPicker.label"))}
                            getSuggestions={this.claimOfficers}
                            getSuggestionValue={this.formatSuggestion}
                            onSuggestionSelected={this.onSuggestionSelected}
                            value={v}
                        />
                    </FormControl>
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    claimOfficers: state.claim.claimOfficers,
    fetchingClaimOfficers: state.claim.fetchingClaimOfficers,
    fetchedClaimOfficers: state.claim.fetchedClaimOfficers,
    errorClaimOfficers: state.claim.errorClaimOfficers,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchClaimOfficers }, dispatch);
};

export default withModulesManager(
    connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(ClaimOfficerPicker))))
);
