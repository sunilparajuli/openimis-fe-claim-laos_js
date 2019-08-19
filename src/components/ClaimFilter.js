import React, { Component, Fragment } from "react";
import _debounce from "lodash/debounce";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import _ from "lodash";
import { Grid } from "@material-ui/core";
import {
    formatMessage, chip, withModulesManager,
    PublishedComponent, DatePicker, TextInput
} from "@openimis/fe-core";

const styles = theme => ({
    dialogTitle: theme.dialog.title,
    dialogContent: theme.dialog.content,
    form: {
        padding: 0
    },
    item: {
        padding: theme.spacing(1)
    },
});


class Admin extends Component {

    render() {
        const { intl, classes, filters, onChangeFilter } = this.props;
        return (
            <Grid container className={classes.form}>
                <Grid item xs={2} className={classes.item}>
                    <PublishedComponent
                        id="location.RegionPicker"
                        value={(filters['region'] && filters['region']['value'])}
                        onChange={(v, s) => onChangeFilter(
                            'region', v,
                            chip(intl, "claim", "ClaimFilter.region", s),
                            `healthFacility_Location_Parent_Id: "${v.id}"`
                        )}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <PublishedComponent
                        id="location.DistrictPicker"
                        value={(filters['district'] && filters['district']['value'])}
                        onChange={(v, s) => onChangeFilter(
                            'district', v,
                            chip(intl, "claim", "ClaimFilter.district", s),
                            `healthFacility_Location_Id: "${v.id}"`
                        )}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="location.HealthFacilityPicker"
                        value={(filters['healthFacility'] && filters['healthFacility']['value'])}
                        onChange={(v, s) => onChangeFilter(
                            'healthFacility', v,
                            chip(intl, "claim", "ClaimFilter.healthFacility", s),
                            `healthFacility_Id: "${v.id}"`
                        )}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <PublishedComponent
                        id="claim.ClaimAdminPicker"
                        value={(filters['claimAdmin'] && filters['claimAdmin']['value'])}
                        onChange={(v, s) => onChangeFilter(
                            'claimAdmin', v,
                            chip(intl, "claim", "ClaimFilter.claimAdmin", s),
                            `admin_Id: "${v.id}"`
                        )}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="claim.BatchRunPicker"
                        value={(filters['batchRun'] && filters['batchRun']['value'])}
                        scope={!!filters['district'] && filters['district']['value']}
                        onChange={(v, s) => onChangeFilter(
                            'batchRun', v,
                            chip(intl, "claim", "BatchRun", s),
                            `batchRun_Id: "${v.id}"`
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
                <Grid item xs={1} className={classes.item}>
                    <PublishedComponent
                        id="claim.ClaimStatusPicker"
                        name="claimStatus"
                        value={(filters['claimStatus'] && filters['claimStatus']['value'])}
                        onChange={(v, s) => onChangeFilter(
                            'claimStatus', v,
                            chip(intl, "claim", "claimStatus", s),
                            `status: ${v}`
                        )}
                    />
                </Grid>
                <Grid item xs={1} className={classes.item}>
                    <PublishedComponent
                        id="claim.ReviewStatusPicker"
                        name="reviewStatus"
                        value={(filters['reviewStatus'] && filters['reviewStatus']['value'])}
                        onChange={(v, s) => onChangeFilter(
                            'reviewStatus', v,
                            chip(intl, "claim", "reviewStatus", s),
                            `reviewStatus: ${v}`
                        )}
                    />
                </Grid>
                <Grid item xs={1} className={classes.item}>
                    <PublishedComponent
                        id="claim.FeedbackStatusPicker"
                        name="feedbackStatus"
                        value={(filters['feedbackStatus'] && filters['feedbackStatus']['value'])}
                        onChange={(v, s) => onChangeFilter(
                            'feedbackStatus', v,
                            chip(intl, "claim", "feedbackStatus", s),
                            `feedbackStatus: ${v}`
                        )}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <TextInput
                        module="claim" label="ClaimFilter.claimNo"
                        name="claimNo"
                        value={(filters['claimNo'] && filters['claimNo']['value'])}
                        onChange={v => this.debouncedOnChangeFilter(
                            'claimNo', v,
                            chip(intl, "claim", "ClaimFilter.claimNo", v),
                            `code_Icontains: "${v}"`
                        )}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <TextInput
                        module="claim" label="ClaimFilter.insureeCHFID"
                        name="chfId"
                        value={(filters['chfId'] && filters['chfId']['value'])}
                        onChange={v => this.debouncedOnChangeFilter(
                            'chfId', v,
                            chip(intl, "claim", "ClaimFilter.chfId", v),
                            `insuree_ChfId: "${v}"`
                        )}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <TextInput
                        module="claim" label="ClaimFilter.claimedAbove"
                        name="claimedAbove"
                        type="number"
                        value={(filters['claimedbove'] && filters['claimedAbove']['value'])}
                        onChange={v => this.debouncedOnChangeFilter(
                            'claimedAbove', (!v ? null : v),
                            chip(intl, "claim", "ClaimFilter.claimedAbove", v),
                            `claimed_Gte: ${v}`
                        )}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <TextInput
                        module="claim" label="ClaimFilter.claimedUnder"
                        name="claimedUnder"
                        type="number"
                        value={(filters['claimedUnder'] && filters['claimedUnder']['value'])}
                        onChange={v => this.debouncedOnChangeFilter(
                            'claimedUnder', (!v ? null : v),
                            chip(intl, "claim", "ClaimFilter.claimedUnder", v),
                            `claimed_Lte: ${v}`
                        )}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Grid container>
                        <Grid item xs={6} className={classes.item}>
                            <DatePicker
                                value={(filters['visitDateFrom'] && filters['visitDateFrom']['value']) || null}
                                module="claim"
                                label="visitDateFrom"
                                onChange={d => onChangeFilter(
                                    'visitDateFrom', d,
                                    chip(intl, "claim", "visitDateFrom", d),
                                    `dateFrom: "${d}"`
                                )}
                            />
                        </Grid>
                        <Grid item xs={6} className={classes.item}>
                            <DatePicker
                                value={(filters['visitDateTo'] && filters['visitDateTo']['value']) || null}
                                module="claim"
                                label="visitDateTo"
                                onChange={d => onChangeFilter(
                                    'visitDateTo', d,
                                    chip(intl, "claim", "visitDateTo", d),
                                    `dateTo: "${d}"`
                                )}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <Grid container>
                        <Grid item xs={6} className={classes.item}>
                            <DatePicker
                                value={(filters['claimDateFrom'] && filters['claimDateFrom']['value']) || null}
                                module="claim"
                                label="ClaimFilter.claimDateFrom"
                                onChange={d => onChangeFilter(
                                    'claimDateFrom', d,
                                    chip(intl, "claim", "ClaimFilter.claimDateFrom", d),
                                    `dateClaimed_Gte: "${d}"`
                                )}
                            />
                        </Grid>
                        <Grid item xs={6} className={classes.item}>
                            <DatePicker
                                value={(filters['claimDateTo'] && filters['claimDateTo']['value']) || null}
                                module="claim"
                                label="ClaimFilter.claimDateTo"
                                onChange={d => onChangeFilter(
                                    'claimDateTo', d,
                                    chip(intl, "claim", "ClaimFilter.claimDateTo", d),
                                    `dateClaimed_Lte: "${d}"`
                                )}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.DiagnosisPicker"
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
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        id="medical.VisitTypePicker"
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