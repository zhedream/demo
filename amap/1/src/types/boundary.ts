export interface Bound {
    type:     string;
    features: Feature[];
}

export interface Feature {
    type:       string;
    properties: Properties;
    geometry:   Geometry;
}

export interface Geometry {
    type:        string;
    coordinates: Array<Array<Array<number[]>>>;
}

export interface Properties {
    adcode:      number;
    name:        string;
    center:      number[];
    centroid:    number[];
    childrenNum: number;
    level:       string;
    acroutes:    number[];
    parent:      Parent;
}

export interface Parent {
    adcode: number;
}
