import {
  graphql, formatPageQuery, formatPageQueryWithCount, formatMutation, decodeId
} from "@openimis/fe-core";
import _ from "lodash";

export function fetchClaimAdmins(mm) {
  const payload = formatPageQuery("claimAdmins",
    null,
    mm.getRef("claim.ClaimAdminPicker.projection")
  );
  return graphql(payload, 'CLAIM_CLAIM_ADMINS');
}

export function fetchClaimOfficers(mm) {
  const payload = formatPageQuery("claimOfficers",
    null,
    mm.getRef("claim.ClaimOfficerPicker.projection")
  );
  return graphql(payload, 'CLAIM_CLAIM_OFFICERS');
}

export function fetchClaimSummaries(mm, filters) {
  const payload = formatPageQueryWithCount("claims",
    filters,
    ["id", "code", "dateClaimed", "feedbackStatus", "reviewStatus", "claimed", "approved", "status",
      "healthFacility" + mm.getProjection("location.HealthFacilityPicker.projection")]
  );
  return graphql(payload, 'CLAIM_CLAIM_SEARCHER');
}

export function formatDetail(type, detail) {
  return `{
    ${type}Id: ${decodeId(detail[type].id)}
    priceAsked: "${_.round(detail.priceAsked, 2).toFixed(2)}"
    qtyProvided: "${_.round(detail.qtyProvided, 2).toFixed(2)}"
    status: 1
    explanation: "${detail.explanation}"
    justification: "${detail.justification}"
  }`
}

export function formatDetails(type, details) {
  if (!details || details.length <= 1) return "";
  details.pop()
  return `${type}s: [
      ${details.map(d => formatDetail(type, d)).join('\n')}
    ]`
}

export function createClaim(mm, claim, clientMutationLabel) {
  let claimGQL = `
    code: "${claim.code}"
    insureeId: ${decodeId(claim.insuree.id)}
    dateFrom: "${claim.dateFrom}"
    dateTo: "${claim.dateTo}"
    icdId: ${decodeId(claim.icd.id)}
    ${!!claim.icd1 ? `icdId1: ${decodeId(claim.icd1.id)}` : ""}
    ${!!claim.icd2 ? `icdId2: ${decodeId(claim.icd2.id)}` : ""}
    ${!!claim.icd3 ? `icdId3: ${decodeId(claim.icd3.id)}` : ""}
    ${!!claim.icd4 ? `icdId4: ${decodeId(claim.icd4.id)}` : ""}
    status: ${mm.getRef("claim.CreateClaim.status")}
    dateClaimed: "${claim.dateClaimed}"
    healthFacilityId: ${decodeId(claim.healthFacility.id)}
    visitType: "${claim.visitType}"
    ${formatDetails("service", claim.services)}
    ${formatDetails("item", claim.items)}
  `
  const mutation = formatMutation("createClaim", claimGQL, clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    'CLAIM_CREATE_CLAIM',
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function fetchClaim(mm, claimId, forFeedback) {
  let projections = [
    "id", "code", "dateFrom", "dateTo", "dateClaimed", "claimed", "approved", "status",
    "feedbackStatus", "reviewStatus", "guaranteeId", "explanation", "adjustment",
    "healthFacility" + mm.getProjection("location.HealthFacilityPicker.projection"),
    "insuree" + mm.getProjection("insuree.InsureePicker.projection"),
    "visitType" + mm.getProjection("medical.VisitTypePicker.projection"),
    "icd" + mm.getProjection("medical.DiagnosisPicker.projection"),
    "icd1" + mm.getProjection("medical.DiagnosisPicker.projection"),
    "icd2" + mm.getProjection("medical.DiagnosisPicker.projection"),
    "icd3" + mm.getProjection("medical.DiagnosisPicker.projection"),
    "icd4" + mm.getProjection("medical.DiagnosisPicker.projection"),
  ]
  if (!!forFeedback) {
    projections.push("feedback{id, careRendered, paymentAsked, drugPrescribed, drugReceived, asessment, feedbackDate, chfOfficerCode}")
  } else {
    projections.push(
      "services{" +
      "id, qtyProvided, priceAsked, qtyApproved, priceApproved, priceValuated, explanation, justification, rejectionReason, status, service" +
      mm.getProjection("medical.ServicePicker.projection") +
      "}",
      "items{" +
      "id, qtyProvided, priceAsked, qtyApproved, priceApproved, priceValuated, explanation, justification, rejectionReason, status, item" +
      mm.getProjection("medical.ItemPicker.projection") +
      "}",
    )
  }
  const payload = formatPageQuery("claims",
    [`id: "${claimId}"`],
    projections
  );
  return graphql(payload, 'CLAIM_CLAIM');
}

export function submit(claims, clientMutationLabel) {
  let claimIds = `ids: [${claims.map(c => decodeId(c.id)).join(",")}]`
  const mutation = formatMutation("submitClaims", claimIds, clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['CLAIM_MUTATION_REQ', 'CLAIM_SUBMIT_CLAIMS_RESP', 'CLAIM_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function selectForFeedback(claims, clientMutationLabel) {
  let claimIds = `ids: [${claims.map(c => decodeId(c.id)).join(",")}]`
  const mutation = formatMutation("selectClaimsForFeedback", claimIds, clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['CLAIM_MUTATION_REQ', 'CLAIM_SELECT_CLAIMS_FOR_FEEDBACK_RESP', 'CLAIM_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function bypassFeedback(claims, clientMutationLabel) {
  let claimIds = `ids: [${claims.map(c => decodeId(c.id)).join(",")}]`
  const mutation = formatMutation("bypassClaimsFeedback", claimIds, clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['CLAIM_MUTATION_REQ', 'CLAIM_BYPASS_CLAIMS_FEEDBACK_RESP', 'CLAIM_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function skipFeedback(claims, clientMutationLabel) {
  let claimIds = `ids: [${claims.map(c => decodeId(c.id)).join(",")}]`
  const mutation = formatMutation("skipClaimsFeedback", claimIds, clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['CLAIM_MUTATION_REQ', 'CLAIM_SKIP_CLAIMS_FEEDBACK_RESP', 'CLAIM_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function selectForReview(claims, clientMutationLabel) {
  let claimIds = `ids: [${claims.map(c => decodeId(c.id)).join(",")}]`
  const mutation = formatMutation("selectClaimsForReview", claimIds, clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['CLAIM_MUTATION_REQ', 'CLAIM_SELECT_CLAIMS_FOR_REVIEW_RESP', 'CLAIM_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function bypassReview(claims, clientMutationLabel) {
  let claimIds = `ids: [${claims.map(c => decodeId(c.id)).join(",")}]`
  const mutation = formatMutation("bypassClaimsReview", claimIds, clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['CLAIM_MUTATION_REQ', 'CLAIM_BYPASS_CLAIMS_REVIEW_RESP', 'CLAIM_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function skipReview(claims, clientMutationLabel) {
  let claimIds = `ids: [${claims.map(c => decodeId(c.id)).join(",")}]`
  const mutation = formatMutation("skipClaimsReview", claimIds, clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['CLAIM_MUTATION_REQ', 'CLAIM_SKIP_CLAIMS_REVIEW_RESP', 'CLAIM_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function process(claims, clientMutationLabel) {
  let claimIds = `ids: [${claims.map(c => decodeId(c.id)).join(",")}]`
  const mutation = formatMutation("processClaims", claimIds, clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['CLAIM_MUTATION_REQ', 'CLAIM_PROCESS_CLAIMS_RESP', 'CLAIM_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}
