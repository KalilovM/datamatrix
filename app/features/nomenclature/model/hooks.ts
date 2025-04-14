import { useFormContext } from "react-hook-form";
import { useGtinSizeStore } from "./gtinStore";
import type { CodeData } from "./types";

export const useHandleSaveGtinSize = () => {
	const { watch, setValue } = useFormContext();
	const codes: CodeData[] = watch("codes") || [];

	const handleSaveGtinSize = (
		newGtinSize: { id: string; size: string; GTIN: string },
		oldGtin?: string,
		oldSize?: number,
	) => {
		const updatedCodes = codes.map((code) => {
			if (code.GTIN === oldGtin && Number.parseInt(code.size) === oldSize) {
				return { ...code, GTIN: newGtinSize.GTIN, size: newGtinSize.size };
			}
			return code;
		});
		setValue("codes", updatedCodes);

		const { updateGtinSize, addGtinSize } = useGtinSizeStore.getState();
		if (oldGtin && oldSize) {
			updateGtinSize(oldGtin, oldSize, newGtinSize);
		} else {
			addGtinSize(newGtinSize);
		}
	};

	return { handleSaveGtinSize };
};
