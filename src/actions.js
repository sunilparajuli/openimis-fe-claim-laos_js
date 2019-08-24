import {
  graphql, formatPageQuery, formatPageQueryWithCount, formatMutation,
  decodeId, journalize
} from "@openimis/fe-core";

export function fetchClaimAdmins(mm) {
  const payload = formatPageQuery("claimAdmins",
    null,
    mm.getRef("claim.ClaimAdminPicker.projection")
  );
  return graphql(payload, 'CLAIM_CLAIM_ADMINS');
}

export function fetchClaimSummaries(mm, filters) {
  const payload = formatPageQueryWithCount("claims",
    filters,
    ["id", "code", "dateClaimed", "feedbackStatus", "reviewStatus", "claimed", "approved", "status",
      "healthFacility" + mm.getProjection("location.HealthFacilityPicker.projection")]
  );
  return graphql(payload, 'CLAIM_CLAIMS');
}

export function fetchBatchRuns(mm, scope) {
  const payload = formatPageQuery("batchRuns",
    [`location_Id: "${scope.id}"`],
    mm.getRef("claim.BatchRunPicker.projection")
  );
  return graphql(payload, 'CLAIM_BATCH_RUNS');
}

export function createClaim(mm, claim, label, detail) {
  //TODO: 
  // provide a default for the review/feedback status (rather not)?
  const claimGQL = `
    code: "${claim.code}"
    insureeId: ${decodeId(claim.insuree.id)}
    dateFrom: "${claim.dateFrom}"
    dateTo: "${claim.dateTo}"
    icdId: ${decodeId(claim.icd.id)}
    ${!!claim.icd1 ? `icdId1: ${decodeId(claim.icd1.id)}` : ""}
    ${!!claim.icd2 ? `icdId2: ${decodeId(claim.icd2.id)}` : ""}
    ${!!claim.icd3 ? `icdId3: ${decodeId(claim.icd3.id)}` : ""}
    ${!!claim.icd4 ? `icdId4: ${decodeId(claim.icd4.id)}` : ""}
    healthFacilityId: ${decodeId(claim.healthFacility.id)}
    status: ${mm.getRef("claim.CreateClaim.status")}
    dateClaimed: "${claim.dateClaimed}"
    visitType: "${claim.visitType}"
  `
  const mutation = formatMutation("createClaim", claimGQL);
  return graphql(
    mutation.payload,
    'CLAIM_CREATE_CLAIM',
    { clientMutationId: mutation.clientMutationId, label, detail }
  )
}

export function fetchClaim(mm, claimId) {
  const payload = formatPageQuery("claims",
    [`id: "${claimId}"`],
    ["id", "code", "dateFrom", "dateTo", "dateClaimed", "claimed", "approved", "status",
      "feedbackStatus", "reviewStatus", "guaranteeId", "explanation", "adjustment",
      "healthFacility" + mm.getProjection("location.HealthFacilityPicker.projection"),
      "insuree" + mm.getProjection("insuree.InsureePicker.projection"),
      "services{id, qtyProvided, priceAsked, explanation, justification, service" + mm.getProjection("medical.ServicePicker.projection") + "}",
      "items{id, qtyProvided, priceAsked, explanation, justification, item" + mm.getProjection("medical.ItemPicker.projection") + "}",
      "visitType" + mm.getProjection("medical.VisitTypePicker.projection"),
      "icd" + mm.getProjection("medical.DiagnosisPicker.projection"),
      "icd1" + mm.getProjection("medical.DiagnosisPicker.projection"),
      "icd2" + mm.getProjection("medical.DiagnosisPicker.projection"),
      "icd3" + mm.getProjection("medical.DiagnosisPicker.projection"),
      "icd4" + mm.getProjection("medical.DiagnosisPicker.projection"),
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