import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    formatMessage, formatAmount, NumberInput, ProgressOrError, Form, FormTable,
    PublishedComponent, DatePicker, fromISODate, AmountInput, TextInput, withModulesManager
} from "@openimis/fe-core";
import { Grid } from "@material-ui/core";
import { fetchClaim } from "../actions";
import _ from "lodash";

const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    item: theme.paper.item,
});

class RawHeadPanel extends Component {
    render() {
        const { intl, classes, edited, updateAttribute } = this.props;
        if (!edited) return null;
        return (
            <Grid container>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="location.HealthFacilityPicker"
                        value={edited.healthFacility}
                        onChange={(v, s) => updateAttribute("healthFacility", v)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="insuree.InsureePicker"
                        value={edited.insuree}
                        onChange={(v, s) => updateAttribute("insuree", v)}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <DatePicker
                        value={fromISODate(edited.dateClaimed)}
                        module="claim"
                        label="dateClaimed"
                        onChange={d => updateAttribute("dateClaimed", d)}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <DatePicker
                        value={fromISODate(edited.dateFrom)}
                        module="claim"
                        label="visitDateFrom"
                        onChange={d => updateAttribute("dateFrom", d)}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <DatePicker
                        value={fromISODate(edited.dateTo)}
                        module="claim"
                        label="visitDateTo"
                        onChange={d => updateAttribute("dateTo", d)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.VisitTypePicker"
                        name="visitType"
                        label={formatMessage(intl, "claim", "visitType")}
                        value={edited.visitType}
                        onChange={(v, s) => updateAttribute("visitType", v)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.DiagnosisPicker"
                        name="mainDiagnosis"
                        label={formatMessage(intl, "claim", "mainDiagnosis")}
                        value={edited.icd}
                        onChange={(v, s) => updateAttribute("icd", v)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <TextInput
                        module="claim"
                        label="guaranteeId"
                        value={edited.guaranteeId}
                        onChange={v => updateAttribute("guaranteeId", v)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <AmountInput
                        value={edited.claimed}
                        module="claim"
                        label="claimed"
                        onChange={d => updateAttribute("claimed", d)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.DiagnosisPicker"
                        name="secDiagnosis1"
                        label={formatMessage(intl, "claim", "secDiagnosis1")}
                        value={edited.icd1}
                        onChange={(v, s) => updateAttribute("icd1", v)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.DiagnosisPicker"
                        name="secDiagnosis2"
                        label={formatMessage(intl, "claim", "secDiagnosis2")}
                        value={edited.icd2}
                        onChange={(v, s) => updateAttribute("icd2", v)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.DiagnosisPicker"
                        name="secDiagnosis3"
                        label={formatMessage(intl, "claim", "secDiagnosis3")}
                        value={edited.icd3}
                        onChange={(v, s) => updateAttribute("icd3", v)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.DiagnosisPicker"
                        name="secDiagnosis4"
                        label={formatMessage(intl, "claim", "secDiagnosis4")}
                        value={edited.icd4}
                        onChange={(v, s) => updateAttribute("icd4", v)}
                    />
                </Grid>
                <Grid item xs={6} className={classes.item}>
                    <TextInput
                        module="claim"
                        label="explanation"
                        value={edited.explanation}
                        onChange={v => updateAttribute("explanation", v)}
                    />
                </Grid>
                <Grid item xs={6} className={classes.item}>
                    <TextInput
                        module="claim"
                        label="adjustment"
                        value={edited.adjustment}
                        onChange={v => updateAttribute("adjustment", v)}
                    />
                </Grid>
            </Grid>
        )
    }
}
const HeadPanel = injectIntl(withTheme(withStyles(styles)(RawHeadPanel)))


class RawChildPanel extends Component {
    state = {
        data: []
    }
    constructor(props) {
        super(props);
        const { type, picker } = this.props;
        this.columns = [
            {
                title: formatMessage(props.intl, "claim", `edit.${type}s.${type}`),
                render: row => <PublishedComponent
                    id={picker}
                    withLabel={false}
                    value={row[type]}
                    onChange={v => this._onChange(row, type, v)}
                />
            },
            {
                title: formatMessage(props.intl, "claim", `edit.${type}s.quantity`),
                render: row => <NumberInput
                    value={row.qtyProvided}
                    onChange={v => this._onChange(row, "qtyProvided", v)}
                />
            },
            {
                title: formatMessage(props.intl, "claim", `edit.${type}s.price`),
                render: row => <AmountInput
                    value={row.priceAsked}
                    onChange={v => this._onChange(row, "priceAsked", v)}
                />
            },
            {
                title: formatMessage(props.intl, "claim", `edit.${type}s.explanation`),
                render: row => <TextInput
                    value={row.explanation}
                    onChange={v => this._onChange(row, "explanation", v)}
                />
            },
            {
                title: formatMessage(props.intl, "claim", `edit.${type}s.justification`),
                render: row => <TextInput
                    value={row.justification}
                    onChange={v => this._onChange(row, "justification", v)}
                />
            },
        ];
    }

    _onChange = (row, attr, v) => {
        const data = this.state.data;
        data[row.tableData.id][attr] = v;
        this.props.updateAttribute(`${this.props.type}s`, data);
        if (data.length === (row.tableData.id + 1)) {
            data.push({});
        }
        this.setState({ data });
    }

    componentDidMount() {
        if (!!this.props.edited[`${this.props.type}s`]) {
            this.setState({ data: (this.props.edited[`${this.props.type}s`] || []).concat([{}]) })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!!this.props.edited[`${this.props.type}s`]
            && !_.isEqual(prevProps.edited[`${this.props.type}s`], this.props.edited[`${this.props.type}s`])) {
            this.setState({ data: (this.props.edited[`${this.props.type}s`] || []).concat([{}]) })
        }
    }

    onRowDelete = (oldData, resolve) => {
        const data = this.state.data;
        data.splice(oldData.tableData.id, 1);
        this.props.updateAttribute(`${this.props.type}s`, data);
        this.setState(
            { data },
            () => resolve()
        )
    }

    render() {
        const { intl, edited } = this.props;
        if (!edited) return null;
        const totalAmount = formatAmount(
            intl,
            this.state.data.reduce(
                (sum, r) => sum + (!!r.qtyProvided && !!r.priceAsked ? r.qtyProvided * r.priceAsked : 0), 0)
        );
        return (
            <FormTable
                title={formatMessage(intl, "claim", `edit.${this.props.type}s.title`, { totalAmount })}
                module="claim"
                noRecord={`no${this.props.type}`}
                columns={this.columns}
                data={this.state.data}
                onRowDelete={this.onRowDelete}
            />
        )
    }
}

class RawServicesPanel extends Component {
    render() {
        return <RawChildPanel {...this.props} type="service" picker="medical.ServicePicker" />
    }
}
const ServicesPanel = injectIntl(withTheme(withStyles(styles)(RawServicesPanel)))

class RawItemsPanel extends Component {
    render() {
        return <RawChildPanel {...this.props} type="item" picker="medical.ItemPicker" />
    }
}

const ItemsPanel = injectIntl(withTheme(withStyles(styles)(RawItemsPanel)))

class ClaimEditPage extends Component {

    componentDidMount() {
        if (this.props.claim_id) {
            this.props.fetchClaim(this.props.modulesManager, this.props.claim_id);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.fetchedClaim !== this.props.fetchedClaim && !!this.props.fetchedClaim) {
            this.setState({
                dirty: false,
            })
        }
    }

    save = (claim) => {
        console.log("SAVE " + JSON.stringify(claim));
    }

    reload = () => {
        this.props.fetchClaim(this.props.modulesManager, this.props.claim_id);
    }

    render() {
        const { fetchingClaim, fetchedClaim, errorClaim } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingClaim} error={errorClaim} />
                {!!fetchedClaim && (
                    <Form back="/claim/claims"
                        module="claim"
                        edited={this.props.claim}
                        title="edit.title"
                        save={this.save}
                        reload={this.reload}
                        HeadPanel={HeadPanel}
                        Panels={[
                            ServicesPanel,
                            ItemsPanel
                        ]}
                    />
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = (state, props) => ({
    claim: state.claim.claim,
    fetchingClaim: state.claim.fetchingClaim,
    fetchedClaim: state.claim.fetchedClaim,
    errorClaim: state.claim.errorClaim,
    claim_id: props.match.params.claim_id,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchClaim }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(ClaimEditPage)
    )))
);