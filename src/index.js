import ClaimMainMenu from "./menus/ClaimMainMenu";
import HealthFacilitiesPage from "./pages/HealthFacilitiesPage";
import EditPage from "./pages/EditPage";
import ReviewsPage from "./pages/ReviewsPage";
import ReviewPage from "./pages/ReviewPage";
import FeedbackPage from "./pages/FeedbackPage";
import ClaimAdminPicker from "./pickers/ClaimAdminPicker";
import ClaimOfficerPicker from "./pickers/ClaimOfficerPicker";
import ClaimStatusPicker from "./pickers/ClaimStatusPicker";
import CareTypePicker from "./pickers/CareTypePicker"
import AttachmentGeneralTypePicker from "./pickers/AttachmentGeneralTypePicker";
import ReviewStatusPicker from "./pickers/ReviewStatusPicker";
import AttachmentStatusPicker from "./pickers/AttachmentStatusPicker";
import ClaimAttachmentPredefinedTypePicker from "./pickers/ClaimAttachmentPredefinedTypePicker";
import ApprovalStatusPicker from "./pickers/ApprovalStatusPicker";
import RejectionReasonPicker from "./pickers/RejectionReasonPicker";
import FeedbackStatusPicker from "./pickers/FeedbackStatusPicker";
import ClaimMasterPanelExt from "./components/ClaimMasterPanelExt";
import AttachmentsDialog from "./components/AttachmentsDialog";
import messages_en from "./translations/en.json";
import reducer from "./reducer";
import { decodeId } from "@openimis/fe-core";
import ClaimPercentageReferralsReport from "./reports/ClaimPercentageReferralsReport";
import ClaimsOverviewReport from "./reports/ClaimsOverviewReport";
import ClaimHistoryReport from "./reports/ClaimHistoryReport";
import ClaimsPrimaryOperationalIndicators from "./reports/ClaimsPrimaryOperationalIndicators";
import ClaimInsureeSummary from "./components/ClaimInsureeSummary";
import ServiceAreaPicker from "./pickers/ServiceAreaPicker";
import ServiceTypePicker from "./pickers/ServiceTypePicker";
import UploadPage from "./pages/UploadPage";
const ROUTE_CLAIM_UPLOAD = "claim/upload/excel";
const ROUTE_HEALTH_FACILITIES = "claim/healthFacilities";
const ROUTE_CLAIM_EDIT = "claim/healthFacilities/claim";
const ROUTE_REVIEWS = "claim/reviews";
const ROUTE_CLAIM_REVIEW = "claim/reviews/review";
const ROUTE_CLAIM_FEEDBACK = "claim/feedback";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "reducers": [{ key: "claim", reducer }],
  "reports": [
    {
      key: "claim_percentage_referrals",
      component: ClaimPercentageReferralsReport,
      isValid: (values) => values.region && values.district && values.dateStart && values.dateEnd,
      getParams: (values) => {
        const params = {}
        params.region_id = decodeId(values.region.id);
        params.district_id = decodeId(values.district.id);
        params.date_start = values.dateStart;
        params.date_end = values.dateEnd;
        return params;
      },
    },
    {
      key: "claims_overview",
      component: ClaimsOverviewReport,
      isValid: (values) => values.dateStart && values.dateEnd,
      getParams: (values) => {
        const params = {}
        if (!!values.region) {
          params.requested_region_id = decodeId(values.region.id);
        }
        if (!!values.district) {
          params.requested_district_id = decodeId(values.district.id);
        }
        if (!!values.product) {
          params.requested_product_id = decodeId(values.product.id);
        }
        if (!!values.hf) {
          params.requested_hf_id = decodeId(values.hf.id);
        }
        if (!!values.status) {
          params.requested_claim_status = values.status;
        }
        params.date_start = values.dateStart;
        params.date_end = values.dateEnd;
        return params;
      },
    },
    {
      key: "claim_history",
      component: ClaimHistoryReport,
      isValid: (values) => values.dateStart && values.dateEnd && values.insuree,
      getParams: (values) => {
        const params = {}
        if (!!values.region) {
          params.requested_region_id = decodeId(values.region.id);
        }
        if (!!values.district) {
          params.requested_district_id = decodeId(values.district.id);
        }
        if (!!values.product) {
          params.requested_product_id = decodeId(values.product.id);
        }
        if (!!values.hf) {
          params.requested_hf_id = decodeId(values.hf.id);
        }
        if (!!values.insuree) {
          params.requested_insuree_id = decodeId(values.insuree.id);
        }
        if (!!values.status) {
          params.requested_claim_status = values.status;
        }
        params.date_start = values.dateStart;
        params.date_end = values.dateEnd;
        return params;
      },
    },
    {
      key: "claims_primary_operational_indicators",
      component: ClaimsPrimaryOperationalIndicators,
      isValid: (values) => values.year && values.region,
      getParams: (values) => {
        const params = {}
        if (!!values.district) {
          params.requested_district_id = decodeId(values.district.id);
        }
        if (!!values.product) {
          params.requested_product_id = decodeId(values.product.id);
        }
        if (!!values.hf) {
          params.requested_hf_id = decodeId(values.hf.id);
        }
        if (!!values.month) {
          params.requested_month = values.month;
        }
        if (!!values.quarter) {
          params.requested_quarter = values.quarter;
        }
        params.requested_region_id = decodeId(values.region.id);
        params.requested_year = values.year;
        return params;
      },
    },
  ],
  "refs": [
    
    { key: "claim.route.healthFacilities", ref: ROUTE_HEALTH_FACILITIES },
    { key: "claim.route.claimEdit", ref: ROUTE_CLAIM_EDIT },
    { key: "claim.route.reviews", ref: ROUTE_REVIEWS },
    { key: "claim.route.feedback", ref: ROUTE_CLAIM_FEEDBACK },
    { key: "claim.route.review", ref: ROUTE_CLAIM_REVIEW },
    { key: "claim.ClaimAdminPicker", ref: ClaimAdminPicker },
    { key: "claim.route.excelupload", ref: ROUTE_CLAIM_UPLOAD },
    {
      key: "claim.ClaimAdminPicker.projection",
      ref: [
        "id",
        "uuid",
        "code",
        "lastName",
        "otherNames",
        "healthFacility{id, uuid, code, name, level, servicesPricelist{id, uuid}, itemsPricelist{id, uuid}, location{id, uuid, code, name, parent{id, uuid, code, name}}}",
      ],
    },
    { key: "claim.ClaimOfficerPicker", ref: ClaimOfficerPicker },
    { key: "claim.ClaimOfficerPicker.projection", ref: ["id", "uuid", "code", "lastName", "otherNames"] },
    { key: "claim.ClaimStatusPicker", ref: ClaimStatusPicker },
    { key: "claim.ClaimStatusPicker.projection", ref: null },
    { key: "claim.CareTypePicker", ref: CareTypePicker},
    { key: "claim.AttachmentGeneralTypePicker", ref: AttachmentGeneralTypePicker},
    { key: "claim.ReviewStatusPicker", ref: ReviewStatusPicker },
    { key: "claim.ReviewStatusPicker.projection", ref: null },
    { key: "claim.AttachmentStatusPicker", ref: AttachmentStatusPicker },
    { key: "claim.ClaimAttachmentPredefinedTypePicker", ref: ClaimAttachmentPredefinedTypePicker },
    { key: "claim.ApprovalStatusPicker", ref: ApprovalStatusPicker },
    { key: "claim.ApprovalStatusPicker.projection", ref: null },
    { key: "claim.FeedbackStatusPicker", ref: FeedbackStatusPicker },
    { key: "claim.FeedbackStatusPicker.projection", ref: null },
    { key: "claim.RejectionReasonPicker", ref: RejectionReasonPicker },
    { key: "claim.RejectionReasonPicker.projection", ref: null },
    { key: "claim.CreateClaim.feedbackStatus", ref: 1 },
    { key: "claim.CreateClaim.reviewStatus", ref: 1 },
    { key: "claim.CreateClaim.claimTypeReferSymbol", ref: "R" },
    { key: "claim.ClaimMasterPanelExt", ref: ClaimMasterPanelExt },
    {key : "claim.ServiceAreaPicker", ref : ServiceAreaPicker},
    {key : "claim.ServiceTypePicker", ref : ServiceTypePicker},
    
    { key: "claim.AttachmentsDialog", ref: AttachmentsDialog },
  ],
  "core.Router": [
    { path: ROUTE_HEALTH_FACILITIES, component: HealthFacilitiesPage },
    { path: ROUTE_CLAIM_EDIT + "/:claim_uuid?", component: EditPage }, // ? = optional (needed to route new claims)
    { path: ROUTE_REVIEWS, component: ReviewsPage },
    { path: ROUTE_CLAIM_REVIEW + "/:claim_uuid", component: ReviewPage },
    { path: ROUTE_CLAIM_FEEDBACK + "/:claim_uuid", component: FeedbackPage },
    { path: ROUTE_CLAIM_UPLOAD, component : UploadPage}
  ],
  "core.MainMenu": [ClaimMainMenu],
  "claim.MasterPanel": [ClaimMasterPanelExt],
  "insuree.ProfilePage.insureeClaims": [ClaimInsureeSummary],
};

export const ClaimModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
};
