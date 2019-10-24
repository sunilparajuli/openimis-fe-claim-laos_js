import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Divider } from "@material-ui/core"
import { PublishedComponent, FormattedMessage, ProgressOrError, TextInput } from "@openimis/fe-core";
import { fetchLastClaimAt } from "../actions";

const styles = theme => ({
    tableHeader: theme.table.header,
    item: theme.paper.item,
});

class ClaimMasterPanelExt extends Component {

    componentDidMount() {
        const { claim } = this.props;
        if (!!claim && !!claim.insuree && !!claim.healthFacility) {
            this.props.fetchLastClaimAt(claim);
        }
    }

    render() {
        const { classes, fetchingLastClaimAt, errorLastClaimAt, fetchedLastClaimAt, lastClaimAt } = this.props;
        return (
            <Grid container>
                <Grid item xs={6} className={classes.item}>
                    <Typography className={classes.tableTitle}>
                        <FormattedMessage module="claim" id="ClaimMasterPanelExt.InsureePolicyEligibilitySummary.header" />
                    </Typography>
                    <Divider />
                </Grid>
                <Grid item xs={6} className={classes.item}>
                    <Typography className={classes.tableTitle}>
                        <FormattedMessage module="claim" id="ClaimMasterPanelExt.InsureeLastVisit.header" />
                    </Typography>
                    <Divider />
                </Grid>
                <Grid item xs={6} className={classes.item}>
                    <PublishedComponent id="policy.InsureePolicyEligibilitySummary" />
                </Grid>
                <Grid item xs={6} className={classes.item}>
                    <ProgressOrError progress={fetchingLastClaimAt} error={errorLastClaimAt} />
                    {!!fetchedLastClaimAt && !lastClaimAt &&
                        <FormattedMessage module="claim" id="ClaimMasterPanelExt.InsureeLastVisit.noOtheClaim" />
                    }
                    {!!fetchedLastClaimAt && !!lastClaimAt &&
                        <Grid container>
                            <Grid xs={4} item className={classes.item}>
                                <TextInput
                                    module="claim"
                                    label="ClaimMasterPanelExt.InsureeLastVisit.claimCode"
                                    readOnly={true}
                                    value={lastClaimAt.code}
                                />
                            </Grid>
                            <Grid xs={4} item className={classes.item}>
                                <PublishedComponent id="core.DatePicker"
                                    value={lastClaimAt.dateFrom}
                                    module="claim"
                                    label="ClaimMasterPanelExt.InsureeLastVisit.lastClaimAtFrom"
                                    readOnly={true}
                                />
                            </Grid>
                            <Grid xs={4} item className={classes.item}>
                                <PublishedComponent id="core.DatePicker"
                                    value={lastClaimAt.dateTo}
                                    module="claim"
                                    label="ClaimMasterPanelExt.InsureeLastVisit.lastClaimAtTo"
                                    readOnly={true}
                                />
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    claim: state.claim.claim,
    fetchingLastClaimAt: state.claim.fetchingLastClaimAt,
    fetchedLastClaimAt: state.claim.fetchedLastClaimAt,
    lastClaimAt: state.claim.lastClaimAt,
    errorLastClaimAt: state.claim.errorLastClaimAt,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchLastClaimAt }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(
    withStyles(styles)(ClaimMasterPanelExt)
));