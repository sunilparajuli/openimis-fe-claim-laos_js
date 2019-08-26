import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Grid, InputAdornment, IconButton } from "@material-ui/core";
import FilterIcon from "@material-ui/icons/FilterList";
import { formatMessage, chip, TextInput, AmountInput, withModulesManager } from "@openimis/fe-core";
import ClaimsSearcher from "./ClaimsSearcher";
import { selectForFeedback, selectForReview, submit } from "../actions";
import { withTheme, withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    item: {
        padding: theme.spacing(1)
    },
    toggledButton: {
        backgroundColor: theme.palette.toggledButton
    }
});

class RawFixFilter extends Component {
    state = {
        random: 0,
        value: 0,
        variance: 0,
        filters: {},
    }
    componentDidMount() {
        this.setState(this.props.modulesManager.getConf(
            "fe-claim",
            "claim.ReviewsPage.initState",
            { random: 5, value: 0, variance: 10 }
        ));
    }
    randomChange = (v) => {
        let filters = this.state.filters;
        delete(filters.random)
        this.setState({
            random: parseFloat(v),
            filters
        })
    }
    valueChange = (v) => {
        let filters = this.state.filters;
        delete(filters.value)
        this.setState({
            value: parseFloat(v),
            filters
        })
    }
    varianceChange = (v) => {
        let filters = this.state.filters;
        delete(filters.value)
        this.setState({
            variance: parseFloat(v),
            filters
        })
    }
    toggleRandomFilter = (e) => {
        let filters = this.state.filters;
        if (!!filters.random) {
            delete (filters.random);
        } else {
            filters.random = [`random: ${this.state.random}`]
        }
        this.setState(
            { filters },
            e => this.props.filtersChange(Object.values(this.state.filters).flat())
        )
    }
    toggleValueFilter = (e) => {
        let filters = this.state.filters;
        if (!!filters.value) {
            delete (filters.value);
        } else {
            let min = this.state.value;
            let max = this.state.value;
            if (this.state.variance !== 0) {
                min = min - min * this.state.variance / 100;
                max = max + max * this.state.variance / 100;
            }
            filters.value = [`claimed_Gte: ${min}`, `claimed_Lte: ${max}`]
        }
        this.setState({ filters },
            e => this.props.filtersChange(Object.values(this.state.filters).flat())
        )
    }
    render() {
        const { classes } = this.props;
        return (
            <Grid container justify="center" alignItems="center" direction="row">
                <Grid item xs={3} className={classes.item}>
                    <TextInput
                        module="claim" label="ClaimFilter.Reviews.random"
                        name="random"
                        value={this.state.random}
                        onChange={this.randomChange}
                        startAdornment={<InputAdornment position="start">%</InputAdornment>}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    className={!!this.state.filters.random ? classes.toggledButton : null}
                                    onClick={this.toggleRandomFilter}
                                    edge="end">
                                    <FilterIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        inputProps={{
                            step: 10,
                            min: 0,
                            max: 100,
                            type: "number",
                        }}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item} />
                <Grid item xs={3} className={classes.item}>
                    <Grid container diretcion="row">
                        <Grid item xs={6}>
                            <AmountInput
                                module="claim" label="ClaimFilter.Reviews.value"
                                value={this.state.value}
                                onChange={this.valueChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextInput
                                module="claim" label="ClaimFilter.Reviews.variance"
                                value={this.state.variance}
                                onChange={this.varianceChange}
                                startAdornment={
                                    <InputAdornment position="start">%</InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            className={!!this.state.filters.value ? classes.toggledButton : null}
                                            onClick={this.toggleValueFilter}
                                            edge="end">
                                            <FilterIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{
                                    step: 10,
                                    min: 0,
                                    max: 100,
                                    type: "number",
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

const FixFilter = withModulesManager(withTheme(withStyles(styles)(RawFixFilter)))

class ReviewsPage extends Component {

    state = {
        forcedFilters: [],
    }

    constructor(props) {
        super(props);
        this.defaultFilters = props.modulesManager.getConf(
            "fe-claim",
            "reviews.defaultFilters",
            {
                "claimStatus": {
                    "value": 4,
                    "chip": chip(
                        this.props.intl, "claim", "claimStatus",
                        formatMessage(this.props.intl, "claim", "claimStatus.4")
                    ),
                    "filter": "status: 4"
                }
            }
        );
    }

    filtersChange = (filters) => this.setState({ forcedFilters: filters })

    canMarkSelectedForFeedback = (selection) => !!selection && selection.length && selection.filter(s => s.feedbackStatus <= 2).length === selection.length

    markSelectedForFeedback = (selection) => {
        alert('SELECT FOR FEEDBACK #' + selection.length);
        //this.props.selectForFeedback(this.state.selection);
    }

    canMarkSelectedForReview = (selection) => !!selection && selection.length && selection.filter(s => s.reviewStatus <= 2).length === selection.length

    markSelectedForReview = (selection) => {
        alert('SELECT FOR REVIEW #' + selection.length);
        //this.props.selectForReview(this.state.selection);
    }

    canProcessSelected = (selection) => !!selection && selection.length && selection.filter(s => s.status === 4).length === selection.length

    processSelected = (selection) => {
        alert('PROCESS #' + selection.length);
        //this.props.submit(this.state.selection);
    }

    render() {
        const { classes } = this.props;
        return (
            <ClaimsSearcher
                defaultFilters={this.defaultFilters}
                forcedFilters={this.state.forcedFilters}
                fixFilter={<FixFilter filtersChange={this.filtersChange} />}
                actions={[
                    { label: "claimSummaries.markSelectedForFeedback", enabled: this.canMarkSelectedForFeedback, action: this.markSelectedForFeedback },
                    { label: "claimSummaries.markSelectedForReview", enabled: this.canMarkSelectedForReview, action: this.markSelectedForReview },
                    { label: "claimSummaries.processSelected", enabled: this.canProcessSelected, action: this.processSelected },
                ]} />
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(ReviewsPage))
));