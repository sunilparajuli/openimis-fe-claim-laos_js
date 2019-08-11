import { parseData, formatServerError, formatGraphQLError } from '@openimis/fe-core';

function reducer(
    state = {
        fetchingClaimAdmins: false,
        fetchedClaimAdmins: false,
        errorClaimAdmins: null,
        claimAdmins: null,
        fetchingClaims: false,
        fetchedClaims: false,
        errorClaims: null,
        claims: null,   
        fetchingBatchRuns: false,
        fetchedBatchRuns: false,
        errorBatchRuns: null,
        batchRuns: [],                   
    },
    action,
) {
    switch (action.type) {
        case 'CLAIM_CLAIM_ADMINS_REQ':
            return {
                ...state,
                fetchingClaimAdmins: true,
                fetchedClaimAdmins: false,
                claimAdmins: null,
                errorClaimAdmins: null,
            };
        case 'CLAIM_CLAIM_ADMINS_RESP':
            return {
                ...state,
                fetchingClaimAdmins: false,
                fetchedClaimAdmins: true,
                claimAdmins: parseData(action.payload.data.claimAdmins),
                errorClaimAdmins: formatGraphQLError(action.payload)
            };
        case 'CLAIM_CLAIM_ADMINS_ERR':
            return {
                ...state,
                fetchingClaimAdmins: false,
                errorClaimAdmins: formatServerError(action.payload)
            };
        case 'CLAIM_CLAIMS_REQ':
            return {
                ...state,
                fetchingClaims: true,
                fetchedClaims: false,
                claims: null,
                errorClaims: null,
            };
        case 'CLAIM_CLAIMS_RESP':
            return {
                ...state,
                fetchingClaims: false,
                fetchedClaims: true,
                claims: parseData(action.payload.data.claims),
                errorClaims: formatGraphQLError(action.payload)
            };
        case 'CLAIM_CLAIMS_ERR':
            return {
                ...state,
                fetchingClaims: false,
                errorClaims: formatServerError(action.payload)
            };
        case 'CLAIM_BATCH_RUNS_REQ':
            return {
                ...state,
                fetchingBatchRuns: true,
                fetchedBatchRuns: false,
                batchRuns: [],
                errorBatchRuns: null,
            };
        case 'CLAIM_BATCH_RUNS_RESP':
            return {
                ...state,
                fetchingBatchRuns: false,
                fetchedBatchRuns: true,
                batchRuns: parseData(action.payload.data.batchRuns),
                errorBatchRuns: formatGraphQLError(action.payload)
            };
        case 'CLAIM_BATCH_RUNS_ERR':
            return {
                ...state,
                fetchingBatchRuns: false,
                errorBatchRuns: formatServerError(action.payload)
            };            
        default:
            return state;
    }
}

export default reducer;
