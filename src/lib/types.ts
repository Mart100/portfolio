export interface Project {
	title: string;
	description: string;
	tags: string[];
	image: string;
	link?: string;
}

export interface ArchiveItem {
	title: string;
	image: string;
	backupImage?: string;
	link?: string;
	code?: string;
	created: string;
	score: number;
	description: string;
	techStack?: string[];
	tags?: string[];
}

export interface TravelPlace {
	name: string;
	lat: number;
	lng: number;
}

export interface TripNode extends TravelPlace {
	date: string;
	caption: string;
	image?: string;
}

export interface Trip {
	id: string;
	name: string;
	description: string;
	startDate: string;
	endDate: string;
	path: TripNode[];
	basePath?: string;
}

export interface TravelData {
	visited: string[];
	trips: Trip[];
	places: TravelPlace[];
}
