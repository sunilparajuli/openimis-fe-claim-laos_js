import React, { Component, Fragment } from "react";
import _debounce from "lodash/debounce";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import _ from "lodash";
import { Grid } from "@material-ui/core";
import {
    formatMessage, chip, toISODate, withModulesManager,
    PublishedComponent, DatePicker, InputText
} from "@openimis/fe-core";

const styles = theme => ({
    dialogTitle: theme.dialog.title,
    dialogContent: theme.dialog.content,
    form: {
        padding: 0
    },
    formItem: {
        padding: theme.spacing(1)
    },
});


class Admin extends Component {

    render() {
        const { intl, classes, filters, onChangeFilter } = this.props;
        return (
            <Grid container className={classes.form}>
                <Grid item xs={2} className={classes.formItem}>
                    <PublishedComponent
                        id="location.RegionSelect"
                        initValue={(filters['region'] && filters['region']['value']) || null}
                        onChange={(v, s) => onChangeFilter(
                            'region', v,
                            chip(intl, "claim", "ClaimFilter.region", s),
                            `healthFacility_Location_Parent_Id: "${!!v && v.id}"`
                        )}
                    />
                </Grid>
                <Grid item xs={2} className={classes.formItem}>
                    <PublishedComponent
                        id="location.DistrictSelect"
                        initValue={(filters['district'] && filters['district']['value']) || null}
                        onChange={(v, s) => onChangeFilter(
                            'district', v,
                            chip(intl, "claim", "ClaimFilter.district", s),
                            `healthFacility_Location_Id: "${!!v && v.id}"`
                        )}
                    />
                </Grid>
                <Grid item xs={3} className={classes.formItem}>
                    <PublishedComponent
                        id="location.HealthFacilitySelect"
                        initValue={(filters['healthFacility'] && filters['healthFacility']['value']) || null}
                        onChange={(v, s) => onChangeFilter(
                            'healthFacility', v,
                            chip(intl, "claim", "ClaimFilter.healthFacility", s),
                            `healthFacility_Id: "${!!v && v.id}"`
                        )}
                    />
                </Grid>
                <Grid item xs={2} className={classes.formItem}>
                    <PublishedComponent
                        id="claim.ClaimAdminSelect"
                        initValue={(filters['claimAdmin'] && filters['claimAdmin']['value']) || null}
                        onChange={(v, s) => onChangeFilter(
                            'claimAdmin', v,
                            chip(intl, "claim", "ClaimFilter.claimAdmin", s),
                            `admin_Id: "${!!v && v.id}"`
                        )}
                    />
                </Grid>
                <Grid item xs={3} className={classes.formItem}>
                    <PublishedComponent
                        id="claim.BatchRunSelect"
                        initValue={(filters['batchRun'] && filters['batchRun']['value']) || null}
                        scope={!!filters['district'] && filters['district']['value']}
                        onChange={(v, s) => onChangeFilter(
                            'batchRun', v,
                            chip(intl, "claim", "BatchRun", s),
                            `batchRun_Id: "${!!v && v.id}"`
                        )}
                    />
                </Grid>
            </Grid>
        )
    }
}

class Details extends Component {

    debouncedOnChangeFilter = _debounce(
        this.props.onChangeFilter,
        this.props.modulesManager.getConf("fe-claim", "debounceTime", 800)
    )


    render() {
        const { intl, classes, filters, onChangeFilter } = this.props;
        return (
            <Grid container className={classes.form}>
                <Grid item xs={1} className={classes.formItem}>
                    <PublishedComponent
                        id="claim.ClaimStatusSelect"
                        name="claimStatus"
                        value={(filters['claimStatus'] && filters['claimStatus']['value']) || null}
                        onChange={(v, s) => onChangeFilter(
                            'claimStatus', v,
                            chip(intl, "claim", "claimStatus", s),
                            `status: ${v}`
                        )}
                    />
                </Grid>
                <Grid item xs={1} className={classes.formItem}>
                    <PublishedComponent
                        id="claim.ReviewStatusSelect"
                        name="reviewStatus"
                        value={(filters['reviewStatus'] && filters['reviewStatus']['value']) || null}
                        onChange={(v, s) => onChangeFilter(
                            'reviewStatus', v,
                            chip(intl, "claim", "reviewStatus", s),
                            `reviewStatus: ${v}`
                        )}
                    />
                </Grid>
                <Grid item xs={1} className={classes.formItem}>
                    <PublishedComponent
                        id="claim.FeedbackStatusSelect"
                        name="feedbackStatus"
                        value={(filters['feedbackStatus'] && filters['feedbackStatus']['value']) || null}
                        onChange={(v, s) => onChangeFilter(
                            'feedbackStatus', v,
                            chip(intl, "claim", "feedbackStatus", s),
                            `feedbackStatus: ${v}`
                        )}
                    />
                </Grid>
                <Grid item xs={2} className={classes.formItem}>
                    <InputText
                        module="claim" label="ClaimFilter.claimNo"
                        name="claimNo"
                        value={(filters['claimNo'] && filters['claimNo']['value']) || null}
                        onChange={v => this.debouncedOnChangeFilter(
                            'claimNo', v,
                            chip(intl, "claim", "ClaimFilter.claimNo", v),
                            `code_Icontains: "${v}"`
                        )}
                    />
                </Grid>
                <Grid item xs={3} className={classes.formItem}>
                    <InputText
                        module="claim" label="ClaimFilter.insureeCHFID"
                        name="chfId"
                        value={(filters['chfId'] && filters['chfId']['value']) || null}
                        onChange={v => this.debouncedOnChangeFilter(
                            'chfId', v,
                            chip(intl, "claim", "ClaimFilter.chfId", v),
                            `insuree_ChfId: "${v}"`
                        )}
                    />
                </Grid>
                <Grid item xs={2} className={classes.formItem}>
                    <InputText
                        module="claim" label="ClaimFilter.claimedAbove"
                        name="claimedAbove"
                        type="number"
                        value={(filters['claimedbove'] && filters['claimedAbove']['value']) || null}
                        onChange={v => this.debouncedOnChangeFilter(
                            'claimedAbove', (!v ? null : v),
                            chip(intl, "claim", "ClaimFilter.claimedAbove", v),
                            `claimed_Gte: ${v}`
                        )}
                    />
                </Grid>
                <Grid item xs={2} className={classes.formItem}>
                    <InputText
                        module="claim" label="ClaimFilter.claimedUnder"
                        name="claimedUnder"
                        type="number"
                        value={(filters['claimedUnder'] && filters['claimedUnder']['value']) || null}
                        onChange={v => this.debouncedOnChangeFilter(
                            'claimedUnder', (!v ? null : v),
                            chip(intl, "claim", "ClaimFilter.claimedUnder", v),
                            `claimed_Lte: ${v}`
                        )}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Grid container>
                        <Grid item xs={6} className={classes.formItem}>
                            <DatePicker
                                value={(filters['visitDateFrom'] && filters['visitDateFrom']['value']) || null}
                                module="claim"
                                label="ClaimFilter.visitDateFrom"
                                onChange={d => onChangeFilter(
                                    'visitDateFrom', d,
                                    chip(intl, "claim", "ClaimFilter.visitDateFrom", toISODate(d)),
                                    `dateFrom: "${toISODate(d)}"`
                                )}
                            />
                        </Grid>
                        <Grid item xs={6} className={classes.formItem}>
                            <DatePicker
                                value={(filters['visitDateTo'] && filters['visitDateTo']['value']) || null}
                                module="claim"
                                label="ClaimFilter.visitDateTo"
                                onChange={d => onChangeFilter(
                                    'visitDateTo', d,
                                    chip(intl, "claim", "ClaimFilter.visitDateTo", toISODate(d)),
                                    `dateTo: "${toISODate(d)}"`
                                )}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <Grid container>
                        <Grid item xs={6} className={classes.formItem}>
                            <DatePicker
                                value={(filters['claimDateFrom'] && filters['claimDateFrom']['value']) || null}
                                module="claim"
                                label="ClaimFilter.claimDateFrom"
                                onChange={d => onChangeFilter(
                                    'claimDateFrom', d,
                                    chip(intl, "claim", "ClaimFilter.claimDateFrom", toISODate(d)),
                                    `dateClaimed_Gte: "${toISODate(d)}"`
                                )}
                            />
                        </Grid>
                        <Grid item xs={6} className={classes.formItem}>
                            <DatePicker
                                value={(filters['claimDateTo'] && filters['claimDateTo']['value']) || null}
                                module="claim"
                                label="ClaimFilter.claimDateTo"
                                onChange={d => onChangeFilter(
                                    'claimDateTo', d,
                                    chip(intl, "claim", "ClaimFilter.claimDateTo", toISODate(d)),
                                    `dateClaimed_Lte: "${toISODate(d)}"`
                                )}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3} className={classes.formItem}>
                    <PublishedComponent
                        id="medical.DiagnosisSelect"
                        name="mainDiagnosis"
                        label={formatMessage(intl, "claim", "mainDiagnosis")}
                        value={(filters['mainDiagnosis'] && filters['mainDiagnosis']['value']) || null}
                        onChange={(v, s) => onChangeFilter(
                            'mainDiagnosis', v,
                            chip(intl, "claim", "mainDiagnosis", s),
                            `icd_Id: "${!!v && v.id}"`
                        )}
                    />
                </Grid>
                <Grid item xs={3} className={classes.formItem}>
                    <PublishedComponent
                        id="medical.VisitTypeSelect"
                        name="visitType"
                        value={(filters['visitType'] && filters['visitType']['value']) || null}
                        onChange={(v, s) => onChangeFilter(
                            'visitType', v,
                            chip(intl, "claim", "visitType", s),
                            `visitType: "${v}"`
                        )}
                    />
                </Grid>
            </Grid>
        );
    }
}

class ClaimFilter extends Component {

    render() {
        const { classes } = this.props;
        return (
            <form className={classes.container} noValidate autoComplete="off">
                <Admin {...this.props} />
                <Details {...this.props} />
            </form>
        )
    }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(ClaimFilter))));