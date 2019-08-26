import ClaimMainMenu from "./components/ClaimMainMenu";
import HealthFacilitiesPage from "./components/HealthFacilitiesPage";
import ClaimEditPage from "./components/ClaimEditPage";
import ReviewsPage from "./components/ReviewsPage";
import { BatchesPage } from "./components/BatchesPage";
import ClaimAdminPicker from "./components/ClaimAdminPicker";
import BatchRunPicker from "./components/BatchRunPicker";
import ClaimStatusPicker from "./components/ClaimStatusPicker";
import ReviewStatusPicker from "./components/ReviewStatusPicker";
import FeedbackStatusPicker from "./components/FeedbackStatusPicker";
import messages_en from "./translations/en.json";
import reducer from "./reducer";

const ROUTE_HEALTH_FACILITIES = "claim/healthFacilities";
const ROUTE_CLAIM_EDIT = "claim/claim";
const ROUTE_REVIEWS = "claim/reviews";
const ROUTE_BATCHES = "claim/batches";

const DEFAULT_CONFIG = {
  "translations": [{ key: 'en', messages: messages_en }],
  "reducers": [{ key: 'claim', reducer }],
  "refs": [
    { key: "claim.route.healthFacilities", ref: ROUTE_HEALTH_FACILITIES },
    { key: "claim.route.claimEdit", ref: ROUTE_CLAIM_EDIT },
    { key: "claim.route.reviews", ref: ROUTE_REVIEWS },
    { key: "claim.route.batches", ref: ROUTE_BATCHES },
    { key: "claim.ClaimAdminPicker", ref: ClaimAdminPicker },
    { key: "claim.ClaimAdminPicker.projection", ref: ["id", "code", "lastName", "otherNames"] },
    { key: "claim.ClaimStatusPicker", ref: ClaimStatusPicker },
    { key: "claim.ClaimStatusPicker.projection", ref: null },
    { key: "claim.ReviewStatusPicker", ref: ReviewStatusPicker },
    { key: "claim.ReviewStatusPicker.projection", ref: null },
    { key: "claim.FeedbackStatusPicker", ref: FeedbackStatusPicker },
    { key: "claim.FeedbackStatusPicker.projection", ref: null },
    { key: "claim.BatchRunPicker", ref: BatchRunPicker },
    { key: "claim.BatchRunPicker.projection", ref: ["id", "runDate"] },
    { key: "claim.CreateClaim.status", ref: 1 },

  ],
  "core.Router": [
    { path: ROUTE_HEALTH_FACILITIES, component: HealthFacilitiesPage },
    { path: ROUTE_CLAIM_EDIT+"/:claim_id?", component: ClaimEditPage },
    { path: ROUTE_REVIEWS, component: ReviewsPage },
    { path: ROUTE_BATCHES, component: BatchesPage }
  ],
  "core.MainMenu": [ClaimMainMenu],
}

export const ClaimModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}