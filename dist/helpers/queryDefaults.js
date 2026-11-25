export function applyAddDefaults(q) {
    q.control ||= {};
    q.id_gen ??= true;
}
export function applyFindDefaults(q) {
    q.search ||= {};
    q.dbFindOpts ||= {};
    q.findOpts ||= {};
    q.control ||= {};
}
export function applyFindOneDefaults(q) {
    q.findOpts ||= {};
    q.control ||= {};
}
export function applyUpdateDefaults(q) {
    q.control ||= {};
}
export function applyRemoveDefaults(q) {
    q.control ||= {};
}
export function applyUpdateOneOrAddDefaults(q) {
    q.add_arg ||= {};
    q.control ||= {};
    q.id_gen ??= true;
}
export function applyToggleOneDefaults(q) {
    q.data ||= {};
    q.control ||= {};
}
export function applyCountDefaults(q) {
    q.search ||= {};
    q.control ||= {};
}
export function applyBulkAddDefaults(q) {
    q.datas ??= [];
    q.control ||= {};
    q.id_gen ??= true;
}
