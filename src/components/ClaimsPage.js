import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    Fab,
    Grid,
    Paper,
    Divider,
    IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import SendIcon from "@material-ui/icons/Send";
import AddIcon from "@material-ui/icons/Add";
import { Searcher } from "@openimis/fe-core";
import ClaimFilterDialog from "./ClaimFilterDialog";
import {
    withModulesManager,
    formatMessage, formatDateFromIso, formatAmount, chipSelect,
    FormattedMessage, ProgressOrError, SmallTable
} from "@openimis/fe-core";
import { fetchClaimSummaries } from "../actions";

const styles = theme => ({
    root: {
        width: "100%"
    },
    paper: {
        marginTop: theme.spacing(1),
    },
    paperHeader: theme.paper.header,
    paperHeaderTitle: theme.paper.title,
    paperHeaderAction: theme.paper.action,
    paperDivider: theme.paper.divider,
    fab: {
        position: "absolute",
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    }
});


class ClaimsPage extends Component {

    state = {
        open: false,
        filters: {},
    }
    
    componentDidMount() {
        let defaultFilters = this.props.modulesManager.getConfiguration(
            "fe-claim",
            "defaultFilters",
            {
                "claimStatus": {
                    "value": 2,
                    "chip": chipSelect(this.props.intl, "claim", "claimStatus", 2),
                    "filter": "status: 2"
                }
            }
        );
        this.setState({
            filters: defaultFilters,
        },
            e => this.props.fetchClaimSummaries(this.filtersToQueryParams())
        );
    }

    filtersToQueryParams = () => Object.keys(this.state.filters).map(f => this.state.filters[f]['filter']);

    applyFilters = (fltrs) => {
        this.setState({
            open: false,
            filters: fltrs,
        },
            e => this.props.fetchClaimSummaries(this.filtersToQueryParams())
        )
    }

    deleteFilter = (filter) => {
        let fltrs = this.state.filters;
        delete (fltrs[filter]);
        this.setState({
            filters: fltrs
        },
            e => this.props.fetchClaimSummaries(this.filtersToQueryParams())
        )
    }

    onChangePage = (page) => {
        console.log('onChangePage ' + page);
    }

    render() {
        const { intl, classes, claims, fetchingClaims, fetchedClaims, errorClaims } = this.props;
        return (
            <Fragment>
                <ClaimFilterDialog
                    open={this.state.open}
                    onClose={e => this.setState({ open: false })}
                    filters={this.state.filters}
                    apply={this.applyFilters} />
                <Searcher title={formatMessage(intl, "claim", "searchCriteria.title")}
                    open={e => this.setState({ open: true })}
                    apply={this.applyFilters}
                    del={this.deleteFilter}
                    filters={this.state.filters}
                />
                <ProgressOrError progress={fetchingClaims} error={errorClaims} />
                {!!fetchedClaims && (
                    <Paper className={classes.paper}>
                        <Grid container>
                            <Grid item xs={8}>
                                <Grid container alignItems="center" className={classes.paperHeader}>
                                    <Grid item xs={12} className={classes.paperHeaderTitle}>
                                        <FormattedMessage module="claim" id="claimSummaries" />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="flex-end">
                                    <Grid item className={classes.paperHeaderAction}>
                                        <IconButton>
                                            <MoreHoriz />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className={classes.paperDivider}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12}>
                                <SmallTable
                                    module="claim"
                                    headers={[
                                        "claimSummaries.code",
                                        "claimSummaries.healthFacility",
                                        "claimSummaries.dateClaimed",
                                        "claimSummaries.feedbackStatus",
                                        "claimSummaries.reviewStatus",
                                        "claimSummaries.claimed",
                                        "claimSummaries.approved",
                                        "claimSummaries.claimStatus"
                                    ]}
                                    aligns={[, , , , , "center", "center"]}
                                    itemFormatters={[
                                        c => c.code,
                                        c => `${c.healthFacility.code} ${c.healthFacility.name}`,
                                        c => formatDateFromIso(intl, c.dateClaimed),
                                        c => formatMessage(intl, "claim", `feedbackStatus.${c.feedbackStatus}`),
                                        c => formatMessage(intl, "claim", `reviewStatus.${c.reviewStatus}`),
                                        c => formatAmount(intl, c.claimed),
                                        c => formatAmount(intl, c.approved),
                                        c => formatMessage(intl, "claim", `claimStatus.${c.status}`)
                                    ]}
                                    items={claims}
                                    page={1}
                                    pageSize={10}
                                    count={10}
                                    onChangePage={this.onChangePage}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                )}
                <Fab color="primary" aria-label="Add" className={classes.fab}>
                    <AddIcon />
                </Fab>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    claims: state.claim.claims,
    fetchingClaims: state.claim.fetchingClaims,
    fetchedClaims: state.claim.fetchedClaims,
    errorClaims: state.claim.errorClaims,
});


const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchClaimSummaries }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(ClaimsPage)
    )))
);