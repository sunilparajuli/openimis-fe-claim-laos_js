import _ from "lodash";

export const CLAIM_STATUS = [1, 2, 4, 8, 16]
export const REVIEW_STATUS = [1, 2, 4, 8, 16]
export const FEEDBACK_STATUS = [1, 2, 4, 8, 16]
export const APPROVAL_STATUS = [1, 2]
export const REJECTION_REASONS = _.range(-1, 20)
export const FEEDBACK_ASSESSMENTS = _.range(0, 6)