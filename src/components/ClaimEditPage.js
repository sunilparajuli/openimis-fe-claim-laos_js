import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    formatMessage, formatAmount, NumberInput, ProgressOrError, Form, Table,
    PublishedComponent, DatePicker, fromISODate, AmountInput, TextInput,
    withModulesManager, withHistory, historyPush,
    journalize
} from "@openimis/fe-core";
import { Grid, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { fetchClaim, createClaim } from "../actions";
import _ from "lodash";
import { uuid } from "lodash-uuid";

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
                        label="claimedDate"
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
                        withNull={false}
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
        data: [{}]
    }

    componentDidMount() {
        if (!!this.props.edited[`${this.props.type}s`]) {
            this.setState({ data: (this.props.edited[`${this.props.type}s`] || []).concat([{}]) })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.edited_id && !this.props.edited_id) {
            this.setState({
                data: [{}],
            });
        } else if (!!this.props.edited[`${this.props.type}s`]
            && !_.isEqual(prevProps.edited[`${this.props.type}s`], this.props.edited[`${this.props.type}s`])) {
            this.setState({ data: (this.props.edited[`${this.props.type}s`] || []).concat([{}]) })
        }
    }


    _onChange = (idx, attr, v) => {
        const data = this.state.data;
        data[idx][attr] = v;
        this.props.updateAttribute(`${this.props.type}s`, data);
        if (data.length === (idx + 1)) {
            data.push({});
        }
        this.setState({ data });
    }

    _onDelete = idx => {
        const data = this.state.data;
        data.splice(idx, 1);
        this.props.updateAttribute(`${this.props.type}s`, data);
        this.setState({ data });
    }

    render() {
        const { intl, edited, type, picker } = this.props;
        if (!edited) return null;
        const totalAmount = formatAmount(
            intl,
            this.state.data.reduce(
                (sum, r) => sum + (!!r.qtyProvided && !!r.priceAsked ? r.qtyProvided * r.priceAsked : 0), 0)
        );
        return (
            <Table
                module="claim"
                header={`edit.${this.props.type}s.title`}
                headerValues={{ totalAmount }}
                headers={[
                    `edit.${type}s.${type}`,
                    `edit.${type}s.quantity`,
                    `edit.${type}s.price`,
                    `edit.${type}s.explanation`,
                    `edit.${type}s.justification`,
                    `edit.${type}s.delete`,
                ]}
                itemFormatters={[
                    (i, idx) => <PublishedComponent
                        id={picker} withLabel={false} value={i[type]}
                        onChange={v => this._onChange(idx, type, v)}
                    />,
                    (i, idx) => <NumberInput value={i.qtyProvided} onChange={v => this._onChange(idx, "qtyProvided", v)} />,
                    (i, idx) => <AmountInput value={i.priceAsked} onChange={v => this._onChange(idx, "priceAsked", v)} />,
                    (i, idx) => <TextInput value={i.explanation} onChange={v => this._onChange(idx, "explanation", v)} />,
                    (i, idx) => <TextInput value={i.justification} onChange={v => this._onChange(idx, "justification", v)} />,
                    (i, idx) => idx === this.state.data.length - 1 ? null : <IconButton onClick={e => this._onDelete(idx)}><DeleteIcon /></IconButton>
                ]}
                items={this.state.data}
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

    state = {
        reset: 0,
        claim: {},
    }

    componentDidMount() {
        if (this.props.claim_id) {
            this.props.fetchClaim(this.props.modulesManager, this.props.claim_id);
        } else {
            this.setState({ dirty: true });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.claim_id && !this.props.claim_id) {
            this.setState({
                claim: {},
            });
        } else if (prevProps.fetchedClaim !== this.props.fetchedClaim && !!this.props.fetchedClaim) {
            this.setState({
                claim: this.props.claim,
            })
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.claimMutation);
            this.setState({ reset: this.state.reset + 1 });
        }
    }

    add = () => {
        historyPush(this.props.history, "claim.route.editClaim");
        this.setState({claim: {}})
    }

    save = (claim) => {
        claim.code = uuid().substring(0, 8);  //code should be defined by backend!!
        if (!this.props.claim_id) {
            this.props.createClaim(
                this.props.modulesManager,
                claim,
                formatMessage(
                    this.props.intl,
                    "claim",
                    "CreateClaim.mutationLabel"
                ),
                claim.code
            );
        }
    }

    reload = () => {
        this.props.fetchClaim(this.props.modulesManager, this.props.claim_id);
    }

    render() {
        const { claim_id, fetchingClaim, fetchedClaim, errorClaim } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingClaim} error={errorClaim} />
                {(!!fetchedClaim || !claim_id) && (
                    <Form
                        module="claim"
                        edited_id={claim_id}
                        edited={this.state.claim}
                        reset={this.state.reset}
                        title="edit.title"
                        add={this.add}
                        save={this.save}
                        reload={claim_id && this.reload}
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
    submittingMutation: state.claim.submittingMutation,
    claimMutation: state.claim.claimMutation,
    claim_id: props.match.params.claim_id
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchClaim, createClaim, journalize }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(ClaimEditPage)
    ))))
);