import { graphql, formatPageQuery, formatPageQueryWithCount } from "@openimis/fe-core";

export function fetchClaimAdmins(mm) {
  let payload = formatPageQuery("claimAdmins",
    null,
    mm.getRef("claim.ClaimAdminPicker.projection")
    
  );
  return graphql(payload, 'CLAIM_CLAIM_ADMINS');
}

export function fetchClaimSummaries(mm, filters) {
  let payload = formatPageQueryWithCount("claims",
    filters,
    ["id", "code", "dateClaimed", "feedbackStatus", "reviewStatus", "claimed", "approved", "status",
     "healthFacility"+mm.getProjection("location.HealthFacilityPicker.projection")]
  );
  return graphql(payload, 'CLAIM_CLAIMS');
}

export function fetchBatchRuns(mm, scope) {
  let payload = formatPageQuery("batchRuns",
    [`location_Id: "${scope.id}"`],
    mm.getRef("claim.BatchRunPicker.projection")
    
  );
  return graphql(payload, 'CLAIM_BATCH_RUNS');
}

export function fetchClaim(mm, claimId) {
  let payload = formatPageQuery("claims",
    [`id: "${claimId}"`],
    ["id", "code", "dateFrom", "dateTo", "dateClaimed", "claimed", "approved", "status",
      "feedbackStatus", "reviewStatus", "guaranteeId", "explanation", "adjustment",
      "healthFacility"+mm.getProjection("location.HealthFacilityPicker.projection"),
      "insuree"+mm.getProjection("insuree.InsureePicker.projection"),
      "services{id, qtyProvided, priceAsked, explanation, justification, service"+mm.getProjection("medical.ServicePicker.projection")+"}",
      "items{id, qtyProvided, priceAsked, explanation, justification, item"+mm.getProjection("medical.ItemPicker.projection")+"}",
      "visitType"+mm.getProjection("medical.VisitTypePicker.projection"),
      "icd"+mm.getProjection("medical.DiagnosisPicker.projection"),
      "icd1"+mm.getProjection("medical.DiagnosisPicker.projection"),
      "icd2"+mm.getProjection("medical.DiagnosisPicker.projection"),
      "icd3"+mm.getProjection("medical.DiagnosisPicker.projection"),
      "icd4"+mm.getProjection("medical.DiagnosisPicker.projection"),
    ]
  );
  return graphql(payload, 'CLAIM_CLAIM');
}

export function selectForFeedback(claims) {
  //TODO
}

export function selectForReview(claims) {
  //TODO
}

export function submit(claims) {
  //TODO
}