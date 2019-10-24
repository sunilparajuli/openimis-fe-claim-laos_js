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
    CircularProgress,
} from "@material-ui/core";
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import SortIcon from "@material-ui/icons/UnfoldMore";
import SortAscIcon from "@material-ui/icons/ExpandLess";
import SortDescIcon from "@material-ui/icons/ExpandMore";
import { Searcher, Contributions } from "@openimis/fe-core";
import ClaimFilter from "./ClaimFilter";
import {
    withModulesManager,
    formatMessage, formatDateFromISO, formatAmount,
    FormattedMessage, ProgressOrError, Table, PublishedComponent
} from "@openimis/fe-core";
import { fetchClaimSummaries } from "../actions";

const CLAIM_SEARCHER_CONTRIBUTION_KEY = "claim.Searcher";

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
    tableHeaderAction: theme.table.headerAction,
    processing: {
        margin: theme.spacing(1)
    }
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
        const { intl, classes, selection, clearSelected, selectAll, actions, processing } = this.props;
        if (processing) {
            return <CircularProgress className={classes.processing} size={24} />
        }
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
        orderBy: "-dateClaimed",
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
        this.highlightAmount = parseInt(props.modulesManager.getConf("fe-claim", "claimFilter.highlightAmount", 0));
        this.highlightAltInsurees = props.modulesManager.getConf("fe-claim", "claimFilter.highlightAltInsurees", true);
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

    forcedFilters() {
        return !this.props.forcedFilters ? [] : [...this.props.forcedFilters.filter(f => !f.startsWith('random'))];
    }

    randomCount() {
        let random = !!this.props.forcedFilters && this.props.forcedFilters.filter(f => f.startsWith('random'));
        if (!random || random.length === 0) {
            return null;
        }
        return parseInt(random[0].split(":")[1]);
    }

    filtersToQueryParams = () => {
        let prms = Object.keys(this.state.filters)
            .filter(f => !!this.state.filters[f]['filter'])
            .map(f => this.state.filters[f]['filter']);
        let forced = this.forcedFilters();
        let random = this.randomCount();
        if (forced.length > 0) {
            prms.push(forced);
        }
        if (!!random) {
            prms.push(`first: ${random}`);
            prms.push(`orderBy: ["dateClaimed", "?"]`);
        } else {
            prms.push(`orderBy: ["${this.state.orderBy}"]`);
        }
        if (!forced.length && !random) {
            prms.push(`first: ${this.state.pageSize}`);
            if (!!this.state.afterCursor) {
                prms.push(`after: "${this.state.afterCursor}"`)
            }
            if (!!this.state.beforeCursor) {
                prms.push(`before: "${this.state.beforeCursor}"`)
            }
        }
        return prms;
    }

    onChangeFilters = (fltrs) => {
        let filters = { ...this.state.filters };
        fltrs.forEach(filter => {
            if (filter.value === null) {
                delete (filters[filter.id]);
            } else {
                filters[filter.id] = { value: filter.value, filter: filter.filter };
            }
        });
        this.setState(
            { filters },
            e => this.applyFilters()
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

    rowIdentifier = (r) => r.uuid

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
            '', '', '', '', '', '',
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
        : ['\u200b', '', '', '', '', '', '', '', ''] //fixing pre headers row height!

    rowHighlighted = claim => !!this.highlightAmount && claim.claimed > this.highlightAmount
    rowHighlightedAlt = claim => !!this.highlightAltInsurees &&
        this.state.selection.filter(c => _.isEqual(c.insuree, claim.insuree)).length &&
        !this.state.selection.includes(claim)

    sort = attr => {
        this.setState({ orderBy: attr },
            e => this.props.fetchClaimSummaries(
                this.props.modulesManager,
                this.filtersToQueryParams()
            ))
    }

    formatSorter = (attr, asc = true) => {
        let random = this.randomCount();
        if (!!random) return null;
        if (this.state.orderBy === attr) {
            return (
                <IconButton size="small" onClick={e => this.sort('-' + attr)}>
                    <SortAscIcon size={24} />
                </IconButton>)
        } else if (this.state.orderBy === '-' + attr) {
            return (
                <IconButton size="small" onClick={e => this.sort(attr)} >
                    <SortDescIcon size={24} />
                </IconButton>)
        } else {
            return (
                <IconButton size="small" onClick={e => asc ? this.sort(attr) : this.sort('-' + attr)}>
                    <SortIcon size={24} />
                </IconButton>)
        }
    }

    render() {
        const { modulesManager, intl, classes, claims, claimsPageInfo, fetchingClaims, fetchedClaims, errorClaims,
            onDoubleClick, actions, processing = false, fixFilter } = this.props;

        let count = this.randomCount();
        if (!count || !!this.forcedFilters().length > 0) {
            count = claimsPageInfo.totalCount;
        }

        return (
            <Fragment>
                <Searcher
                    module="claim"
                    open={e => this.setState({ open: true })}
                    refresh={this.applyFilters}
                    apply={this.applyFilters}
                    del={this.deleteFilter}
                    filters={this.state.filters}
                    filterPane={
                        <ClaimFilter
                            fixFilter={fixFilter}
                            filters={this.state.filters}
                            apply={this.applyFilters}
                            onChangeFilters={this.onChangeFilters}
                        />}
                />
                <Contributions contributionKey={CLAIM_SEARCHER_CONTRIBUTION_KEY} />
                <Paper className={classes.paper}>
                    <Grid container>
                        <ProgressOrError progress={fetchingClaims} error={errorClaims} />
                        {!!fetchedClaims && !errorClaims && (
                            <Fragment>
                                <Grid item xs={8}>
                                    <Grid container alignItems="center" className={classes.paperHeader}>
                                        <Grid item xs={8} className={classes.paperHeaderTitle}>
                                            <FormattedMessage module="claim" id="claimSummaries" values={{ count }} />
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
                                            processing={processing}
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
                                            "claimSummaries.insuree",
                                            "claimSummaries.claimedDate",
                                            "claimSummaries.feedbackStatus",
                                            "claimSummaries.reviewStatus",
                                            "claimSummaries.claimed",
                                            "claimSummaries.approved",
                                            "claimSummaries.claimStatus"
                                        ]}
                                        headerActions={[
                                            () => this.formatSorter('code'),
                                            () => this.formatSorter('healthFacility__code'),
                                            () => this.formatSorter('insuree__last_name'),
                                            () => this.formatSorter('dateClaimed', false),
                                            () => null,
                                            () => null,
                                            () => this.formatSorter('claimed', false),
                                            () => this.formatSorter('approved', false)
                                        ]}
                                        aligns={[, , , , , , , "right", "right"]}
                                        itemFormatters={[
                                            c => c.code,
                                            c => <PublishedComponent
                                                readOnly={true}
                                                id="location.HealthFacilityPicker" withLabel={false} value={c.healthFacility}
                                            />,
                                            c => <PublishedComponent
                                                readOnly={true}
                                                id="insuree.InsureePicker" withLabel={false} value={c.insuree}
                                            />,
                                            c => formatDateFromISO(modulesManager, intl, c.dateClaimed),
                                            c => this.feedbackColFormatter(c),
                                            c => this.reviewColFormatter(c),
                                            c => formatAmount(intl, c.claimed),
                                            c => formatAmount(intl, c.approved),
                                            c => formatMessage(intl, "claim", `claimStatus.${c.status}`)
                                        ]}
                                        rowHighlighted={this.rowHighlighted}
                                        rowHighlightedAlt={this.rowHighlightedAlt}
                                        items={claims}
                                        withPagination={!this.props.forcedFilters}
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
                            </Fragment>
                        )}
                    </Grid>
                </Paper>
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
