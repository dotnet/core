import { Slotable, Slot, HTMLSlotElement } from "./interfaces";
/**
 * Represents a mixin that allows nodes to become the contents of
 * a <slot> element. This mixin is implemented by {@link Element} and
 * {@link Text}.
 */
export declare class SlotableImpl implements Slotable {
    __name: string | undefined;
    __assignedSlot: Slot | null | undefined;
    get _name(): string;
    set _name(val: string);
    get _assignedSlot(): Slot | null;
    set _assignedSlot(val: Slot | null);
    /** @inheritdoc */
    get assignedSlot(): HTMLSlotElement | null;
}
