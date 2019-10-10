import {
  baseApiUrl, graphql, formatPageQuery, formatPageQueryWithCount,
  formatMutation, decodeId, openBlob
} from "@openimis/fe-core";
import _ from "lodash";
import _uuid from "lodash-uuid";

export function fetchClaimAdmins(mm) {
  const payload = formatPageQuery("claimAdmins",
    null,
    mm.getRef("claim.ClaimAdminPicker.projection")
  );
  return graphql(payload, 'CLAIM_CLAIM_ADMINS');
}

export function selectClaimAdmin(admin) {
  return dispatch => {
    dispatch({ type: 'CLAIM_CLAIM_ADMIN_SELECTED', payload: admin })
  }
}

export function selectHealthFacility(hf) {
  return dispatch => {
    dispatch({ type: 'CLAIM_CLAIM_HEALTH_FACILITY_SELECTED', payload: hf })
  }
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
    ["uuid", "code", "dateClaimed", "feedbackStatus", "reviewStatus", "claimed", "approved", "status",
      "healthFacility" + mm.getProjection("location.HealthFacilityPicker.projection")]
  );
  return graphql(payload, 'CLAIM_CLAIM_SEARCHER');
}

export function formatDetail(type, detail) {
  return `{
    ${detail.id !== undefined && detail.id !== null ? `id: ${detail.id}` : ''}
    ${type}Id: ${decodeId(detail[type].id)}
    ${detail.priceAsked !== null ? `priceAsked: "${_.round(detail.priceAsked, 2).toFixed(2)}"` : ''}
    ${detail.qtyProvided !== null ? `qtyProvided: "${_.round(detail.qtyProvided, 2).toFixed(2)}"` : ''}
    status: 1
    ${detail.explanation !== undefined && detail.explanation !== null ? `explanation: "${detail.explanation}"` : ''}
    ${detail.justification !== undefined && detail.justification !== null ? `justification: "${detail.justification}"` : ''}
  }`
}

export function formatDetails(type, details) {
  if (!details) return "";
  let dets = details.filter(d => !!d[type]);
  return `${type}s: [
      ${dets.map(d => formatDetail(type, d)).join('\n')}
    ]`
}

export function formatClaimGQL(mm, claim) {
  debugger;
  return `
    ${claim.uuid !== undefined && claim.uuid !== null ? `uuid: "${claim.uuid}"` : ''}
    code: "${claim.code}"
    insureeId: ${decodeId(claim.insuree.id)}
    adminId: ${decodeId(claim.admin.id)}
    dateFrom: "${claim.dateFrom}"
    ${claim.dateTo ? `dateTo: "${claim.dateTo}"` : ''}
    icdId: ${decodeId(claim.icd.id)}
    ${!!claim.icd1 ? `icd1Id: ${decodeId(claim.icd1.id)}` : ""}
    ${!!claim.icd2 ? `icd2Id: ${decodeId(claim.icd2.id)}` : ""}
    ${!!claim.icd3 ? `icd3Id: ${decodeId(claim.icd3.id)}` : ""}
    ${!!claim.icd4 ? `icd4Id: ${decodeId(claim.icd4.id)}` : ""}
    status: ${mm.getRef("claim.CreateClaim.status")}
    feedbackStatus: ${mm.getRef("claim.CreateClaim.feedbackStatus")}
    reviewStatus: ${mm.getRef("claim.CreateClaim.reviewStatus")}
    dateClaimed: "${claim.dateClaimed}"
    healthFacilityId: ${decodeId(claim.healthFacility.id)}
    visitType: "${claim.visitType}"
    ${!!claim.guaranteeId ? `guaranteeId: "${claim.guaranteeId}"` : ""}
    ${!!claim.explanation ? `explanation: "${claim.explanation}"` : ""}
    ${!!claim.adjustment ? `adjustment: "${claim.adjustment}"` : ""}
    ${formatDetails("service", claim.services)}
    ${formatDetails("item", claim.items)}
  `
}

export function createClaim(mm, claim, clientMutationLabel) {
  let mutation = formatMutation("createClaim", formatClaimGQL(mm, claim), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['CLAIM_MUTATION_REQ', 'CLAIM_CREATE_CLAIM_RESP', 'CLAIM_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function updateClaim(mm, claim, clientMutationLabel) {
  let mutation = formatMutation("updateClaim", formatClaimGQL(mm, claim), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['CLAIM_MUTATION_REQ', 'CLAIM_UPDATE_CLAIM_RESP', 'CLAIM_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function fetchClaim(mm, claimUuid, forFeedback) {
  let projections = [
    "uuid", "code", "dateFrom", "dateTo", "dateClaimed", "claimed", "approved", "valuated",
    "status", "feedbackStatus", "reviewStatus", "guaranteeId", "explanation", "adjustment",
    "healthFacility" + mm.getProjection("location.HealthFacilityPicker.projection"),
    "insuree" + mm.getProjection("insuree.InsureePicker.projection"),
    "visitType" + mm.getProjection("medical.VisitTypePicker.projection"),
    "admin" + mm.getProjection("claim.ClaimAdminPicker.projection"),
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
    [`uuid: "${claimUuid}"`],
    projections
  );
  return graphql(payload, 'CLAIM_CLAIM');
}

export function submit(claims, clientMutationLabel) {
  let claimUuids = `uuids: ["${claims.map(c => c.uuid).join("\",\"")}"]`
  let mutation = formatMutation("submitClaims", claimUuids, clientMutationLabel);
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

export function del(claims, clientMutationLabel) {
  let claimUuids = `uuids: ["${claims.map(c => c.uuid).join("\",\"")}"]`
  let mutation = formatMutation("deleteClaims", claimUuids, clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['CLAIM_MUTATION_REQ', 'CLAIM_DELETE_CLAIMS_RESP', 'CLAIM_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function selectForFeedback(claims, clientMutationLabel) {
  let claimUuids = `uuids: ["${claims.map(c => c.uuid).join("\",\"")}"]`
  let mutation = formatMutation("selectClaimsForFeedback", claimUuids, clientMutationLabel);
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
  let claimUuids = `uuids: ["${claims.map(c => c.uuid).join("\",\"")}"]`
  let mutation = formatMutation("bypassClaimsFeedback", claimUuids, clientMutationLabel);
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

export function deliverFeedback(claim, clientMutationLabel) {
  let feedback = { ...claim.feedback };
  let feedbackGQL = `
    claimUuid: "${claim.uuid}"
    feedback: {
      ${!!feedback.feedbackDate ? `feedbackDate: "${feedback.feedbackDate}"` : ''}
      ${!!feedback.chfOfficerCode ? `chfOfficerCode: ${feedback.chfOfficerCode}` : ''}
      ${feedback.careRendered !== undefined && feedback.careRendered !== null ? `careRendered: ${feedback.careRendered}` : ''}
      ${feedback.paymentAsked !== undefined && feedback.paymentAsked !== null ? `paymentAsked: ${feedback.paymentAsked}` : ''}
      ${feedback.drugPrescribed !== undefined && feedback.drugPrescribed !== null ? `drugPrescribed: ${feedback.drugPrescribed}` : ''}
      ${feedback.drugReceived !== undefined && feedback.drugReceived !== null ? `drugReceived: ${feedback.drugReceived}` : ''}
      ${feedback.asessment !== undefined && feedback.asessment !== null ? `asessment: ${feedback.asessment}` : ''}
    }
  `
  let mutation = formatMutation("deliverClaimFeedback", feedbackGQL, clientMutationLabel)
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['CLAIM_MUTATION_REQ', 'CLAIM_DELIVER_CLAIM_FEEDBACK_RESP', 'CLAIM_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function skipFeedback(claims, clientMutationLabel) {
  let claimUuids = `uuids: ["${claims.map(c => c.uuid).join("\",\"")}"]`
  let mutation = formatMutation("skipClaimsFeedback", claimUuids, clientMutationLabel);
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
  let claimUuids = `uuids: ["${claims.map(c => c.uuid).join("\",\"")}"]`
  let mutation = formatMutation("selectClaimsForReview", claimUuids, clientMutationLabel);
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
  let claimUuids = `uuids: ["${claims.map(c => c.uuid).join("\",\"")}"]`
  let mutation = formatMutation("bypassClaimsReview", claimUuids, clientMutationLabel);
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

export function formatReviewDetail(type, detail) {
  return `{
    id: ${detail.id}
    ${type}Id: ${decodeId(detail[type].id)}
    ${detail.qtyApproved !== null ? `qtyApproved: "${_.round(detail.qtyApproved, 2).toFixed(2)}"` : ''}
    ${detail.priceApproved !== null ? `priceApproved: "${_.round(detail.priceApproved, 2).toFixed(2)}"` : ''}
    ${detail.justification !== null ? `justification: "${detail.justification}"` : ''}
    status: ${detail.status}
    ${detail.rejectionReason !== null ? `rejectionReason: ${detail.rejectionReason}` : ''}
  }`
}


export function formatReviewDetails(type, details) {
  if (!details || details.length < 1) return "";
  return `${type}s: [
      ${details.map(d => formatReviewDetail(type, d)).join('\n')}
    ]`
}

export function deliverReview(claim, clientMutationLabel) {
  let reviewGQL = `
    claimUuid: "${claim.uuid}"
    ${formatReviewDetails("service", claim.services)}
    ${formatReviewDetails("item", claim.items)}
  `
  let mutation = formatMutation("deliverClaimReview", reviewGQL, clientMutationLabel)
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['CLAIM_MUTATION_REQ', 'CLAIM_DELIVER_CLAIM_REVIEW_RESP', 'CLAIM_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

export function skipReview(claims, clientMutationLabel) {
  let claimUuids = `uuids: ["${claims.map(c => c.uuid).join("\",\"")}"]`
  let mutation = formatMutation("skipClaimsReview", claimUuids, clientMutationLabel);
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
  let claimUuids = `uuids: ["${claims.map(c => c.uuid).join("\",\"")}"]`
  let mutation = formatMutation("processClaims", claimUuids, clientMutationLabel);
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

export function claimHealthFacilitySet(healthFacility) {
  return dispatch => {
    dispatch({ type: 'CLAIM_EDIT_HEALTH_FACILITY_SET', payload: healthFacility })
  }
}

export function print() {
  return dispatch => {
    dispatch({ type: 'CLAIM_PRINT' })
  }
}

export function generate(uuid) {
  var url = new URL(`${window.location.origin}${baseApiUrl}/claim/print/`);
  url.search = new URLSearchParams({ uuid });
  return (dispatch) => {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => openBlob(blob, `${_uuid.uuid()}.pdf`, "pdf"))
      .then(e => dispatch({ type: 'CLAIM_PRINT_DONE' }))
  }
}