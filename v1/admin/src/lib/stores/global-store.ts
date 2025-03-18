import { writable } from 'svelte/store';

type adminDetails = {
	Image: string;
	Name: string;
};

export type GlobalStore = {
	adminDetails: adminDetails;
};

export const writableGlobalStore = writable<GlobalStore>({
	adminDetails: {
		Image: '',
		Name: ''
	}
});
