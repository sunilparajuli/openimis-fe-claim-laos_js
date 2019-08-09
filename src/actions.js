import { graphql, formatPageQuery } from "@openimis/fe-core";

export function fetchClaimAdmins() {
  let payload = formatPageQuery( "claimAdmins",
    null,
    ["id", "code", "lastName", "otherNames"]
  );
  return graphql(payload, 'CLAIM_CLAIM_ADMINS');
}

export function fetchClaimSummaries(filters) {
  let payload = formatPageQuery( "claims",
    filters,
    ["id", "code", "healthFacility { code, name }", "dateClaimed", "feedbackStatus", "reviewStatus", "claimed", "approved", "status"]
  );
  return graphql(payload, 'CLAIM_CLAIMS');
}
