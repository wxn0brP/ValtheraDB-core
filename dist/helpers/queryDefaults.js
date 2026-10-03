export function applyAddDefaults(q) {
    q.control ||= {};
    q.id_gen ??= true;
}
export function applyFindDefaults(q) {
    q.search ||= {};
    q.dbFindOpts ||= {};
    q.findOpts ||= {};
    q.context ||= {};
    q.control ||= {};
}
export function applyFindOneDefaults(q) {
    q.findOpts ||= {};
    q.context ||= {};
    q.control ||= {};
}
export function applyUpdateDefaults(q) {
    q.context ||= {};
    q.control ||= {};
}
export function applyRemoveDefaults(q) {
    q.context ||= {};
    q.control ||= {};
}
export function applyUpdateOneOrAddDefaults(q) {
    q.context ||= {};
    q.add_arg ||= {};
    q.control ||= {};
    q.id_gen ??= true;
}
export function applyToggleOneDefaults(q) {
    q.data ||= {};
    q.context ||= {};
    q.control ||= {};
}
