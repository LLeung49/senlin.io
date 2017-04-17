export const INCREASE = "INCREASE"
export const DECREASE = "DECREASE"
export function increaseCounter(length) {
    return {type: INCREASE, payload: length}
}
export function decreaseCounter() {
    return {type: DECREASE}
}