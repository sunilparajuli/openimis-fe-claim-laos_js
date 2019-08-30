import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import {
    formatMessage,
    PublishedComponent, DatePicker, fromISODate, AmountInput, TextInput,
} from "@openimis/fe-core";
import { Grid } from "@material-ui/core";
import _ from "lodash";

const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    item: theme.paper.item,
});

class ClaimMasterPanel extends Component {
    render() {
        const { intl, classes, edited, updateAttribute, forReview, forFeedback } = this.props;
        if (!edited) return null;
        let readOnly = !!forReview || !!forFeedback
        return (
            <Grid container>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="location.HealthFacilityPicker"
                        value={edited.healthFacility}
                        onChange={(v, s) => updateAttribute("healthFacility", v)}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="insuree.InsureePicker"
                        value={edited.insuree}
                        onChange={(v, s) => updateAttribute("insuree", v)}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <DatePicker
                        value={fromISODate(edited.dateClaimed)}
                        module="claim"
                        label="claimedDate"
                        onChange={d => updateAttribute("dateClaimed", d)}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <DatePicker
                        value={fromISODate(edited.dateFrom)}
                        module="claim"
                        label="visitDateFrom"
                        onChange={d => updateAttribute("dateFrom", d)}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <DatePicker
                        value={fromISODate(edited.dateTo)}
                        module="claim"
                        label="visitDateTo"
                        onChange={d => updateAttribute("dateTo", d)}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.VisitTypePicker"
                        name="visitType"
                        withNull={false}
                        value={edited.visitType}
                        onChange={(v, s) => updateAttribute("visitType", v)}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.DiagnosisPicker"
                        name="mainDiagnosis"
                        label={formatMessage(intl, "claim", "mainDiagnosis")}
                        value={edited.icd}
                        onChange={(v, s) => updateAttribute("icd", v)}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <TextInput
                        module="claim"
                        label="guaranteeId"
                        value={edited.guaranteeId}
                        onChange={v => updateAttribute("guaranteeId", v)}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <AmountInput
                        value={edited.claimed}
                        module="claim"
                        label="claimed"
                        onChange={d => updateAttribute("claimed", d)}
                        readOnly={true}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.DiagnosisPicker"
                        name="secDiagnosis1"
                        label={formatMessage(intl, "claim", "secDiagnosis1")}
                        value={edited.icd1}
                        onChange={(v, s) => updateAttribute("icd1", v)}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.DiagnosisPicker"
                        name="secDiagnosis2"
                        label={formatMessage(intl, "claim", "secDiagnosis2")}
                        value={edited.icd2}
                        onChange={(v, s) => updateAttribute("icd2", v)}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.DiagnosisPicker"
                        name="secDiagnosis3"
                        label={formatMessage(intl, "claim", "secDiagnosis3")}
                        value={edited.icd3}
                        onChange={(v, s) => updateAttribute("icd3", v)}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.DiagnosisPicker"
                        name="secDiagnosis4"
                        label={formatMessage(intl, "claim", "secDiagnosis4")}
                        value={edited.icd4}
                        onChange={(v, s) => updateAttribute("icd4", v)}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xs={6} className={classes.item}>
                    <TextInput
                        module="claim"
                        label="explanation"
                        value={edited.explanation}
                        onChange={v => updateAttribute("explanation", v)}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xs={6} className={classes.item}>
                    <TextInput
                        module="claim"
                        label="adjustment"
                        value={edited.adjustment}
                        onChange={v => updateAttribute("adjustment", v)}
                        readOnly={!!forFeedback}
                    />
                </Grid>
            </Grid>
        )
    }
}
export default injectIntl(withTheme(withStyles(styles)(ClaimMasterPanel)))
