import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Fab, Tooltip } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import AddIcon from "@material-ui/icons/Add";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { TextField } from '@material-ui/core';
import {
  withHistory,
  historyPush,
  withModulesManager,
  formatMessage,
  formatMessageWithValues,
  journalize,
  coreConfirm,
  Helmet,
  clearCurrentPaginationPage,
} from "@openimis/fe-core";
import ClaimSearcher from "../components/ClaimSearcher";
import { submit, del, selectHealthFacility, submitAll, uploadExcelInsuree } from "../actions";
import { RIGHT_ADD, RIGHT_LOAD, RIGHT_SUBMIT, RIGHT_DELETE, MODULE_NAME } from "../constants";

const CLAIM_HF_FILTER_CONTRIBUTION_KEY = "claim.HealthFacilitiesFilter";
const CLAIM_SEARCHER_ACTION_CONTRIBUTION_KEY = "claim.SelectionAction";

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
});

class HealthFacilitiesPage extends Component {
  constructor(props) {
    super(props);
    let defaultFilters = props.modulesManager.getConf("fe-claim", "healthFacilities.defaultFilters", {
      "claimStatus": {
        "value": 2,
        "filter": "status: 2",
      },
    });
    this.canSubmitClaimWithZero = props.modulesManager.getConf("fe-claim", "canSubmitClaimWithZero", false);
    this.state = {
      defaultFilters,
      confirmedAction: null,
      open: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.submittingMutation && !this.props.submittingMutation) {
      this.props.journalize(this.props.mutation);
      this.setState({ reset: this.state.reset + 1 });
    } else if (!prevProps.confirmed && this.props.confirmed) {
      this.state.confirmedAction();
    }
  }

  canSubmitSelected = (selection) =>
    !!selection &&
    selection.length &&
    selection.filter((s) => s.status === 2 && (!!this.canSubmitClaimWithZero || s.claimed > 0)).length ===
      selection.length;

  canSubmitAll = (selection) => !selection || selection.length == 0;

  submitSelected = (selection) => {
    if (selection.length === 1) {
      this.props.submit(
        selection,
        formatMessageWithValues(this.props.intl, "claim", "SubmitClaim.mutationLabel", { code: selection[0].code }),
      );
    } else {
      this.props.submit(
        selection,
        formatMessageWithValues(this.props.intl, "claim", "SubmitClaims.mutationLabel", { count: selection.length }),
        selection.map((c) => c.code),
      );
    }
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

 handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const base64String = event.target.result.split(',')[1];
      this.props.uploadExcelInsuree(base64String);
    };
    
    reader.readAsDataURL(file);
  };

  submitAll = (selection) => {
    let filters = this.props.selectedFilters;
    if (selection.length === 0) {
      this.props.submitAll(
        filters,
        formatMessageWithValues(this.props.intl, "claim", "SubmitAllClaims.mutationLabel", { "claims": "All" }),
      );
    }
  };

  canDeleteSelected = (selection) =>
    !!selection && selection.length && selection.filter((s) => s.status === 2).length === selection.length;

  deleteSelected = (selection) => {
    let confirm = null;
    let confirmedAction = null;
    if (selection.length === 1) {
      confirmedAction = () =>
        this.props.del(
          selection,
          formatMessageWithValues(this.props.intl, "claim", "DeleteClaim.mutationLabel", { code: selection[0].code }),
        );
      confirm = (e) =>
        this.props.coreConfirm(
          formatMessage(this.props.intl, "claim", "deleteClaim.confirm.title"),
          formatMessageWithValues(this.props.intl, "claim", "deleteClaim.confirm.message", {
            code: selection[0].code,
          }),
        );
    } else {
      confirmedAction = () =>
        this.props.del(
          selection,
          formatMessageWithValues(this.props.intl, "claim", "DeleteClaims.mutationLabel", { count: selection.length }),
          selection.map((c) => c.code),
        );
      confirm = (e) =>
        this.props.coreConfirm(
          formatMessage(this.props.intl, "claim", "deleteClaims.confirm.title"),
          formatMessageWithValues(this.props.intl, "claim", "deleteClaims.confirm.message", {
            count: selection.length,
          }),
        );
    }

    this.setState({ confirmedAction }, confirm);
  };

  onDoubleClick = (c, newTab = false) => {
    historyPush(this.props.modulesManager, this.props.history, "claim.route.claimEdit", [c.uuid], newTab);
  };

  onAdd = () => {
    historyPush(this.props.modulesManager, this.props.history, "claim.route.claimEdit");
  };

  canAdd = () => {
    if (!this.props.claimAdmin) return false;
    if (!this.props.claimHealthFacility) return false;
    return true;
  };

  componentDidMount = () => {
    const { module } = this.props;
    if (module !== MODULE_NAME) this.props.clearCurrentPaginationPage();
  };

  componentWillUnmount = () => {
    const { location, history } = this.props;
    const {
      location: { pathname },
    } = history;
    const urlPath = location.pathname;
    if (!pathname.includes(urlPath)) this.props.clearCurrentPaginationPage();
  };


  render() {
   
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
     <div style={{ textAlign: 'center' }}>
     <>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleOpen}
          startIcon={<CloudUploadIcon />}
        >
          Upload Excel
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>Upload Excel File</DialogTitle>
          <DialogContent>
            <form className="upload-form">
              <TextField
                type="file"
                name="excelFile"
                variant="outlined"
                accept=".xlsx, .xls"
                required
              />
              {/* Add other form fields here if needed */}
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
                  <div>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      style={{ display: 'none' }}
                      onChange={this.handleUpload}
                      ref={(fileInput) => (this.fileInput = fileInput)} // Ref for triggering file input click
                    />
                    <Button
                      color="primary"
                      onClick={() => this.fileInput.click()} // Trigger file input click
                    >
                      Upload
                    </Button>
                </div>
          </DialogActions>
        </Dialog>
      </>
       
      </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  claimAdmin: state.claim.claimAdmin,
  claimHealthFacility: state.claim.claimHealthFacility,
  userHealthFacilityFullPath: !!state.loc ? state.loc.userHealthFacilityFullPath : null,
  submittingMutation: state.claim.submittingMutation,
  mutation: state.claim.mutation,
  confirmed: state.core.confirmed,
  filtersCache: state.core.filtersCache,
  excelUploadResponse : state.claim.excelUploadResponse,
  selectedFilters: state.core.filtersCache.claimHealthFacilitiesPageFiltersCache,
  module: state.core?.savedPagination?.module,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      selectHealthFacility,
      journalize,
      coreConfirm,
      submit,
      submitAll,
      del,
      clearCurrentPaginationPage,
      uploadExcelInsuree
    },
    dispatch,
  );
};

export default injectIntl(
  withModulesManager(
    withHistory(connect(mapStateToProps, mapDispatchToProps)(withTheme(withStyles(styles)(HealthFacilitiesPage)))),
  ),
);
