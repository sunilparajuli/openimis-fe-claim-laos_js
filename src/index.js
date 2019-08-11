import ClaimMainMenu from "./components/ClaimMainMenu";
import ClaimsPage from "./components/ClaimsPage";
import { ReviewPage } from "./components/ReviewPage";
import { BatchPage } from "./components/BatchPage";
import ClaimAdminSelect from "./components/ClaimAdminSelect";
import BatchRunSelect from "./components/BatchRunSelect";
import ClaimStatusSelect from "./components/ClaimStatusSelect";
import ReviewStatusSelect from "./components/ReviewStatusSelect";
import FeedbackStatusSelect from "./components/FeedbackStatusSelect";
import messages_en from "./translations/en.json";
import reducer from "./reducer";

const DEFAULT_CONFIG = {
  "translations": [{ key: 'en', messages: messages_en }],
  "reducers": [{ key: 'claim', reducer }],
  "refs": [
    { key: "claim.ClaimAdminSelect", ref: ClaimAdminSelect },
    { key: "claim.BatchRunSelect", ref: BatchRunSelect },
    { key: "claim.ClaimStatusSelect", ref: ClaimStatusSelect },
    { key: "claim.ReviewStatusSelect", ref: ReviewStatusSelect },
    { key: "claim.FeedbackStatusSelect", ref: FeedbackStatusSelect },
  ],
  "core.Router": [
    { path: "claim/claims", component: ClaimsPage },
    { path: "claim/review", component: ReviewPage },
    { path: "claim/batch", component: BatchPage }
  ],
  "core.MainMenu": [ClaimMainMenu],
  
  "CLAIM_ADMIN_ID_TYPE": "ClaimAdminGQLType",
  "BATCH_RUN_ID_TYPE": "BatchRunGQLType",
}

export const ClaimModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}