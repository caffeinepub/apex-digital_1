import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Contact {
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface ProjectSubmission {
    projectId: string;
    package_: string;
    clientName: string;
    email: string;
    businessName: string;
    currentWebsite: string;
    businessType: string;
    whatTheyNeed: string;
    projectDescription: string;
    numberOfPages: string;
    needsContactForm: boolean;
    needsBooking: boolean;
    needsPaymentIntegration: boolean;
    needsDashboard: boolean;
    needsContentWriting: boolean;
    needsBranding: boolean;
    inspirationLinks: string;
    timeline: string;
    contentReadiness: string;
    additionalNotes: string;
    paymentStatus: string;
    transactionHash: string;
    timestamp: bigint;
}
export interface backendInterface {
    getContacts(): Promise<Array<Contact>>;
    submitContact(name: string, email: string, message: string): Promise<void>;
    submitProject(
        package_: string,
        clientName: string,
        email: string,
        businessName: string,
        currentWebsite: string,
        businessType: string,
        whatTheyNeed: string,
        projectDescription: string,
        numberOfPages: string,
        needsContactForm: boolean,
        needsBooking: boolean,
        needsPaymentIntegration: boolean,
        needsDashboard: boolean,
        needsContentWriting: boolean,
        needsBranding: boolean,
        inspirationLinks: string,
        timeline: string,
        contentReadiness: string,
        additionalNotes: string
    ): Promise<string>;
    getProjects(): Promise<Array<ProjectSubmission>>;
    updatePaymentStatus(projectId: string, status: string, txHash: string): Promise<boolean>;
}
