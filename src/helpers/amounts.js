
export function claimedAmount(r) {
    return !!r.qtyProvided && !!r.priceAsked ? r.qtyProvided * r.priceAsked : 0
}
export function approvedAmount(r) {
    if (r.status === 2) return 0;
    let qty = r.qtyApproved !== null && r.qtyApproved !== "" ? r.qtyApproved : r.qtyProvided;
    let price = r.priceApproved !== null && r.priceApproved !== "" ? r.priceApproved : r.priceAsked;
    return qty * price;
}