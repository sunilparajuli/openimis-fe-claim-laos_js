import ClaimMainMenu from "./components/ClaimMainMenu";
import ClaimsPage from "./components/ClaimsPage";
import ClaimEditPage from "./components/ClaimEditPage";
import { ReviewPage } from "./components/ReviewPage";
import { BatchPage } from "./components/BatchPage";
import ClaimAdminPicker from "./components/ClaimAdminPicker";
import BatchRunPicker from "./components/BatchRunPicker";
import ClaimStatusPicker from "./components/ClaimStatusPicker";
import ReviewStatusPicker from "./components/ReviewStatusPicker";
import FeedbackStatusPicker from "./components/FeedbackStatusPicker";
import messages_en from "./translations/en.json";
import reducer from "./reducer";

const DEFAULT_CONFIG = {
  "translations": [{ key: 'en', messages: messages_en }],
  "reducers": [{ key: 'claim', reducer }],
  "refs": [
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
  ],
  "core.Router": [
    { path: "claim/claims", component: ClaimsPage },
    { path: "claim/claim/:claim_id", component: ClaimEditPage },
    { path: "claim/review", component: ReviewPage },
    { path: "claim/batch", component: BatchPage }
  ],
  "core.MainMenu": [ClaimMainMenu],
}

export const ClaimModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}