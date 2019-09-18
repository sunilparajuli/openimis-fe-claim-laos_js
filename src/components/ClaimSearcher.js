import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import _ from "lodash";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    Grid,
    Paper,
    Divider,
    IconButton,
    Typography,
    Button,
    Menu,
    MenuItem,
} from "@material-ui/core";
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import { Searcher } from "@openimis/fe-core";
import ClaimFilterDialog from "./ClaimFilterDialog";
import ClaimFilter from "./ClaimFilter";
import {
    withModulesManager,
    formatMessage, formatDateFromIso, formatAmount,
    FormattedMessage, ProgressOrError, Table
} from "@openimis/fe-core";
import { fetchClaimSummaries } from "../actions";

const styles = theme => ({
    root: {
        width: "100%"
    },
    paper: theme.paper.body,
    paperHeader: theme.paper.header,
    paperHeaderTitle: theme.paper.title,
    paperHeaderMessage: theme.paper.message,
    paperHeaderAction: theme.paper.action,
    paperDivider: theme.paper.divider,
});

class SelectionPane extends Component {
    render() {
        const { selection } = this.props;
        if (!selection || !selection.length) return null;
        return (
            <Typography>
                <FormattedMessage
                    module="claim"
                    id="claimSummaries.selection.count"
                    values={{
                        count: <b>{selection.length}</b>,
                    }}
                />
            </Typography>
        )
    }
}

class SelectionMenu extends Component {

    state = {
        anchorEl: null
    }

    openMenu = (e) => this.setState({ anchorEl: e.currentTarget })

    closeMenu = (e) => this.setState({ anchorEl: null })

    action = (a) => {
        this.setState(
            { anchorEl: null },
            e => this.props.triggerAction(a)
        )
    }
    canSelectAll = () => this.props.claims.map(s => s.id).filter(s => !this.props.selection.map(s => s.id).includes(s)).length

    renderButtons = (entries) => (
        <Fragment>
            {entries.map((i, idx) => (
                <Grid key={`selectionsButtons-${idx}`} item className={this.props.classes.paperHeaderAction}>
                    <Button onClick={e => this.action(i.action)}>{i.text}</Button>
                </Grid>
            ))}
        </Fragment>
    )

    renderMenu = (entries) => {
        return (
            <Grid item className={this.props.classes.paperHeaderAction}>
                <Grid container alignItems="center">
                    <Grid item className={this.props.classes.paperHeader}>
                        <IconButton onClick={this.openMenu}><MoreHoriz /></IconButton>
                    </Grid>
                </Grid>
                {!!this.state.anchorEl && (
                    <Menu
                        open={!!this.state.anchorEl}
                        anchorEl={this.state.anchorEl}
                        onClose={this.closeMenu}
                    >
                        {entries.map((i, idx) => (
                            <MenuItem key={`selectionsMenu-${idx}`} onClick={e => this.action(i.action)}>{i.text}</MenuItem>
                        ))}
                    </Menu>
                )}
            </Grid>
        )
    }

    render() {
        const { intl, selection, clearSelected, selectAll, actions } = this.props;
        let entries = [];
        let selectionCount = selection.length;
        if (!!selectionCount) {
            entries.push({ text: formatMessage(intl, "claim", "clearSelected"), action: clearSelected });
        }
        if (this.canSelectAll()) {
            entries.push({ text: formatMessage(intl, "claim", "selectAll"), action: selectAll });
        }
        actions.forEach(a => {
            if (a.enabled(selection)) {
                entries.push({ text: formatMessage(intl, "claim", a.label), action: a.action });
            }
        });
        if (entries.length > 2) {
            return this.renderMenu(entries);
        } else {
            return this.renderButtons(entries);
        }
    }
}

const StyledSelectionMenu = injectIntl(withTheme(withStyles(styles)(SelectionMenu)))

class ClaimSearcher extends Component {

    state = {
        open: false,
        filters: {},
        page: 0,
        pageSize: 0,
        afterCursor: null,
        beforeCursor: null,
        selection: [],
        selectAll: 0,
        clearAll: 0,
        menuAnchor: null,
    }

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-claim", "claimFilter.rowsPerPageOptions", [10, 20, 50, 100]);
        this.defaultPageSize = props.modulesManager.getConf("fe-claim", "claimFilter.defaultPageSize", 10);
        this.withDialog = this.props.modulesManager.getConf(
            "fe-claim",
            "claimFilter.withDialog",
            false
        );
    }

    _resetFilters = () => {
        this.setState({
            filters: this.props.defaultFilters,
            pageSize: this.defaultPageSize,
        },
            e => this.applyFilters()
        );
    }

    componentDidMount() {
        this._resetFilters()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!_.isEqual(prevProps.defaultFilters, this.props.defaultFilters)) {
            this._resetFilters();
        }
        if (!_.isEqual(prevProps.forcedFilters, this.props.forcedFilters)) {
            this.applyFilters();
        }
    }

    filtersToQueryParams = () => {
        let prms = Object.keys(this.state.filters).map(f => this.state.filters[f]['filter']);
        prms = prms.concat(`first: ${this.state.pageSize}`);
        if (!!this.state.afterCursor) {
            prms.push(`after: "${this.state.afterCursor}"`)
        }
        if (!!this.state.beforeCursor) {
            prms.push(`before: "${this.state.beforeCursor}"`)
        }
        if (!!this.props.forcedFilters) {
            prms.push(...this.props.forcedFilters);
        }
        return prms;
    }

    onChangeFilter = (id, value, chip, filter) => {
        let fltrs = this.state.filters;
        if (value === null) {
            delete (fltrs[id]);
        } else {
            fltrs[id] = { value, chip, filter };
        }
        this.setState({
            filters: fltrs
        },
            e => !this.withDialog && this.applyFilters()
        )
    }

    applyFilters = () => {
        this.setState({
            open: false,
            page: 0,
            afterCursor: null,
            beforeCursor: null,
            clearAll: this.state.clearAll + 1,
        },
            e => this.props.fetchClaimSummaries(
                this.props.modulesManager,
                this.filtersToQueryParams()
            )
        )
    }

    deleteFilter = (filter) => {
        let fltrs = this.state.filters;
        delete (fltrs[filter]);
        this.setState({
            filters: fltrs,
            page: 0,
            afterCursor: null,
            beforeCursor: null,
        },
            e => this.props.fetchClaimSummaries(
                this.props.modulesManager,
                this.filtersToQueryParams()
            )
        )
    }

    clearSelected = (e) => {
        this.setState({ clearAll: this.state.clearAll + 1 })
    }

    selectAll = (e) => {
        this.setState({ selectAll: this.state.selectAll + 1 })
    }

    onChangeSelection = selection => {
        this.setState({ selection });
    }

    onChangeRowsPerPage = (cnt) => {
        this.setState(
            {
                pageSize: cnt,
                page: 0,
                afterCursor: null,
                beforeCursor: null,
            },
            e => this.props.fetchClaimSummaries(
                this.props.modulesManager,
                this.filtersToQueryParams()
            )
        )
    }

    onChangePage = (page, nbr) => {
        if (nbr > this.state.page) {
            this.setState(
                {
                    page: this.state.page + 1,
                    beforeCursor: null,
                    afterCursor: this.props.claimsPageInfo.endCursor,
                },
                e => this.props.fetchClaimSummaries(
                    this.props.modulesManager,
                    this.filtersToQueryParams()
                )
            )
        } else if (nbr < this.state.page) {
            this.setState(
                {
                    page: this.state.page - 1,
                    beforeCursor: this.props.claimsPageInfo.startCursor,
                    afterCursor: null,
                },
                e => this.props.fetchClaimSummaries(
                    this.props.modulesManager,
                    this.filtersToQueryParams()
                )
            )
        }
    }

    openMenu = (event) => {
        this.setState({ menuAnchor: event.currentTarget });
    }

    closeMenu = () => {
        this.setState({ menuAnchor: null });
    }

    rowIdentifier = (r) => r.id

    feedbackColFormatter = c =>
        !!this.props.feedbackColFormatter ?
            this.props.feedbackColFormatter(c) :
            formatMessage(this.props.intl, "claim", `feedbackStatus.${c.feedbackStatus}`)
    reviewColFormatter = c =>
        !!this.props.reviewColFormatter ?
            this.props.reviewColFormatter(c) :
            formatMessage(this.props.intl, "claim", `reviewStatus.${c.reviewStatus}`)

    triggerAction = a => {
        let s = [...this.state.selection]
        this.setState(
            {
                selection: [],
                clearAll: this.state.clearAll + 1
            },
            e => a(s));
    }
    preHeaders = () => this.state.selection.length ?
        [
            '', '', '', '', '',
            <FormattedMessage
                module="claim"
                id="claimSummaries.selection.claimed"
                values={{
                    claimed: <b>{formatAmount(this.props.intl, this.state.selection.reduce((t, v) => t + v.claimed, 0))}</b>,
                }}
            />,
            <FormattedMessage
                module="claim"
                id="claimSummaries.selection.approved"
                values={{
                    approved: <b>{formatAmount(this.props.intl, this.state.selection.reduce((t, v) => t + v.approved, 0))}</b>,
                }}
            />,
            , ''
        ]
        : ['\u200b', '', '', '', '','', '', '',] //fixing pre headers row height!

    render() {
        const { intl, classes, claims, claimsPageInfo, fetchingClaims, fetchedClaims, errorClaims,
            onDoubleClick, actions, fixFilter } = this.props;
        return (
            <Fragment>
                {!!this.withDialog && (
                    <ClaimFilterDialog
                        open={this.state.open}
                        onClose={e => this.setState({ open: false })}
                        filters={this.state.filters}
                        apply={this.applyFilters}
                        onChangeFilter={this.onChangeFilter}
                    />
                )}
                <Searcher
                    module="claim"
                    open={e => this.setState({ open: true })}
                    refresh={this.applyFilters}
                    apply={this.applyFilters}
                    del={this.deleteFilter}
                    filters={this.state.filters}
                    filterPane={
                        !this.withDialog && <ClaimFilter
                            fixFilter={fixFilter}
                            filters={this.state.filters}
                            apply={this.applyFilters}
                            onChangeFilter={this.onChangeFilter}
                        />}
                />
                <ProgressOrError progress={fetchingClaims} error={errorClaims} />
                {!!fetchedClaims && (
                    <Paper className={classes.paper}>
                        <Grid container>
                            <Grid item xs={8}>
                                <Grid container alignItems="center" className={classes.paperHeader}>
                                    <Grid item xs={8} className={classes.paperHeaderTitle}>
                                        <FormattedMessage module="claim" id="claimSummaries" values={{ count: claimsPageInfo.totalCount }} />
                                    </Grid>
                                    <Grid item xs={4} className={classes.paperHeaderMessage}>
                                        <SelectionPane intl={intl} selection={this.state.selection} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container direction="row" justify="flex-end">
                                    <StyledSelectionMenu
                                        selection={this.state.selection}
                                        claims={claims}
                                        clearSelected={this.clearSelected}
                                        selectAll={this.selectAll}
                                        triggerAction={this.triggerAction}
                                        actions={actions}
                                    />
                                </Grid>

                            </Grid>
                            <Grid item xs={12} className={classes.paperDivider}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12}>
                                <Table
                                    module="claim"
                                    preHeaders={this.preHeaders()}
                                    headers={[
                                        "claimSummaries.code",
                                        "claimSummaries.healthFacility",
                                        "claimSummaries.claimedDate",
                                        "claimSummaries.feedbackStatus",
                                        "claimSummaries.reviewStatus",
                                        "claimSummaries.claimed",
                                        "claimSummaries.approved",
                                        "claimSummaries.claimStatus"
                                    ]}
                                    aligns={[, , , , , "right", "right"]}
                                    itemFormatters={[
                                        c => c.code,
                                        c => `${c.healthFacility.code} ${c.healthFacility.name}`,
                                        c => formatDateFromIso(intl, c.dateClaimed),
                                        c => this.feedbackColFormatter(c),
                                        c => this.reviewColFormatter(c),
                                        c => formatAmount(intl, c.claimed),
                                        c => formatAmount(intl, c.approved),
                                        c => formatMessage(intl, "claim", `claimStatus.${c.status}`)
                                    ]}
                                    items={claims}
                                    withPagination={true}
                                    withSelection={true}
                                    itemIdentifier={this.rowIdentifier}
                                    selection={this.state.selection}
                                    selectAll={this.state.selectAll}
                                    clearAll={this.state.clearAll}
                                    onChangeSelection={this.onChangeSelection}
                                    onDoubleClick={onDoubleClick}
                                    page={this.state.page}
                                    pageSize={this.state.pageSize}
                                    count={claimsPageInfo.totalCount}
                                    onChangePage={this.onChangePage}
                                    rowsPerPageOptions={this.rowsPerPageOptions}
                                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    claims: state.claim.claims,
    claimsPageInfo: state.claim.claimsPageInfo,
    fetchingClaims: state.claim.fetchingClaims,
    fetchedClaims: state.claim.fetchedClaims,
    errorClaims: state.claim.errorClaims,
});


const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        { fetchClaimSummaries },
        dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(ClaimSearcher)
    ))));