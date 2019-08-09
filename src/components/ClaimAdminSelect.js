import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { fetchClaimAdmins } from "../actions";
import { formatMessage, AutoSuggestion, ProgressOrError } from "@openimis/fe-core";
import { FormControl } from "@material-ui/core";

const styles = theme => ({
    label: {
        color: theme.palette.primary.main
    }
});

class ClaimAdminSelect extends Component {

    componentDidMount() {
        this.props.fetchClaimAdmins();
    }

    formatSuggestion = a => `${a.code} ${a.lastName} ${a.otherName || ""}`;

    onSuggestionSelected = v => this.props.onClaimAdminSelected(v, this.formatSuggestion(v));

    render() {
        const { intl, claimAdmins, fetchingClaimAdmins, fetchedClaimAdmins, errorClaimAdmins } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingClaimAdmins} error={errorClaimAdmins} />
                {fetchedClaimAdmins && (
                    <FormControl fullWidth={true}>
                        <AutoSuggestion
                            items={claimAdmins}
                            label={formatMessage(intl, "claim", "ClaimAdminSelect.label")}
                            lookup={this.formatSuggestion}
                            getSuggestions={this.claimAdmins}
                            renderSuggestion={a => <span>{this.formatSuggestion(a)}</span>}
                            getSuggestionValue={this.formatSuggestion}
                            onSuggestionSelected={this.onSuggestionSelected}
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(ClaimAdminSelect))));
