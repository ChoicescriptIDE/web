import RAL from '../common/ral';
interface RIL extends RAL {
}
declare function RIL(): RIL;
declare namespace RIL {
    function install(): void;
}
export default RIL;
