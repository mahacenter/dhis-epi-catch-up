import React from "react";
import {CircularLoader} from "@dhis2/ui-core";

export const LoadSpinner = props => props.isLoading ?
    <CircularLoader />
    :
    <>{props.children}</>;
