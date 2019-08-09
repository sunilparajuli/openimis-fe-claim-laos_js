import ClaimMainMenu from "./components/ClaimMainMenu";
import ClaimsPage from "./components/ClaimsPage";
import { ReviewPage } from "./components/ReviewPage";
import { BatchPage } from "./components/BatchPage";
import messages_en from "./translations/en.json";
import reducer from "./reducer";

const DEFAULT_CONFIG = {
  "translations": [{ key: 'en', messages: messages_en }],
  "reducers": [{ key: 'claim', reducer }],  
  "core.Router": [
    { path: "claim/claims", component: ClaimsPage },
    { path: "claim/review", component: ReviewPage },
    { path: "claim/batch", component: BatchPage }
  ],
  "core.MainMenu": [ClaimMainMenu]
}

export const ClaimModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}